// Copyright 2011 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('embedsl.GLSLGenerator');

goog.require('embedsl.Ast');
goog.require('embedsl.Definition');
goog.require('embedsl.DefinitionKind');
goog.require('embedsl.Expression');
goog.require('embedsl.Kind');
goog.require('embedsl.GlobalNameStream');
goog.require('embedsl.Transformer');

/**
 * @param {boolean?} renameVariables Rename variables?
 * @constructor
 * @extends {embedsl.Transformer}
 */
embedsl.GLSLGenerator = function(renameVariables) {
  this.renameVariables = renameVariables;
};
goog.inherits(embedsl.GLSLGenerator, embedsl.Transformer);

/**
 * Rename identifiers if option 'rename' is set.
 *
 * @param {?string} name Identifier to rename.
 * @return {?string} New name.
 */
embedsl.GLSLGenerator.prototype.rename = function(name) {
  if (name && this.renameVariables)
    return embedsl.GlobalNameStream.rename(name);
  else
    return name;
};

/**
 * Push code segments onto the code stack.
 *
 * @param {?string} str Code segment.
 */
embedsl.GLSLGenerator.prototype.pushCode = function(str) {
  this.codestack.push(str || '');
};

/**
 * Pop n code segments from the stack at once.
 *
 * @param {number} n Number of segements to pop.
 * @return {Array.<string>} Array of n code segments.
 */
embedsl.GLSLGenerator.prototype.popCodeN = function(n) {
  return this.codestack.splice(-n, n);
};

/**
 * @return {string} Pop one code segment.
 */
embedsl.GLSLGenerator.prototype.popCode = function() {
  return this.codestack.pop();
};

/**
 * Generate GLSL source code from a definition.
 *
 * @param {!embedsl.Definition} def Definition.
 * @return {!embedsl.Definition} Definition with generated code.
 * @private
 */
embedsl.GLSLGenerator.prototype.genCodeForDefinition_ = function(def) {
  this.transformExpression(def.exp, def);

  switch (def.kind) {
  case embedsl.DefinitionKind.LOCAL:
    def.code =
        '    ' + def.type.glslName() +
        ' ' + this.rename(def.name) +
        ' = ' +
        this.popCode() + ';';
    break;

  case embedsl.DefinitionKind.BUILTIN:
  case embedsl.DefinitionKind.VARYING:
    def.code =
        '    ' + this.rename(def.name) +
        ' = ' +
        this.popCode() + ';';
    break;

  case embedsl.DefinitionKind.ACCUMULATE:
    def.code =
        '    ' + def.type.glslName() +
        ' ' + this.rename(def.name) +
        ' = ' +
        this.popCode() + ';';
  }
  return def;
};

/**
 * @override
 */
embedsl.GLSLGenerator.prototype.transformAst = function(ast) {
  this.uniforms = {
    'vertex': {}, 'fragment': {}
  };
  this.attributes = {
  };
  this.varyings = {
  };
  this.outputs = {
    'vertex': {}, 'fragment': {}
  };
  this.locals = {
    'vertex': {}, 'fragment': {}
  };
  this.functions = {
    'vertex': [], 'fragment': []
  };
  this.codestack = [''];

  for (var name in ast.definitions) {
    var def = ast.definitions[name];
    this.outputs[def.stage][def.name] =
        this.genCodeForDefinition_(def);
  }

  for (var name in ast.locals) {
    var def = ast.locals[name];
    this.locals[def.stage][def.name] =
        this.genCodeForDefinition_(def);
  }

  for (var name in ast.varyings) {
    var def = ast.varyings[name];
    this.varyings[def.name] =
        this.genCodeForDefinition_(def);
  }

  ast.vertexShader = this.generateCode_('vertex');
  ast.fragmentShader = this.generateCode_('fragment');
  ast.attributes = this.attributes;
  ast.uniforms = util.merge(this.uniforms['vertex'], this.uniforms['fragment']);

  return ast;
};


/**
 * Recusively generates code for an epression tree.
 *
 * @param {!embedsl.Expression} expression The expression to generate Code for.
 * @param {!embedsl.Definition} def The definition at the root of this expression.
 * @return {!embedsl.Expression} The expression that was passed in.
 */
embedsl.GLSLGenerator.prototype.transformExpression = function(expression, def) {
  for (var i = 0; i != expression.args.length; i++)
    this.transformExpression(expression.args[i], def);

  switch (expression.kind) {
  case embedsl.Kind.BUILTININPUT:
    this.pushCode(expression.name);
    return expression;

  case embedsl.Kind.REFERENCE:
    this.pushCode(this.rename(expression.name));
    def.referencedVariables.push(expression.name);
    return expression;

  case embedsl.Kind.ATTRIBUTE:
    this.attributes[expression.name] = expression;
    this.pushCode(expression.name);
    return expression;

  case embedsl.Kind.UNIFORM:
    this.uniforms[def.stage][expression.name] = expression;
    this.pushCode(expression.name);
    return expression;

  case embedsl.Kind.CONSTANT:
    this.pushCode(expression.info);
    return expression;

  case embedsl.Kind.BUILTIN:
    var args = this.popCodeN(expression.args.length);
    // TODO(tramberend) Clean this up. Maybe need another class.
    if (expression.name == 'select')
      this.pushCode('(' + args[0] + ' ? ' + args[1] + ' : ' + args[2] + ')');
    else
      this.pushCode(expression.info + '(' + args.join(', ') + ')');
    return expression;

  case embedsl.Kind.OPERATOR:
    if (expression.args.length == 1) {
      var arg = this.popCode();
      this.pushCode('(' + expression.info + ' ' + arg + ')');
    } else {
      var args = this.popCodeN(expression.args.length);
      this.pushCode('(' + args.join(' ' + expression.info + ' ') + ')');
    }
    return expression;

  case embedsl.Kind.GETTER:
    var arg = this.popCode();
    this.pushCode(arg + '[' + expression.index + ']');
    return expression;

  case embedsl.Kind.SWIZZLER:
    var arg = this.popCode();
    this.pushCode('(' + arg + ')' + '.' + expression.name);
    return expression;

  case embedsl.Kind.VIRTUAL:
    if (!expression.args[0])
      throw 'Pure virtual extension point declared, but never overridden.';
    return expression;

  case embedsl.Kind.ACCUMULATE:
    // Collect the compiled arguments of an accumulate expression.
    var args = this.popCodeN(expression.args.length);

    // Assemble a GLSL loop depending on the generator supplied.
    var loop;
    switch (expression.generator.kind) {
    case 'range':
      // A 'range' specifies an interval [from, to) and a step size and maps to
      // a for loop.
      loop =
          '    for (' + expression.args[2].type.glslName() +
          ' i = ' + args[2] +
          '; i != ' + args[3] +
          '; i += ' + args[4] + ')\n' +
          '        ' + expression.name +
          ' = ' + args[1] + ';';
      break;

    default:
      throw 'Unknown generator: ' + expression.generator.kind;
    }
    // An acumulate expression at this stage is always used as an initializer to
    // a local variable.
    this.pushCode(args[0] + ';\n' + loop);
    return expression;

  case embedsl.Kind.ACCUMULATOR:
    // The name of the accumulate expression is used as the variable name for
    // the accumulator.
    this.pushCode(def.exp.name);
    return expression;

  case embedsl.Kind.ITERATOR:
    // Iterators are always named 'i'.
    this.pushCode('i');
    return expression;

  case embedsl.Kind.DISCARD:
    var args = this.popCodeN(2);
    var name = 'function_' + embedsl.GlobalNameStream.create();
    this.pushCode(name + '(' + args.join(', ') + ')');
    this.functions[def.stage].push(
        expression.type.glslName() + ' ' + name + '(' +
        expression.args[0].type.glslName() + ' cond,' +
        expression.args[1].type.glslName() + ' result) ' +
        '{ if (cond) discard; else return result; }');
    return expression;
  default:
    return expression;
  }
};

/**
 * Assemble the GSLS source code from the generated fragments for the specified
 * stage..
 *
 * @param {string} stage Stage to generate code for.
 * @return {string} Generated code.
 * @private
 */
embedsl.GLSLGenerator.prototype.generateCode_ = function(stage) {
  var code = [];
  if (stage == 'vertex') {
    for (var a in this.attributes)
      code.push(
          'attribute ' + this.attributes[a].type.glslName() +
          ' ' + this.attributes[a].name + ';');
  }

  if (stage == 'fragment') {
    code.push('precision highp int;');
    code.push('precision highp float;');
    code.push('');
  }

  for (var u in this.uniforms[stage])
    code.push(
        'uniform ' + this.uniforms[stage][u].type.glslName() +
        ' ' + this.uniforms[stage][u].name + ';');

  for (var v in this.varyings)
    code.push(
        'varying ' + this.varyings[v].type.glslName() +
        ' ' + this.rename(this.varyings[v].name) + ';');
  code.push('');

  for (var f in this.functions[stage])
    code.push(this.functions[stage][f]);

  code.push('');
  code.push('void main() {');

  var localDefs;
  if (stage == 'vertex')
    localDefs = util.merge(this.locals['vertex'], this.varyings);
  else
    localDefs = this.locals['fragment'];

  var defsOrder = this.sortDefs_(localDefs);

  for (var i = 0; i != defsOrder.length; i++) {
    var def = localDefs[defsOrder[i]];
    code.push(def.code);
  }

  for (var o in this.outputs[stage]) {
    var def = this.outputs[stage][o];
    code.push(def.code);
  }

  code.push('}');

  return code.join('\n');
};

/**
 * Sorts the variable assignments correctly.
 *
 * @param {Object.<string,embedsl.Definition>} defs Definitions by name.
 * @return {Array.<string>} Names of the definitions in sorted order.
 * @private
 */
embedsl.GLSLGenerator.prototype.sortDefs_ = function(defs) {
  var sorted = [];
  for (var name in defs) {
    var i = sorted.length;
    for (var s = 0; s != sorted.length; s++) {
      if (defs[sorted[s]].referencedVariables.indexOf(name) != -1) {
        i = s;
        break;
      }
    }
    sorted.splice(i, 0, name);
  }
  return sorted;
};

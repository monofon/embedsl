// Copyright 2012 Google Inc. All Rights Reserved.
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

/**
 * @fileoverview Generation of DOT files.
 *
 */
goog.provide('embedsl.Plumber');

goog.require('embedsl.Ast');
goog.require('embedsl.Definition');
goog.require('embedsl.Expression');
goog.require('embedsl.Kind');
goog.require('embedsl.Transformer');

/**
 * Construct a plumber. Plumbing inserts varyings that tunnel values from the
 * vertex to the fragment shader.
 *
 * @constructor
 * @extends {embedsl.Transformer}
 */
embedsl.Plumber = function() {
  this.stage = [];
};
goog.inherits(embedsl.Plumber, embedsl.Transformer);

/**
 * Stages are managed on a stack. Check if 'stage' is the current stage on top
 * of the stack.
 *
 * @param {string} stage The stage to check against.
 * @return {boolean} True, if stage matches current stage.
 * @private
 */
embedsl.Plumber.prototype.isCurrentStage_ = function(stage) {
  return this.stage[this.stage.length - 1] == stage;
};

/**
 * @override
 */
embedsl.Plumber.prototype.transformAst = function(ast) {
  ast.vcount = 0;
  ast.varyings = {};
  this.ast = ast;
  for (var name in ast.locals) {
    var def = ast.locals[name];
    this.stage.push(def.stage);
    def.exp = this.transformExpression(def.exp);
    this.stage.pop();
  }
  for (var name in ast.definitions) {
    var def = ast.definitions[name];
    this.stage.push(def.stage);
    def.exp = this.transformExpression(def.exp);
    this.stage.pop();
  }
  return ast;
};


/**
 * Generates varyings where neccessary or advised.
 *
 * @param {!embedsl.Expression} expression The root of the expression tree.
 * @return {!embedsl.Expression} The transformed tree.
 * @override
 */
embedsl.Plumber.prototype.transformExpression = function(expression) {
  switch (expression.kind) {
  case embedsl.Kind.INTERPOLATE:
    // Interpolators signal a transition of values from vertex to fragment
    // shader.
    if (this.isCurrentStage_('vertex')) {
      // throw 'Should never happen with the mapper.';
      expression.args[0].args =
          goog.array.map(expression.args[0].args,
                         embedsl.Mapper.prototype.transformExpression, this);
      return expression.args[0];
    } else {
      // Change the vertex shader for this subtree by inserting a varying.
      this.stage.push('vertex');
      var transformed =
          this.insertVarying_(this.transformExpression(expression.args[0]));

      this.stage.pop();
      return transformed;
    }

  case embedsl.Kind.ATTRIBUTE:
    // Attribute access from the fragement shader needs plumbing.
    if (this.isCurrentStage_('fragment')) {
      return this.insertVarying_(expression);
    } else {
      // In the vertex shader. All good.
      return expression;
    }

  case embedsl.Kind.REFERENCE:
    // Where is the referenced local defined.
    var localDef = this.ast.locals[expression.name];
    if (!localDef || localDef.kind != embedsl.DefinitionKind.LOCAL) {
      return expression;

    } else if (this.isCurrentStage_(localDef.stage)) {
      // Definition in the same stage as the reference, all good.
      return expression;

    } else if (this.isCurrentStage_('fragment') && localDef.stage == 'vertex') {
      // Fragment shader access to a vertex shader local variable.
      this.stage.push('vertex');
      var result =
          this.insertVarying_(this.transformExpression(localDef.exp));

      this.stage.pop();
      return result;

    } else if (this.isCurrentStage_('vertex') && localDef.stage == 'fragment') {
      // This can never happen.
      throw 'ERROR: Local defintion in fragment stage found while traversing ' +
          'vertex stage.';
    }

  default:
    expression.args =
        goog.array.map(expression.args,
                       embedsl.Plumber.prototype.transformExpression, this);
    return expression;
  }
};

/**
 * Insert a varying into the expression tree.
 *
 * @param {!embedsl.Expression} exp Definining expression.
 * @return {!embedsl.Expression} Reference to the definition.
 * @private
 */
embedsl.Plumber.prototype.insertVarying_ = function(exp) {
  // Insert a varying definition ...
  var name = 'v' + this.ast.vcount++;
  var type = exp.type;

  this.ast.varyings[name] = new embedsl.Definition(
      embedsl.DefinitionKind.VARYING,
      'vertex',
      type,
      name,
      exp);

  this.ast.varyings[name].ref();
  return embedsl.Expression.reference(type, name);
};

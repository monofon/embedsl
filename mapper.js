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
 * @fileoverview Defines the Mapper transformer that ensures that definitions
 * are positioned as late as possible and as early as neccessary in the
 * pipeline.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('embedsl.Mapper');

goog.require('embedsl.Ast');
goog.require('embedsl.Definition');
goog.require('embedsl.Expression');
goog.require('embedsl.Kind');
goog.require('embedsl.Transformer');

/**
 * Construct a mapper. Mapping moves definitions to the approopriate shader
 * stage, possibly moving them upstream.
 *
 * @constructor
 * @extends {embedsl.Transformer}
 */
embedsl.Mapper = function() {
  this.stage = [];
};
goog.inherits(embedsl.Mapper, embedsl.Transformer);

/**
 * Stages are managed on a stack. Check if 'stage' is the current stage on top
 * of the stack.
 *
 * @param {string} stage The stage to check against.
 * @return {boolean} True, if stage matches current stage.
 * @private
 */
embedsl.Mapper.prototype.isCurrentStage_ = function(stage) {
  return this.stage[this.stage.length - 1] == stage;
};

/**
 * @override
 */
embedsl.Mapper.prototype.transformAst = function(ast) {
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
 * Moves definitions to the right pipeline stage.
 *
 * @override
 */
embedsl.Mapper.prototype.transformExpression = function(expression) {
  switch (expression.kind) {
  case embedsl.Kind.INTERPOLATE:
    // Interpolators signal a transition of values from vertex to
    // fragment shader.
    if (this.isCurrentStage_('vertex')) {
      // We already are in the vertex shader, take this thing out
      // and continue.

      expression.args[0].args =
          goog.array.map(expression.args[0].args,
                         embedsl.Mapper.prototype.transformExpression, this);
      return expression.args[0];
    } else {
      // Do the transition to the vertex shader and continue.
      this.stage.push('vertex');
      expression.args =
          goog.array.map(expression.args,
                         embedsl.Mapper.prototype.transformExpression, this);
      this.stage.pop();
      return expression;
    }
    break;

  case embedsl.Kind.REFERENCE:
    // Where is the referenced local defined.
    var ldef = this.ast.locals[expression.name];
    if (!ldef || ldef.kind != embedsl.DefinitionKind.LOCAL)
      return expression;

    if (this.isCurrentStage_('vertex') && ldef.stage == 'fragment') {
      // vertex shader acces to a fragment shader local
      // variable. Promote the definition to the vertex shader. Needs to
      // be transitive.
      ldef.stage = 'vertex';
      ldef.exp.args =
          goog.array.map(ldef.exp.args,
                         embedsl.Mapper.prototype.transformExpression, this);
    }
    return expression;

  default:
    goog.array.map(expression.args,
                   embedsl.Mapper.prototype.transformExpression, this);
    return expression;
  }
};

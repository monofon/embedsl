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
 * @fileoverview Take a list of local variable names and identities,
 * extract the defining subtree for each and replace direct references
 * with reference nodes.  Returns a forest of ast trees for the local
 * variables.
 *
 * Recursively extracts locals from the expression trees. Detected local
 * defintions are stored in ast.definitons and replace with references.
 *
 */
goog.provide('embedsl.Localizer');

goog.require('embedsl.Definition');
goog.require('embedsl.Transformer');

/**
 * @constructor
 * @extends {embedsl.Transformer}
 */
embedsl.Localizer = function() {
};
goog.inherits(embedsl.Localizer, embedsl.Transformer);

/**
 * @override
 */
embedsl.Localizer.prototype.transformAst = function(ast) {
  this.ast = ast;
  for (var name in ast.definitions) {
    var def = ast.definitions[name];
    this.rootStage = def.stage;
    def.exp = this.transformExpression(def.exp);
    def.copyType();
  }
  return ast;
};

/**
 * Find expressions marked as local and transform into defintion/reference
 * pairs.
 *
 * @override
 */
embedsl.Localizer.prototype.transformExpression = function(expression) {
  // Is the expression handle marked as a global variable?
  var name = this.isLocal_(expression);
  if (name) {
    // Yes. Check if we saw that one before.
    if (!this.ast.locals[name]) {
      var defKind =
          (expression.kind == embedsl.Kind.ACCUMULATE ?
              embedsl.DefinitionKind.ACCUMULATE : embedsl.DefinitionKind.LOCAL);

      // Save the transformed tree to the definitions map.
      expression.args =
          goog.array.map(expression.args,
                         embedsl.Localizer.prototype.transformExpression, this);
      this.ast.locals[name] =
          new embedsl.Definition(
              defKind,
              this.rootStage,
              expression.type,
              name,
              expression);
    }

    // Replace the tree with a named reference to the definition.
    this.ast.locals[name].ref();
    return embedsl.Expression.reference(expression.type, name);

  } else if (expression.kind == embedsl.Kind.ACCUMULATE) {

    expression.args =
        goog.array.map(expression.args,
                       embedsl.Localizer.prototype.transformExpression, this);
    this.ast.locals[expression.name] =
        new embedsl.Definition(
            embedsl.DefinitionKind.ACCUMULATE,
            this.rootStage,
            expression.type,
            expression.name,
            expression);

    this.ast.locals[expression.name].ref();
    return embedsl.Expression.reference(expression.type, expression.name);

  } else {
    // Not local. Move on, nothing to see here.
    expression.args =
        goog.array.map(expression.args,
                       embedsl.Localizer.prototype.transformExpression, this);
    return expression;
  }
};

/**
 * Decide if an expression is the value of a local variable.
 *
 * @param {!embedsl.Expression} exp An expression tree.
 * @return {?string} The name of the local variable, or null.
 * @private
 */
embedsl.Localizer.prototype.isLocal_ = function(exp) {
  for (var name in this.ast.marked)
    if (this.ast.marked[name] === exp)
      return name;
  return null;
};

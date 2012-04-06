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
 * @fileoverview Purges superflous local variables from the tree.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('embedsl.Purger');

goog.require('embedsl.Ast');
goog.require('embedsl.Definition');
goog.require('embedsl.Expression');
goog.require('embedsl.Kind');
goog.require('embedsl.Transformer');

/**
 * @constructor
 * @extends {embedsl.Transformer}
 */
embedsl.Purger = function() {
};
goog.inherits(embedsl.Purger, embedsl.Transformer);

/**
 * @override
 */
embedsl.Purger.prototype.transformAst = function(ast) {
  // Find the definitions to purge.
  this.purge = {};
  this.keep = {};
  for (var name in ast.locals) {
    var def = ast.locals[name];
    if (def.refcount == 1) {
      this.purge[name] = def;
    } else {
      this.keep[name] = def;
    }
  }
  // Find the references in the trees and replace them.
  for (var name in ast.definitions) {
    var def = ast.definitions[name];
    this.stage = def.stage;
    def.exp = this.transformExpression(def.exp);
  }
  for (var name in this.keep) {
    var def = this.keep[name];
    this.stage = def.stage;
    def.exp = this.transformExpression(def.exp);
  }

  ast.locals = this.keep;
  return ast;
};

/**
 * Purge local definitions with just one reference to them.
 *
 * @param {!embedsl.Expression} expression The root of the expression tree.
 * @return {!embedsl.Expression} The transformed tree.
 * @override
 */
embedsl.Purger.prototype.transformExpression = function(expression) {
  // Handle arguments first.
  for (var i = 0; i != expression.args.length; i++)
    this.transformExpression(expression.args[i]);

  switch (expression.kind) {
  case embedsl.Kind.REFERENCE:
    var purge = this.purge[expression.name];
    if (purge) {

      return this.transformExpression(purge.exp);
    } else {

      return expression;
    }
  default:
    return expression;
  }
};

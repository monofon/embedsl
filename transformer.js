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
 * @fileoverview Defines the base class for the compiler transformation stages.
 *
 */
goog.provide('embedsl.Transformer');
goog.provide('embedsl.TransformerFunction');

goog.require('embedsl.Ast');
goog.require('embedsl.Expression');

/**
 * @constructor
 */
embedsl.Transformer = function() {
};

/**
 * @param {!embedsl.Ast} ast The AST so far.
 * @return {!embedsl.Ast} The transformed AST.
 */
embedsl.Transformer.prototype.transformAst = function(ast) {
  return ast;
};

/**
 * @param {!embedsl.Expression} expression Any expression.
 * @return {!embedsl.Expression} The transformed expression.
 */
embedsl.Transformer.prototype.transformArguments = function(expression) {
  for (var i = 0; i != expression.args.length; i++)
    expression.args[i] = this.transformExpression(expression.args[i]);
  return expression;
};

/**
 * @param {!embedsl.Expression} expression Any expression.
 * @return {!embedsl.Expression} The transformed expression.
 */
embedsl.Transformer.prototype.transformExpression = function(expression) {
  return this.transformArguments(expression);
};

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

/**
 * @fileoverview Defines the Inferrer class that traverses the trees and infers
 * the type of all yet untyped expressions from the types of their arguments.
 *
 */
goog.provide('embedsl.Inferrer');

goog.require('embedsl.Ast');
goog.require('embedsl.Definition');
goog.require('embedsl.Transformer');
goog.require('goog.array');
goog.require('goog.string');

/**
 * Constructs a Inferrer instance. An Inferrer traverses the trees and inferes
 * the type of all yet untyped expressions from the types of their
 * arguments. Afterwards, all expressions are guarantied to be typed.
 *
 * @constructor
 * @extends {embedsl.Transformer}
 */
embedsl.Inferrer = function() {
};
goog.inherits(embedsl.Inferrer, embedsl.Transformer);

/**
 * @override
 */
embedsl.Inferrer.prototype.transformAst = function(ast) {
  /** @type {Array.<embedsl.Expression>} */
  this.loopStack = [];

  this.ast = ast;
  for (var name in ast.definitions) {
    var def = ast.definitions[name];
    this.transformExpression(def.exp);
    def.copyType();
  }

  for (var name in ast.locals) {
    var def = ast.locals[name];
    this.transformExpression(def.exp);
    def.copyType();
  }
  return ast;
};

/**
 * Infers the types of all yet untyped expressions. Also performs type checking.
 *
 * @override
 */
embedsl.Inferrer.prototype.transformExpression = function(expression) {
  switch (expression.kind) {
  case embedsl.Kind.ACCUMULATE:
    // Stack accumlate expressions for nested loops.
    this.loopStack.push(expression);
    for (var i = 0; i != expression.args.length; i++)
      this.transformExpression(expression.args[i]);
    this.loopStack.pop();
    break;

  case embedsl.Kind.ACCUMULATOR:
    // Derive type from the stacked accumulate expression.
    var loop = this.loopStack[this.loopStack.length - 1];
    expression.typeInfo =
        new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT,
                             loop.accumulatorType());
    break;

  case embedsl.Kind.ITERATOR:
    // Derive type from the stacked accumulate expression.
    var loop = this.loopStack[this.loopStack.length - 1];
    expression.typeInfo =
        new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT,
                             loop.iteratorType());
    break;

  default:
    for (var i = 0; i != expression.args.length; i++)
      this.transformExpression(expression.args[i]);
  }

  var argumentTypes = [];
  for (var i = 0; i != expression.args.length; i++) {
    argumentTypes.push(expression.args[i].type);

    // TODO(tramberend) Remove.
    if (!expression.args[i].type) debugger;
  }

  this.typecheckExpressionArguments_(expression, argumentTypes);
  expression.type = expression.typeInfo.calculateReturnType(argumentTypes);

  return expression;
};

/**
 * Typecheck the arguments against the expression parameter list.
 *
 * @param {!embedsl.Expression} expression The expression.
 * @param {!Array.<!embedsl.Type>} types The arguments types.
 * @private
 */
embedsl.Inferrer.prototype.typecheckExpressionArguments_ =
function(expression, types) {
  var violations = expression.typeInfo.typeCheckArguments(types);

  if (violations.length > 0) {
    var actual = [];
    for (var i = 0; i != types.length; i++)
      actual.push(types[i].glslName());

    var expect = [];
    var pls = expression.typeInfo.parameterTypeLists();
    for (var i = 0; i != pls.length; i++)
      expect.push(pls[i].toString(violations[i]));

    var error =
        'Type error: Expression \'' + expression.name +
        '\' does not accept an argument list of this type.\n' +
        'Actual:   (' + actual.join(', ') + ')\n' +
        'Expected: ' + expect.join('\n          ') + '\n' +
        'Context:  \n' + expression.toString(3);

    throw error;
  }
};

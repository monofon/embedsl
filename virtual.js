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
 * @fileoverview Expressions with expressions as arguments.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('embedsl.Virtual');

goog.require('embedsl.Expression');

/**
 * A virtual expression that can be overriden.
 *
 * @param {embedsl.Argument} definition Default value.
 * @constructor
 * @extends {embedsl.Expression}
 */
embedsl.Virtual = function(definition) {
  goog.base(this, embedsl.Kind.VIRTUAL,
            embedsl.TypeInfo.OneArgAnyType,
            'virtual', null, (definition ? [definition] : []));
};
goog.inherits(embedsl.Virtual, embedsl.Expression);

/**
 * Override the current definition with a new one. Also check for definition
 * cycles.
 *
 * @param {!embedsl.Argument}
 * replacement Overriding expression.
 */
embedsl.Virtual.prototype.override = function(replacement) {
  try {
    var expression = embedsl.Expression.replaceLiteral(replacement);
    this.detectCycle(expression);
    this.args[0] = expression;
  }
  catch (e) {
    throw 'Virtual expression can not be overriden with value: ' + replacement;
  }
};

/**
 * Provides access to the value of the virtual. Usefull if the previous value is
 * needed prior to overriding.
 *
 * @return {!embedsl.Expression} The super value.
 */
embedsl.Virtual.prototype.value = function() {
  return this.args[0];
};

/**
 * Check if the candidate expression to be overriden is referenced in
 * the replacement expression tree.
 *
 * @param {!embedsl.Argument} replacement Expression to be substituted.
 */
embedsl.Virtual.prototype.detectCycle = function(replacement) {
  if (this === replacement)
    throw 'Override would introduce a cycle into the expression graph.';

  for (var i = 0; i != replacement.args.length; i++)
    this.detectCycle(replacement.args[0]);
};

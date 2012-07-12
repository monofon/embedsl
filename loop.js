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
 * @fileoverview Expressions that emulate looping contructs. Because shader
 * expressions are side-effect free, a more functional approach to iteration is
 * needed. The accumulate expression implements a basic folding operation. The
 * range epression generates sequences that can be used as index sets.
 *
 */
goog.provide('embedsl.Accumulate');
goog.provide('embedsl.Accumulator');
goog.provide('embedsl.Generator');
goog.provide('embedsl.Iterator');

goog.require('embedsl.Expression');

/**
 * Creates the most basic iteration construct know to man, the 'fold' or
 * 'reduce' operation. An accumulator is initialized and together with the
 * iterator provided to the body expression. The body evaluates to the new value
 * of the acumulator. The generator defines how the iterator is generated for
 * each successive iteration.
 *
 * @extends {embedsl.Expression}
 * @param {embedsl.Generator} generator Defines a stream of iterators.
 * @param {embedsl.Expression} init The initial value for the accumulator.
 * @param {embedsl.Expression} body An expression that evaluates to a new value of
 * the iterator. Has implicit access to the iterator and accumulator objects.
 * @constructor
 */
embedsl.Accumulate = function(generator, init, body) {
  goog.base(this, embedsl.Kind.ACCUMULATE,
            new embedsl.TypeInfo(
                embedsl.TypeDependency.SAME_AS_ARG0, null,
                [new embedsl.ParameterTypeList(
                    [embedsl.Type.Any, embedsl.Type.Any, generator.type],
                    [], true)]),
            'loop' + embedsl.Accumulate.count++, null,
            [].concat(init, body, generator.args));

  this.generator = generator;
};
goog.inherits(embedsl.Accumulate, embedsl.Expression);

/**
 * @return {embedsl.Type} Type of the loop accumulator.
 */
embedsl.Accumulate.prototype.accumulatorType = function() {
  return this.args[0].type;
};

/**
 * @return {!embedsl.Type} Type of the loop iterator.
 */
embedsl.Accumulate.prototype.iteratorType = function() {
  return this.generator.type;
};

/**
 * Accumulators are global variables and need uniques names. Count is used to
 * generate them.
 *
 * @type {number}
 */
embedsl.Accumulate.count = 0;

/**
 * An Iterator object is used to reference the loop iterator. Can only be used
 * inside a loop body expression.
 *
 * @extends {embedsl.Expression}
 * @constructor
 */
embedsl.Iterator = function() {
  goog.base(this, embedsl.Kind.ITERATOR, embedsl.TypeInfo.Unspecified, 'iterator');
};
goog.inherits(embedsl.Iterator, embedsl.Expression);

/**
 * An Accumulator object is used to reference a loops accumulating variable. Can
 * only be used inside a loop body expression.
 *
 * @extends {embedsl.Expression}
 * @constructor
 */
embedsl.Accumulator = function() {
  goog.base(this,
            embedsl.Kind.ACCUMULATOR,
            embedsl.TypeInfo.Unspecified,
            'accumulator');
};
goog.inherits(embedsl.Accumulator, embedsl.Expression);

// TODO(tramberend) In the future iteration over arrays will be supported.
/**
 * A generic generator object defines how iterators are generated for the
 * accumulate expresion.
 *
 * @param {string} kind The kind of generator to use. Currently only 'range' is
 * supported. Range generates iterators from the interval [from,to) using step
 * as the step size. From, to and step can be expressions and passed in that
 * order following the kind argument. Step defaults to 1.
 *
 * @param {...!embedsl.Argument} var_args Arguments for the generator.
 * @param {!embedsl.Type} type The type of iterators this generator creates.
 * @constructor
 */
embedsl.Generator = function(kind, type, var_args) {
  this.kind = kind;
  this.type = type;
  this.args = Array.prototype.slice.call(arguments, 2);
  while (!goog.isDefAndNotNull(this.args[this.args.length - 1]))
    this.args.pop();
};

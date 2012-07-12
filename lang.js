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
 * @fileoverview This file contains factory functions that generate expressions
 * for GLSL built-in functions, operators and constructors.
 *
 * ATTENTION: Do not edit. This file has been generated from
 * proto/lang-proto.js, gen/gen-operators.rb, and gen/gen-functions.rb by
 * rakefile. Edit those files instead.
 *
 */
goog.provide('embedsl.lang');

goog.require('embedsl.Accumulate');
goog.require('embedsl.Accumulator');
goog.require('embedsl.Argument');
goog.require('embedsl.Expression');
goog.require('embedsl.Generator');
goog.require('embedsl.Iterator');
goog.require('embedsl.Virtual');
goog.require('goog.vec');
goog.require('goog.vec.Mat3');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');
goog.require('goog.vec.Vec4');
goog.require('util');

/**
 * Selects on of two expressions depending on the condition. Maps to the GLSL
 * selection opertor ?:.
 *
 * @param {!(embedsl.Expression|boolean)} arg0 Condition.
 * @param {!(embedsl.Expression|goog.vec.ArrayType|number|boolean)} arg1 True
 * expression.
 * @param {!(embedsl.Expression|goog.vec.ArrayType|number|boolean)} arg2 False
 * expression.
 * @return {!embedsl.Expression} Selection expression.
 */
embedsl.lang.select =
    (function() {
       var cached = new embedsl.TypeInfo(
           embedsl.TypeDependency.SAME_AS_ARG1, null,
           [new embedsl.ParameterTypeList([embedsl.Type.Bool, embedsl.Type.Any, embedsl.Type.Any])]);

       return function(arg0, arg1, arg2) {
         return new embedsl.Expression(
             embedsl.Kind.BUILTIN, cached, 'select', null, [arg0, arg1, arg2]);
       };
     })();

/**
 * The expression will be evaluated in the vertex shader. The result is
 * interpolated by the rasterizer.
 *
 * @param {!embedsl.Expression} exp Expression to be evaluated in the vertex shader.
 * @return {!embedsl.Expression} Interpolated expression.
 */
embedsl.lang.perVertex = function(exp) {
  return new embedsl.Expression(
      embedsl.Kind.INTERPOLATE,
      embedsl.TypeInfo.OneArgAnyType,
      null,
      null,
      [exp]);
};

/**
 * The expression will be evaluated in the vertex shader. The result is
 * interpolated by the rasterizer and then normalized.
 *
 * @param {!embedsl.Expression} exp Expression to be evaluated in the vertex shader.
 * @return {!embedsl.Expression} Interpolated and normalized expression.
 */
embedsl.lang.perVertexN = function(exp) {
  return embedsl.lang.normalize(embedsl.lang.perVertex(exp));
};

/**
 * Mark the expression as virtual. Virtual expression can be overriden later.
 *
 * @param {!embedsl.Expression} exp Expression.
 * @return {!embedsl.Virtual} Virtual expression.
 */
embedsl.lang.virtual = function(exp) {
  return new embedsl.Virtual(exp);
};

/**
 * Creates an accumulating loop over a body expression.
 *
 * @param {embedsl.Generator} generator The generator for the iterators.
 * @param {embedsl.Expression} init Initial value of the accumulator.
 * @param {embedsl.Expression} body The loop body.
 * @return {embedsl.Accumulate} The accumulate expression.
 */
embedsl.lang.accumulate = function(generator, init, body) {
  return new embedsl.Accumulate(generator, init, body);
};

/**
 * @type {embedsl.Accumulator}
 */
embedsl.lang.accumulator = new embedsl.Accumulator();

/**
 * @type {embedsl.Iterator}
 */
embedsl.lang.iterator = new embedsl.Iterator();

/**
 * Creates a generator for interators in a loop expression. Generates iterators
 * from the interval [from,to) using step as the step size. From, to and step
 * can be expressions. Step defaults to 1.
 *
 * @param {!embedsl.Argument} from Inclusive left border of the interval.
 * @param {!embedsl.Argument} to Exclusive right border of the interval.
 * @param {!embedsl.Argument=} step Step size.
 * @return {embedsl.Generator} The generator.
 */
embedsl.lang.range = function(from, to, step) {
  return new embedsl.Generator('range', embedsl.Type.Float, from, to, step || 1);
};

/**
 * @param {!(embedsl.Expression|boolean)} cond If true, discard.
 * @param {!embedsl.Argument} orElse Otherwise return this.
 * @return {!embedsl.Expression} New expresison.
 */
embedsl.lang.discardOrElse = function(cond, orElse) {
  return new embedsl.Expression(
      embedsl.Kind.DISCARD,
      new embedsl.TypeInfo(
          embedsl.TypeDependency.SAME_AS_ARG1, null,
          [new embedsl.ParameterTypeList([embedsl.Type.Bool, embedsl.Type.Any])]),
      'discardOrElse', null,
      [cond, orElse]);
};

/**
 * @type {!embedsl.Expression}
 */
embedsl.lang.gl_FragCoord = new embedsl.Expression(
    embedsl.Kind.BUILTININPUT,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4),
    'gl_FragCoord');

/**
 * @type {!embedsl.Expression}
 */
embedsl.lang.gl_FrontFacing = new embedsl.Expression(
    embedsl.Kind.BUILTININPUT,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool),
    'gl_FrontFacing');

/**
 * @type {!embedsl.Expression}
 */
embedsl.lang.gl_PointCoord = new embedsl.Expression(
    embedsl.Kind.BUILTININPUT,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec2),
    'gl_PointCoord');



/**
 * Create expression for GLSL operator '+'.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Vec3.AnyType)} arg0
 * Operator argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.plus = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'plus', '+', args);
  };
})();

/**
 * Create expression for GLSL operator '*'.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg1
 * Operator argument 1.
 * @param {...!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} argn
 * Operator arguments.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.mul = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.MULTIPLICATION, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4)], [embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION], true)]);
  return function(arg0, arg1, argn) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'mul', '*', args);
  };
})();

/**
 * Create expression for GLSL operator '!='.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg1
 * Operator argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.neq = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0, arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'neq', '!=', args);
  };
})();

/**
 * Create expression for GLSL operator '-'.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg1
 * Operator argument 1.
 * @param {...!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} argn
 * Operator arguments.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.sub = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_MAX_ARG, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_OR_SCALAR], true)]);
  return function(arg0, arg1, argn) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'sub', '-', args);
  };
})();

/**
 * Create expression for GLSL operator '>='.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|number)} arg1
 * Operator argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.gte = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0, arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'gte', '>=', args);
  };
})();

/**
 * Create expression for GLSL operator '>'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|number)} arg1
 * Operator argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.gt = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0, arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'gt', '>', args);
  };
})();

/**
 * Create expression for GLSL operator '+'.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg1
 * Operator argument 1.
 * @param {...!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} argn
 * Operator arguments.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.add = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_MAX_ARG, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_OR_SCALAR], true)]);
  return function(arg0, arg1, argn) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'add', '+', args);
  };
})();

/**
 * Create expression for GLSL operator '!'.
 *
 * @param {!(embedsl.Expression|boolean)} arg0
 * Operator argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.negate = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bool)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'negate', '!', args);
  };
})();

/**
 * Create expression for GLSL operator '-'.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Vec3.AnyType)} arg0
 * Operator argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.minus = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'minus', '-', args);
  };
})();

/**
 * Create expression for GLSL operator '||'.
 *
 * @param {!(embedsl.Expression|boolean)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|boolean)} arg1
 * Operator argument 1.
 * @param {...!(embedsl.Expression|boolean)} argn
 * Operator arguments.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.or = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bool), new embedsl.TypeUnion(embedsl.Type.Bool)], [], true)]);
  return function(arg0, arg1, argn) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'or', '||', args);
  };
})();

/**
 * Create expression for GLSL operator '<='.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|number)} arg1
 * Operator argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.lte = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0, arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'lte', '<=', args);
  };
})();

/**
 * Create expression for GLSL operator '<'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|number)} arg1
 * Operator argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.lt = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0, arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'lt', '<', args);
  };
})();

/**
 * Create expression for GLSL operator '/'.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg1
 * Operator argument 1.
 * @param {...!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} argn
 * Operator arguments.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.div = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_MAX_ARG, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_OR_SCALAR], true)]);
  return function(arg0, arg1, argn) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'div', '/', args);
  };
})();

/**
 * Create expression for GLSL operator '&&'.
 *
 * @param {!(embedsl.Expression|boolean)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|boolean)} arg1
 * Operator argument 1.
 * @param {...!(embedsl.Expression|boolean)} argn
 * Operator arguments.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.and = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bool), new embedsl.TypeUnion(embedsl.Type.Bool)], [], true)]);
  return function(arg0, arg1, argn) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'and', '&&', args);
  };
})();

/**
 * Create expression for GLSL operator '^^'.
 *
 * @param {!(embedsl.Expression|boolean)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|boolean)} arg1
 * Operator argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.xor = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bool), new embedsl.TypeUnion(embedsl.Type.Bool)], [], false)]);
  return function(arg0, arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'xor', '^^', args);
  };
})();

/**
 * Create expression for GLSL operator '=='.
 *
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg0
 * Operator argument 0.
 * @param {!(embedsl.Expression|Array.<number>|goog.vec.Vec4.AnyType|number|goog.vec.Mat3.AnyType|goog.vec.Vec3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg1
 * Operator argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.eq = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec2, embedsl.Type.Mat4, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0, arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, 'eq', '==', args);
  };
})();

/**
 * Create expression for GLSL function 'texture2DProjLod'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.texture2DProjLod = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Sampler2d), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'texture2DProjLod', 'texture2DProjLod', args);
  };
})();

/**
 * Create expression for GLSL function 'distance'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.distance = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Float, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'distance', 'distance', args);
  };
})();

/**
 * Create expression for GLSL function 'sin'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.sin = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'sin', 'sin', args);
  };
})();

/**
 * Create expression for GLSL function 'reflect'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.reflect = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'reflect', 'reflect', args);
  };
})();

/**
 * Create expression for GLSL function 'dot'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.dot = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Float, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'dot', 'dot', args);
  };
})();

/**
 * Create expression for GLSL function 'abs'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.abs = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'abs', 'abs', args);
  };
})();

/**
 * Create expression for GLSL function 'cos'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.cos = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'cos', 'cos', args);
  };
})();

/**
 * Create expression for GLSL function 'mat4'.
 *
 * @param {!(embedsl.Expression|number|boolean|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec4.AnyType)=} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number|goog.vec.Vec4.AnyType)=} arg2
 * Function argument 2.
 * @param {!(embedsl.Expression|number|goog.vec.Vec4.AnyType)=} arg3
 * Function argument 3.
 * @param {!(embedsl.Expression|number)=} arg4
 * Function argument 4.
 * @param {!(embedsl.Expression|number)=} arg5
 * Function argument 5.
 * @param {!(embedsl.Expression|number)=} arg6
 * Function argument 6.
 * @param {!(embedsl.Expression|number)=} arg7
 * Function argument 7.
 * @param {!(embedsl.Expression|number)=} arg8
 * Function argument 8.
 * @param {!(embedsl.Expression|number)=} arg9
 * Function argument 9.
 * @param {!(embedsl.Expression|number)=} arg10
 * Function argument 10.
 * @param {!(embedsl.Expression|number)=} arg11
 * Function argument 11.
 * @param {!(embedsl.Expression|number)=} arg12
 * Function argument 12.
 * @param {!(embedsl.Expression|number)=} arg13
 * Function argument 13.
 * @param {!(embedsl.Expression|number)=} arg14
 * Function argument 14.
 * @param {!(embedsl.Expression|number)=} arg15
 * Function argument 15.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.mat4 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Mat4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec4, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Vec4, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Vec4, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Vec4, embedsl.Type.Ivec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    arg6,
    arg7,
    arg8,
    arg9,
    arg10,
    arg11,
    arg12,
    arg13,
    arg14,
    arg15) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'mat4', 'mat4', args);
  };
})();

/**
 * Create expression for GLSL function 'mat3'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|boolean)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType)=} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType)=} arg2
 * Function argument 2.
 * @param {!(embedsl.Expression|number)=} arg3
 * Function argument 3.
 * @param {!(embedsl.Expression|number)=} arg4
 * Function argument 4.
 * @param {!(embedsl.Expression|number)=} arg5
 * Function argument 5.
 * @param {!(embedsl.Expression|number)=} arg6
 * Function argument 6.
 * @param {!(embedsl.Expression|number)=} arg7
 * Function argument 7.
 * @param {!(embedsl.Expression|number)=} arg8
 * Function argument 8.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.mat3 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Mat3, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    arg6,
    arg7,
    arg8) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'mat3', 'mat3', args);
  };
})();

/**
 * Create expression for GLSL function 'mat2'.
 *
 * @param {!(embedsl.Expression|number|boolean|Array.<number>)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|Array.<number>)=} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)=} arg2
 * Function argument 2.
 * @param {!(embedsl.Expression|number)=} arg3
 * Function argument 3.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.mat2 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec2, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec2, embedsl.Type.Ivec2), new embedsl.TypeUnion(embedsl.Type.Vec2, embedsl.Type.Ivec2)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1,
    arg2,
    arg3) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'mat2', 'mat2', args);
  };
})();

/**
 * Create expression for GLSL function 'vec4'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|boolean|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)=} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)=} arg2
 * Function argument 2.
 * @param {!(embedsl.Expression|number)=} arg3
 * Function argument 3.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.vec4 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1,
    arg2,
    arg3) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'vec4', 'vec4', args);
  };
})();

/**
 * Create expression for GLSL function 'vec3'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|boolean|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)=} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)=} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.vec3 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec3, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Int, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'vec3', 'vec3', args);
  };
})();

/**
 * Create expression for GLSL function 'vec2'.
 *
 * @param {!(embedsl.Expression|number|boolean)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number)=} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.vec2 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec2, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'vec2', 'vec2', args);
  };
})();

/**
 * Create expression for GLSL function 'greaterThan'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.greaterThan = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'greaterThan', 'greaterThan', args);
  };
})();

/**
 * Create expression for GLSL function 'faceforward'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.faceforward = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'faceforward', 'faceforward', args);
  };
})();

/**
 * Create expression for GLSL function 'smoothstep'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.smoothstep = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG2, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float), new embedsl.TypeUnion(embedsl.Type.Float), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'smoothstep', 'smoothstep', args);
  };
})();

/**
 * Create expression for GLSL function 'sign'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.sign = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'sign', 'sign', args);
  };
})();

/**
 * Create expression for GLSL function 'textureCubeLod'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.textureCubeLod = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Samplercube), new embedsl.TypeUnion(embedsl.Type.Vec3), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'textureCubeLod', 'textureCubeLod', args);
  };
})();

/**
 * Create expression for GLSL function 'notEqual'.
 *
 * @param {!(embedsl.Expression|Array.<boolean>|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|Array.<boolean>|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.notEqual = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Bvec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Bvec2), new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Bvec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Bvec2)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'notEqual', 'notEqual', args);
  };
})();

/**
 * Create expression for GLSL function 'matrixCompMult'.
 *
 * @param {!(embedsl.Expression|goog.vec.Mat3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Mat3.AnyType|goog.vec.AnyType|goog.vec.Mat4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.matrixCompMult = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG0, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Mat3, embedsl.Type.Vec2, embedsl.Type.Mat4), new embedsl.TypeUnion(embedsl.Type.Mat3, embedsl.Type.Vec2, embedsl.Type.Mat4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'matrixCompMult', 'matrixCompMult', args);
  };
})();

/**
 * Create expression for GLSL function 'mod'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.mod = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG0, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'mod', 'mod', args);
  };
})();

/**
 * Create expression for GLSL function 'fract'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.fract = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'fract', 'fract', args);
  };
})();

/**
 * Create expression for GLSL function 'ceil'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.ceil = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'ceil', 'ceil', args);
  };
})();

/**
 * Create expression for GLSL function 'sqrt'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.sqrt = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'sqrt', 'sqrt', args);
  };
})();

/**
 * Create expression for GLSL function 'log'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.log = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'log', 'log', args);
  };
})();

/**
 * Create expression for GLSL function 'textureCube'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)=} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.textureCube = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Samplercube), new embedsl.TypeUnion(embedsl.Type.Vec3), new embedsl.TypeUnion(embedsl.Type.Float)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Samplercube), new embedsl.TypeUnion(embedsl.Type.Vec3)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'textureCube', 'textureCube', args);
  };
})();

/**
 * Create expression for GLSL function 'not'.
 *
 * @param {!(embedsl.Expression|Array.<boolean>)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|Array.<boolean>)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.not = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Bvec3, embedsl.Type.Bvec2), new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Bvec3, embedsl.Type.Bvec2)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'not', 'not', args);
  };
})();

/**
 * Create expression for GLSL function 'any'.
 *
 * @param {!(embedsl.Expression|Array.<boolean>)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|Array.<boolean>)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.any = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Bvec3, embedsl.Type.Bvec2), new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Bvec3, embedsl.Type.Bvec2)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'any', 'any', args);
  };
})();

/**
 * Create expression for GLSL function 'greaterThanEqual'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.greaterThanEqual = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'greaterThanEqual', 'greaterThanEqual', args);
  };
})();

/**
 * Create expression for GLSL function 'cross'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.cross = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec3, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3), new embedsl.TypeUnion(embedsl.Type.Vec3)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'cross', 'cross', args);
  };
})();

/**
 * Create expression for GLSL function 'clamp'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.clamp = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG0, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'clamp', 'clamp', args);
  };
})();

/**
 * Create expression for GLSL function 'pow'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.pow = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'pow', 'pow', args);
  };
})();

/**
 * Create expression for GLSL function 'acos'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.acos = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'acos', 'acos', args);
  };
})();

/**
 * Create expression for GLSL function 'radians'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.radians = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'radians', 'radians', args);
  };
})();

/**
 * Create expression for GLSL function 'texture2D'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|Array.<number>)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)=} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.texture2D = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Sampler2d), new embedsl.TypeUnion(embedsl.Type.Vec2), new embedsl.TypeUnion(embedsl.Type.Float)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Sampler2d), new embedsl.TypeUnion(embedsl.Type.Vec2)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'texture2D', 'texture2D', args);
  };
})();

/**
 * Create expression for GLSL function 'texture2DLod'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|Array.<number>)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.texture2DLod = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Sampler2d), new embedsl.TypeUnion(embedsl.Type.Vec2), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'texture2DLod', 'texture2DLod', args);
  };
})();

/**
 * Create expression for GLSL function 'all'.
 *
 * @param {!(embedsl.Expression|Array.<boolean>)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|Array.<boolean>)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.all = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Bvec3, embedsl.Type.Bvec2), new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Bvec3, embedsl.Type.Bvec2)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'all', 'all', args);
  };
})();

/**
 * Create expression for GLSL function 'step'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.step = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG1, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'step', 'step', args);
  };
})();

/**
 * Create expression for GLSL function 'refract'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.refract = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG0, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'refract', 'refract', args);
  };
})();

/**
 * Create expression for GLSL function 'length'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.length = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Float, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'length', 'length', args);
  };
})();

/**
 * Create expression for GLSL function 'exp2'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.exp2 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'exp2', 'exp2', args);
  };
})();

/**
 * Create expression for GLSL function 'degrees'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.degrees = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'degrees', 'degrees', args);
  };
})();

/**
 * Create expression for GLSL function 'bool'.
 *
 * @param {!(embedsl.Expression|number|boolean)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.b = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'b', 'bool', args);
  };
})();

/**
 * Create expression for GLSL function 'int'.
 *
 * @param {!(embedsl.Expression|number|boolean)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.i = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Int, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'i', 'int', args);
  };
})();

/**
 * Create expression for GLSL function 'float'.
 *
 * @param {!(embedsl.Expression|number|boolean)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.f = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Float, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Int, embedsl.Type.Bool)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'f', 'float', args);
  };
})();

/**
 * Create expression for GLSL function 'normalize'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.normalize = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'normalize', 'normalize', args);
  };
})();

/**
 * Create expression for GLSL function 'max'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.max = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG0, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'max', 'max', args);
  };
})();

/**
 * Create expression for GLSL function 'texture2DProj'.
 *
 * @param {!(embedsl.Expression|number)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number)=} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.texture2DProj = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Sampler2d), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Sampler2d), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Vec4)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'texture2DProj', 'texture2DProj', args);
  };
})();

/**
 * Create expression for GLSL function 'equal'.
 *
 * @param {!(embedsl.Expression|Array.<boolean>|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|Array.<boolean>|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.equal = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Bvec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Bvec2), new embedsl.TypeUnion(embedsl.Type.Bvec4, embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Bvec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4, embedsl.Type.Bvec2)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'equal', 'equal', args);
  };
})();

/**
 * Create expression for GLSL function 'lessEqualThan'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.lessEqualThan = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'lessEqualThan', 'lessEqualThan', args);
  };
})();

/**
 * Create expression for GLSL function 'mix'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg2
 * Function argument 2.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.mix = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG0, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1,
    arg2) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'mix', 'mix', args);
  };
})();

/**
 * Create expression for GLSL function 'min'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.min = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARG0, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float)], [], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'min', 'min', args);
  };
})();

/**
 * Create expression for GLSL function 'inversesqrt'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.inversesqrt = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'inversesqrt', 'inversesqrt', args);
  };
})();

/**
 * Create expression for GLSL function 'exp'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.exp = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'exp', 'exp', args);
  };
})();

/**
 * Create expression for GLSL function 'atan'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)=} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.atan = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false), new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4), new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'atan', 'atan', args);
  };
})();

/**
 * Create expression for GLSL function 'lessThan'.
 *
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @param {!(embedsl.Expression|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg1
 * Function argument 1.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.lessThan = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4), new embedsl.TypeUnion(embedsl.Type.Vec3, embedsl.Type.Ivec3, embedsl.Type.Vec2, embedsl.Type.Vec4, embedsl.Type.Ivec2, embedsl.Type.Ivec4)], [embedsl.TypeConstraint.SAME_TYPE], false)]);
  return function(arg0,
    arg1) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'lessThan', 'lessThan', args);
  };
})();

/**
 * Create expression for GLSL function 'floor'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.floor = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'floor', 'floor', args);
  };
})();

/**
 * Create expression for GLSL function 'log2'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.log2 = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'log2', 'log2', args);
  };
})();

/**
 * Create expression for GLSL function 'asin'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.asin = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'asin', 'asin', args);
  };
})();

/**
 * Create expression for GLSL function 'tan'.
 *
 * @param {!(embedsl.Expression|number|goog.vec.Vec3.AnyType|Array.<number>|goog.vec.Vec4.AnyType)} arg0
 * Function argument 0.
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.tan = (function() {
  var cached = new embedsl.TypeInfo(embedsl.TypeDependency.SAME_AS_ARGS, null, [new embedsl.ParameterTypeList([new embedsl.TypeUnion(embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec2, embedsl.Type.Vec4)], [], false)]);
  return function(arg0) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, 'tan', 'tan', args);
  };
})();

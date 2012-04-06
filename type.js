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
 * @fileoverview Defines classes and functions for dynamic typing of
 * expression. Attempts to model the static GLSL type system.
 */
goog.provide('embedsl.ParameterTypeList');
goog.provide('embedsl.Type');
goog.provide('embedsl.TypeConstraint');
goog.provide('embedsl.TypeDependency');
goog.provide('embedsl.TypeInfo');
goog.provide('embedsl.TypeUnion');

goog.require('goog.array');

/**
 * Contains type information for GLSL types.
 *
 * @param {string} base Basic elment type in GLSL notation ('float', 'int' or
 * 'bool').
 * @param {Array.<number>} dimension Dimension of the type (1, 2, 3 or 4).
 * @param {number} size Size of an array.
 * @constructor
 */
embedsl.Type = function(base, dimension, size) {
  /**
   * @type {string}
   * @const
   */
  this.base = base;
  /**
   * @type {Array.<number>}
   * @const
   */
  this.dimension = dimension;
  /**
   * @type {number}
   * @const
   */
  this.size = size;
};

/**
 * Generate the GLSL type name.
 *
 * @return {string} The type name.
 */
embedsl.Type.prototype.glslName = function() {
  var name = this.base;

  if (this.dimension[0] > 1) {
    name = 'mat' + this.dimension[0];
  } else if (this.dimension[1] > 1) {
    switch (this.base) {
    case 'float':
      name = 'vec' + this.dimension[1];
      break;
    case 'int':
      name = 'ivec' + this.dimension[1];
      break;
    case 'bool':
      name = 'bvec' + this.dimension[1];
      break;
    }
  }

  return this.size > 1 ? name + '[' + this.size + ']' : name;
};

/**
 * Test for equality.
 *
 * @param {embedsl.Type} type Type to compare with.
 * @return {boolean} True, if types are identical or equal.
 */
embedsl.Type.prototype.equals = function(type) {
  return this === type ||
      this.base == type.base &&
      this.dimension[0] == type.dimension[0] &&
      this.dimension[1] == type.dimension[1] &&
      this.size == type.size;
};

/**
 * Compare.
 *
 * @param {embedsl.Type} t0 Type to compare.
 * @param {embedsl.Type} t1 Type to compare.
 * @return {number} Returns -1, 0 or 1 if t0 is less than, equal or greater
 * than t1.
 */
embedsl.Type.compare = function(t0, t1) {
    // TODO(tramberend) Remove.
  if (!t0 || !t1) debugger;

  if (t0 === t1)
    return 0;

  return goog.array.defaultCompare(t0.base, t1.base) ||
      goog.array.defaultCompare(t0.dimension[0], t1.dimension[0]) ||
      goog.array.defaultCompare(t0.dimension[1], t1.dimension[1]) ||
      goog.array.defaultCompare(t0.size, t1.size);
};

/**
 * Compare for strict equality.
 *
 * @param {embedsl.Type} type Type to compare with.
 * @return {boolean} True, if types are identical.
 */
embedsl.Type.prototype.contains = function(type) {
  return this === type;
};

/**
 * Construct an array type from a scalar type..
 *
 * @param {number} size Size of the array.
 * @return {!embedsl.Type} The array type.
 */
embedsl.Type.prototype.array = function(size) {
  if (this.size > 1)
    throw 'Construction of multi-dimensional arrays not supported';
  return new embedsl.Type(this.base, this.dimension, size);
};

/**
 * @return {boolean}
 */
embedsl.Type.prototype.isMatrix = function() {
  return this.dimension[0] > 1;
};

/**
 * @return {boolean}
 */
embedsl.Type.prototype.isVector = function() {
  return this.dimension[0] == 1 && this.dimension[1] > 1;
};

/**
 * @return {boolean}
 */
embedsl.Type.prototype.isScalar = function() {
  return this.dimension[0] == 1 && this.dimension[1] == 1;
};

/**
 * @return {boolean}
 */
embedsl.Type.prototype.isArray = function() {
  return this.size > 1;
};

/**
 * Calculates the number of floats needed to represent a value of this type.
 *
 * @return {number}
 */
embedsl.Type.prototype.floats = function() {
  return this.size * this.dimension[0] * this.dimension[1];
};

/**
 *
 * @param {...!embedsl.Type} var_args
 * @constructor
 */
embedsl.TypeUnion = function(var_args) {
  this.types = [];
  for (var i = 0; i != arguments.length; i++) {
    // TODO(tramberend) Remove.
    if (!arguments[i])debugger;

    goog.array.binaryInsert(this.types, arguments[i], embedsl.Type.compare);
  }
};

/**
 * @param {!embedsl.TypeUnion} union0
 * @param {!embedsl.TypeUnion} union1
 * @param {...!embedsl.TypeUnion} more
 * @return {!embedsl.TypeUnion}
 */
embedsl.TypeUnion.merge = function(union0, union1, more) {
  var result = new embedsl.TypeUnion();
  result.types = goog.array.clone(union0.types);
  for (var i = 1; i != arguments.length; i++) {
    var union = arguments[i];
    for (var e = 0; e != union.types.length; e++) {
      goog.array.binaryInsert(result.types, union.types[e], embedsl.Type.compare);
    }
  }
  return result;
};

/**
 * @param {!embedsl.Type} type
 * @return {boolean}
 */
embedsl.TypeUnion.prototype.contains = function(type) {
  return goog.array.binarySearch(this.types, type, embedsl.Type.compare) >= 0;
};

/**
 * @return {string} Human readable representation.
 */
embedsl.TypeUnion.prototype.toString = function() {
  var ts = [];
  for (var i = 0; i != this.types.length; i++)
    ts.push(this.types[i].glslName());
  return ts.join('|');
};

/**
 * @enum
 */
embedsl.TypeDependency = {
  CONSTANT: 0,
  SAME_AS_ARGS: 1,
  SAME_AS_MAX_ARG: 2,
  SAME_AS_ARG0: 3,
  SAME_AS_ARG1: 4,
  SAME_AS_ARG2: 5,
  BVEC_SIZE_OF_ARGS: 6,
  SAME_BASE_DIM1: 7,
  SAME_BASE_DIM2: 8,
  SAME_BASE_DIM3: 9,
  SAME_BASE_DIM4: 10,
  UNSPECIFIED: 11,
  MULTIPLICATION: 12
};

/**
 * @enum {string}
 */
embedsl.TypeConstraint = {
  NONE: '',
  NO_ARRAYS: 'no array types',
  SAME_TYPE: 'all types equal',
  SAME_OR_SCALAR: 'all types equal or scalar',
  MAT_VEC_SAME_DIMENSION: 'dimensions match',
  ARGUMENT_COUNT: 'argument count',
  VALID_ARGUMENT_TYPE: 'argument types'
};

/**
 * @param {Array.<!embedsl.TypeUnion>} argumentTypes
 * @param {Array.<!embedsl.TypeConstraint>=} constraints
 * @param {boolean=} varargs
 * @constructor
 */
embedsl.ParameterTypeList = function(argumentTypes, constraints, varargs) {
  this.argumentTypes = argumentTypes;
  this.constraints = constraints || [];
  this.varargs = varargs == undefined ? false : varargs;
};

/**
 * @param {embedsl.TypeConstraint=} constraint The type constraint that was violated.
 * @return {string} Human readable representation.
 */
embedsl.ParameterTypeList.prototype.toString = function(constraint) {
  var ats = [];
  for (var i = 0; i != this.argumentTypes.length; i++)
    ats.push(this.argumentTypes[i].toString());
  if (this.varargs)
    ats.push('...');
  var c = constraint ? ' [violates: ' + constraint + ']' : '';
  return '(' + ats.join(', ') + ')' + c;
};

/**
 * @param {Array.<!embedsl.Type>} argTypes
 * @return {embedsl.TypeConstraint} Violated type constraint.
 */
embedsl.ParameterTypeList.prototype.typeCheckArguments = function(argTypes) {
  if (this.varargs) {
    if (this.argumentTypes.length > argTypes.length) {
      return embedsl.TypeConstraint.ARGUMENT_COUNT;
    }
  } else {
    if (this.argumentTypes.length != argTypes.length) {
      return embedsl.TypeConstraint.ARGUMENT_COUNT;
    }
  }

  for (var i = 0; i < this.argumentTypes.length; i++) {
    if (!this.argumentTypes[i].contains(argTypes[i]))
      return embedsl.TypeConstraint.VALID_ARGUMENT_TYPE;
  }

  if (this.constraints.indexOf(embedsl.TypeConstraint.NO_ARRAYS) != -1) {
    for (var i = 0; i < argTypes.length; i++) {
      if (argTypes[i].size != 1)
        return embedsl.TypeConstraint.NO_ARRAYS;
    }
  }

  if (this.constraints.indexOf(embedsl.TypeConstraint.SAME_TYPE) != -1) {
    for (var i = 1; i < argTypes.length; i++) {
      if (!argTypes[i].equals(argTypes[0]))
        return embedsl.TypeConstraint.SAME_TYPE;
    }
  }

  if (this.constraints.indexOf(embedsl.TypeConstraint.SAME_OR_SCALAR) != -1) {
    for (var i = 1; i < argTypes.length; i++) {
      var t0 = argTypes[i - 1];
      var t1 = argTypes[i];
      if (t0.base != t1.base)
        return embedsl.TypeConstraint.SAME_OR_SCALAR;
      if (!goog.array.equals(t0.dimension, t1.dimension) &&
          !goog.array.equals(t0.dimension, [1, 1]) &&
          !goog.array.equals(t1.dimension, [1, 1]))
        return embedsl.TypeConstraint.SAME_OR_SCALAR;
    }
  }

  if (this.constraints.indexOf(embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION) != -1) {
    for (var i = 1; i < argTypes.length; i++) {
      var t0 = argTypes[i - 1];
      var t1 = argTypes[i];
      if (t0.base != t1.base)
        return embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION;
      if (t0.dimension[0] != t1.dimension[1] &&
          t0.dimension[1] != t1.dimension[0] &&
          !goog.array.equals(t0.dimension, [1, 1]) &&
          !goog.array.equals(t1.dimension, [1, 1]) &&
          !goog.array.equals(t0.dimension, t1.dimension))
        return embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION;
    }
  }

  return embedsl.TypeConstraint.NONE;
};

/**
 * @param {!embedsl.TypeDependency} dependency How the return type depends on the
 * argument types.
 * @param {embedsl.Type=} returnType The concrete type in case of no dependency.
 * @param {Array.<embedsl.ParameterTypeList>=} parameterTypeLists A list of all
 * possible argument list signatures.
 * @constructor
 */
embedsl.TypeInfo = function(dependency, returnType, parameterTypeLists) {
  /**
   * @type {!embedsl.TypeDependency}
   * @const
   * @private
   */
  this.dependency_ = dependency;
  /**
   * @type {embedsl.Type}
   * @const
   * @private
   */
  this.returnType_ = returnType || null;
  /**
   * @type {Array.<embedsl.ParameterTypeList>}
   * @const
   * @private
   */
  this.parameterTypeLists_ = parameterTypeLists || [];
};

/**
 * @param {!Array.<embedsl.Type>} argTypes
 * @return {!Array.<embedsl.TypeConstraint>}
 */
embedsl.TypeInfo.prototype.typeCheckArguments = function(argTypes) {
  if (this.parameterTypeLists_.length == 0 &&
      argTypes.length == 0)
    return [];

  var violations = [];
  for (var i = 0; i != this.parameterTypeLists_.length; i++) {
    var violated = this.parameterTypeLists_[i].typeCheckArguments(argTypes);
    if (violated == embedsl.TypeConstraint.NONE)
      return [];
    violations.push(violated);
  }

  return violations;
};

/**
 * @param {!Array.<embedsl.Type>} argTypes
 * @return {!embedsl.Type}
 */
embedsl.TypeInfo.prototype.calculateReturnType = function(argTypes) {
  switch (this.dependency_) {
  case embedsl.TypeDependency.CONSTANT:
    if (!this.returnType_)
      throw 'No constant return type set.';
    return /** @type {!embedsl.Type} */(this.returnType_);
  case embedsl.TypeDependency.SAME_AS_ARG0:
  case embedsl.TypeDependency.SAME_AS_ARGS:
    return /** @type {!embedsl.Type} */(argTypes[0]);
  case embedsl.TypeDependency.SAME_AS_ARG1:
    return /** @type {!embedsl.Type} */(argTypes[1]);
  case embedsl.TypeDependency.SAME_AS_ARG2:
    return /** @type {!embedsl.Type} */(argTypes[2]);
  case embedsl.TypeDependency.MULTIPLICATION:
    var t0 = argTypes[0];
    for (var i = 1; i != argTypes.length; i++) {
      var t1 = argTypes[i];
      // This test implements:
      // m * m -> m
      // v * m -> v
      // m * v -> v
      // . * s -> .
      // s * . -> .
      if (t0.isMatrix() && t1.isVector() || t0.isScalar())
        t0 = t1;
    }
    return /** @type {!embedsl.Type} */(t0);
  case embedsl.TypeDependency.SAME_AS_MAX_ARG:
    var t0 = argTypes[0];
    for (var i = 1; i != argTypes.length; i++) {
      var t1 = argTypes[i];
      // This test implements:
      // m * . -> m
      // . * m -> m
      // v * . -> v
      // . * v -> v
      // . * . -> s
      if (t1.isMatrix() || t1.isVector())
        t0 = t1;
    }
    return /** @type {!embedsl.Type} */(t0);
  case embedsl.TypeDependency.SAME_BASE_DIM1:
    return new embedsl.Type(argTypes[0].base, [1, 1], 1);
  case embedsl.TypeDependency.SAME_BASE_DIM2:
    return new embedsl.Type(argTypes[0].base, [1, 2], 1);
  case embedsl.TypeDependency.SAME_BASE_DIM3:
    return new embedsl.Type(argTypes[0].base, [1, 3], 1);
  case embedsl.TypeDependency.SAME_BASE_DIM4:
    return new embedsl.Type(argTypes[0].base, [1, 4], 1);
  case embedsl.TypeDependency.BVEC_SIZE_OF_ARGS:
    switch (argTypes[0].dimension[1]) {
    case 2:
      return embedsl.Type.Bvec2;
    case 3:
      return embedsl.Type.Bvec3;
    case 4:
      return embedsl.Type.Bvec4;
    }
  }

  throw 'Unable to calculate return type.';
};

/**
 * Gets the return type or null if not yet calculated.
 * @return {embedsl.Type} The return type.
 */
embedsl.TypeInfo.prototype.returnType = function() {
  return this.returnType_;
};

/**
 * Gets the parameterTypeLists_.
 * @return {Array.<embedsl.ParameterTypeList>} The lists.
 */
embedsl.TypeInfo.prototype.parameterTypeLists = function() {
  return this.parameterTypeLists_;
};

/** @const */
embedsl.Type.Float = new embedsl.Type('float', [1, 1], 1);
/** @const */
embedsl.Type.Vec2 = new embedsl.Type('float', [1, 2], 1);
/** @const */
embedsl.Type.Vec3 = new embedsl.Type('float', [1, 3], 1);
/** @const */
embedsl.Type.Vec4 = new embedsl.Type('float', [1, 4], 1);

/** @const */
embedsl.Type.Int = new embedsl.Type('int', [1, 1], 1);
/** @const */
embedsl.Type.Ivec2 = new embedsl.Type('int', [1, 2], 1);
/** @const */
embedsl.Type.Ivec3 = new embedsl.Type('int', [1, 3], 1);
/** @const */
embedsl.Type.Ivec4 = new embedsl.Type('int', [1, 4], 1);

/** @const */
embedsl.Type.Bool = new embedsl.Type('bool', [1, 1], 1);
/** @const */
embedsl.Type.Bvec2 = new embedsl.Type('bool', [1, 2], 1);
/** @const */
embedsl.Type.Bvec3 = new embedsl.Type('bool', [1, 3], 1);
/** @const */
embedsl.Type.Bvec4 = new embedsl.Type('bool', [1, 4], 1);

/** @const */
embedsl.Type.Mat2 = new embedsl.Type('float', [2, 2], 1);
/** @const */
embedsl.Type.Mat3 = new embedsl.Type('float', [3, 3], 1);
/** @const */
embedsl.Type.Mat4 = new embedsl.Type('float', [4, 4], 1);

/** @const */
embedsl.Type.Sampler2d = new embedsl.Type('sampler2D', [1, 1], 1);
/** @const */
embedsl.Type.Samplercube = new embedsl.Type('samplerCube', [1, 1], 1);

/** @const */
embedsl.Type.Sampler = new embedsl.TypeUnion(embedsl.Type.Sampler2d, embedsl.Type.Samplercube);

/** @const */
embedsl.Type.Float1234 =
    new embedsl.TypeUnion(
        embedsl.Type.Float, embedsl.Type.Vec2, embedsl.Type.Vec3, embedsl.Type.Vec4);
/** @const */
embedsl.Type.Int1234 =
    new embedsl.TypeUnion(
        embedsl.Type.Int, embedsl.Type.Ivec2, embedsl.Type.Ivec3, embedsl.Type.Ivec4);
/** @const */
embedsl.Type.Bool1234 =
    new embedsl.TypeUnion(
        embedsl.Type.Bool, embedsl.Type.Bvec2, embedsl.Type.Bvec3, embedsl.Type.Bvec4);

/** @const */
embedsl.Type.Num1234 = embedsl.TypeUnion.merge(embedsl.Type.Float1234, embedsl.Type.Int1234);
/** @const */
embedsl.Type.Any1234 = embedsl.TypeUnion.merge(embedsl.Type.Float1234, embedsl.Type.Int1234, embedsl.Type.Bool1234);

/** @const */
embedsl.Type.Float234 =
    new embedsl.TypeUnion(embedsl.Type.Vec2, embedsl.Type.Vec3, embedsl.Type.Vec4);
/** @const */
embedsl.Type.Int234 =
    new embedsl.TypeUnion(embedsl.Type.Ivec2, embedsl.Type.Ivec3, embedsl.Type.Ivec4);
/** @const */
embedsl.Type.Bool234 =
    new embedsl.TypeUnion(embedsl.Type.Bvec2, embedsl.Type.Bvec3, embedsl.Type.Bvec4);

/** @const */
embedsl.Type.Num234 = embedsl.TypeUnion.merge(embedsl.Type.Float234, embedsl.Type.Int234);

/** @const */
embedsl.Type.Mat234 = new embedsl.TypeUnion(embedsl.Type.Mat2, embedsl.Type.Mat3, embedsl.Type.Mat4);

/** @const */
embedsl.Type.FloatN = embedsl.TypeUnion.merge(embedsl.Type.Float1234, embedsl.Type.Mat234);

/** @const */
embedsl.Type.Any =
    embedsl.TypeUnion.merge(
        embedsl.Type.Float1234, embedsl.Type.Int1234,
        embedsl.Type.Bool1234, embedsl.Type.Mat234, embedsl.Type.Sampler);

/** @const */
embedsl.TypeInfo.OneArgAnyType =
    new embedsl.TypeInfo(
        embedsl.TypeDependency.SAME_AS_ARG0, null,
        [new embedsl.ParameterTypeList([embedsl.Type.Any])]);

/** @const */
embedsl.TypeInfo.Unspecified =
    new embedsl.TypeInfo(
        embedsl.TypeDependency.UNSPECIFIED);

/** @const */
embedsl.TypeInfo.SameBaseDim1 =
    new embedsl.TypeInfo(embedsl.TypeDependency.SAME_BASE_DIM1, null,
        [new embedsl.ParameterTypeList([embedsl.Type.Any1234])]);
/** @const */
embedsl.TypeInfo.SameBaseDim2 =
    new embedsl.TypeInfo(embedsl.TypeDependency.SAME_BASE_DIM2, null,
        [new embedsl.ParameterTypeList([embedsl.Type.Any1234])]);
/** @const */
embedsl.TypeInfo.SameBaseDim3 =
    new embedsl.TypeInfo(embedsl.TypeDependency.SAME_BASE_DIM3, null,
        [new embedsl.ParameterTypeList([embedsl.Type.Any1234])]);
/** @const */
embedsl.TypeInfo.SameBaseDim4 =
    new embedsl.TypeInfo(embedsl.TypeDependency.SAME_BASE_DIM4, null,
        [new embedsl.ParameterTypeList([embedsl.Type.Any1234])]);

/** @const */
embedsl.TypeInfo.ConstantFloat =
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Float);
/** @const */
embedsl.TypeInfo.ConstantInt =
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Int);
/** @const */
embedsl.TypeInfo.ConstantBool =
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool);

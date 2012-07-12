/**
 * Copyright 2011 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

function EmbedslTypeTest() {
  Vec3Array = new embedsl.Type('float', [1, 3], 0, 'vec3');

  this.argl0 = new embedsl.ParameterTypeList(
      [embedsl.Type.Float1234, embedsl.Type.Float1234, embedsl.Type.Float1234],
      [embedsl.TypeConstraint.NO_ARRAYS]);

  this.argl1 = new embedsl.ParameterTypeList(
      [embedsl.Type.Float1234, embedsl.Type.Float1234, embedsl.Type.Float1234],
      [embedsl.TypeConstraint.SAME_TYPE]);

  this.argl2 = new embedsl.ParameterTypeList(
      [embedsl.Type.FloatN, embedsl.Type.FloatN],
      [embedsl.TypeConstraint.SAME_OR_SCALAR]);

  this.argl3 = new embedsl.ParameterTypeList(
      [embedsl.Type.FloatN, embedsl.Type.FloatN, embedsl.Type.FloatN],
      [embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION]);

  this.argl4 = new embedsl.ParameterTypeList(
      [embedsl.Type.Num234, embedsl.Type.Num234, embedsl.Type.Num234],
      [embedsl.TypeConstraint.SAME_TYPE]);

  this.argl5 = new embedsl.ParameterTypeList(
      [embedsl.Type.FloatN, embedsl.Type.FloatN, embedsl.Type.FloatN],
      []);

  this.argl6 = new embedsl.ParameterTypeList(
      [embedsl.Type.Float, embedsl.Type.Float, embedsl.Type.Float],
      [embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION]);

  this.ti0 = new embedsl.TypeInfo(
      embedsl.TypeDependency.CONSTANT, embedsl.Type.Float,
      [this.argl0, this.argl1, this.argl2, this.argl3, this.argl4]);
}

registerTestSuite(EmbedslTypeTest);

EmbedslTypeTest.prototype.equalsWell = function() {
  expectTrue(embedsl.Type.Float == embedsl.Type.Float);
  expectTrue(embedsl.Type.Float.equals(embedsl.Type.Float));
  expectFalse(embedsl.Type.Float == embedsl.Type.Int);
  expectFalse(embedsl.Type.Float.equals(embedsl.Type.Int));
};

EmbedslTypeTest.prototype.comparesWell = function() {
  expectEq(0, embedsl.Type.compare(embedsl.Type.Float, embedsl.Type.Float));
  expectEq(-1, embedsl.Type.compare(embedsl.Type.Float, embedsl.Type.Vec2));
  expectEq(-1, embedsl.Type.compare(embedsl.Type.Vec2, embedsl.Type.Vec3));
  expectEq(-1, embedsl.Type.compare(embedsl.Type.Vec4, embedsl.Type.Mat3));
  expectEq(-1, embedsl.Type.compare(embedsl.Type.Mat4, embedsl.Type.Sampler2d));
  expectEq(-1, embedsl.Type.compare(embedsl.Type.Float.array(4), embedsl.Type.Mat4));
};

EmbedslTypeTest.prototype.generatesGlslNames = function() {
  expectEq('float', embedsl.Type.Float.glslName());
  expectEq('vec2', embedsl.Type.Vec2.glslName());
  expectEq('ivec3', embedsl.Type.Ivec3.glslName());
  expectEq('bvec4', embedsl.Type.Bvec4.glslName());
  expectEq('sampler2D', embedsl.Type.Sampler2d.glslName());
  expectEq('float[2]', embedsl.Type.Float.array(2).glslName());
  expectEq('vec2[3]', embedsl.Type.Vec2.array(3).glslName());
  expectEq('ivec3[4]', embedsl.Type.Ivec3.array(4).glslName());
  expectEq('bvec4[5]', embedsl.Type.Bvec4.array(5).glslName());
  expectEq('sampler2D[6]', embedsl.Type.Sampler2d.array(6).glslName());
};

EmbedslTypeTest.prototype.typeUnionsWork = function() {
  expectTrue(embedsl.Type.Float1234.contains(embedsl.Type.Float));
  expectTrue(embedsl.Type.Float1234.contains(embedsl.Type.Vec3));
  expectFalse(embedsl.Type.Float1234.contains(embedsl.Type.Mat3));
  expectFalse(embedsl.Type.Float1234.contains(embedsl.Type.Mat4));
  expectTrue(embedsl.Type.Num1234.contains(embedsl.Type.Float));
  expectTrue(embedsl.Type.Num1234.contains(embedsl.Type.Vec3));
  expectTrue(embedsl.Type.Num1234.contains(embedsl.Type.Int));
  expectTrue(embedsl.Type.Num1234.contains(embedsl.Type.Ivec3));
  expectFalse(embedsl.Type.Num1234.contains(embedsl.Type.Mat3));
  expectFalse(embedsl.Type.Num1234.contains(embedsl.Type.Mat4));
};

EmbedslTypeTest.prototype.typeChecksArgumentList = function() {
  expectEq(embedsl.TypeConstraint.ARGUMENT_COUNT,
           this.argl0.typeCheckArguments([embedsl.Type.Vec4]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl0.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Vec4]));

  expectEq(embedsl.TypeConstraint.VALID_ARGUMENT_TYPE,
           this.argl0.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Mat4]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl0.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Vec4]));

  expectEq(embedsl.TypeConstraint.SAME_TYPE,
           this.argl1.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Vec2]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl1.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Vec4]));

  expectEq(embedsl.TypeConstraint.SAME_OR_SCALAR,
           this.argl2.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Mat4]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl2.typeCheckArguments(
               [embedsl.Type.Float, embedsl.Type.Mat4]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl2.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Float]));

  expectEq(embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Mat3, embedsl.Type.Float]));
  expectEq(embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Vec3, embedsl.Type.Float]));
  expectEq(embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Float, embedsl.Type.Vec4, embedsl.Type.Vec3]));
  expectEq(embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Float, embedsl.Type.Vec3, embedsl.Type.Vec4]));
  expectEq(embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Float, embedsl.Type.Mat3, embedsl.Type.Mat4]));
  expectEq(embedsl.TypeConstraint.MAT_VEC_SAME_DIMENSION,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Vec4, embedsl.Type.Mat4, embedsl.Type.Mat3]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Vec3, embedsl.Type.Mat3, embedsl.Type.Float]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Mat3, embedsl.Type.Mat3, embedsl.Type.Vec3]));
  expectEq(embedsl.TypeConstraint.NONE,
           this.argl3.typeCheckArguments(
               [embedsl.Type.Mat4, embedsl.Type.Vec4, embedsl.Type.Mat4]));
};

EmbedslTypeTest.prototype.typeChecksTypeInfo = function() {
  expectEq(0, this.ti0.typeCheckArguments(
      [embedsl.Type.Mat4, embedsl.Type.Vec4, embedsl.Type.Mat4]).length);
  expectEq(0, this.ti0.typeCheckArguments(
      [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Vec4]).length);
  expectEq(5, this.ti0.typeCheckArguments(
      [embedsl.Type.Vec4, embedsl.Type.Vec4, Vec3Array]).length);
  expectEq(0, this.ti0.typeCheckArguments(
      [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Vec4]).length);
  expectEq(5, this.ti0.typeCheckArguments(
      [embedsl.Type.Mat4, embedsl.Type.Vec4]).length);
  expectEq(0, this.ti0.typeCheckArguments(
      [embedsl.Type.Mat4, embedsl.Type.Float]).length);
};

EmbedslTypeTest.prototype.calculatesReturnType = function() {
  this.ti1 =
      new embedsl.TypeInfo(
          embedsl.TypeDependency.SAME_AS_ARG0, embedsl.Type.Float,
          [this.argl0, this.argl1, this.argl2, this.argl3, this.argl4]);
  this.ti2 =
      new embedsl.TypeInfo(
          embedsl.TypeDependency.SAME_AS_ARG1, embedsl.Type.Float,
          [this.argl0, this.argl1, this.argl2, this.argl3, this.argl4]);
  this.ti3 =
      new embedsl.TypeInfo(
          embedsl.TypeDependency.SAME_AS_MAX_ARG, embedsl.Type.Float,
          [this.argl0, this.argl1, this.argl2, this.argl3,
           this.argl4, this.argl5]);
  this.ti4 =
      new embedsl.TypeInfo(
          embedsl.TypeDependency.BVEC_SIZE_OF_ARGS, null,
          [this.argl0, this.argl1, this.argl2, this.argl3, this.argl4]);

  this.ti5 =
      new embedsl.TypeInfo(
          embedsl.TypeDependency.MULTIPLICATION, null,
          [this.argl6]);

  expectTrue(embedsl.Type.Float.equals(
      this.ti0.calculateReturnType(
          [embedsl.Type.Mat4, embedsl.Type.Vec4, embedsl.Type.Mat4])));
  expectTrue(embedsl.Type.Mat4.equals(
      this.ti1.calculateReturnType(
          [embedsl.Type.Mat4, embedsl.Type.Vec4, embedsl.Type.Mat4])));
  expectTrue(embedsl.Type.Vec4.equals(
      this.ti2.calculateReturnType(
          [embedsl.Type.Mat4, embedsl.Type.Vec4, embedsl.Type.Mat4])));
  expectFalse(embedsl.Type.Mat4.equals(
      this.ti3.calculateReturnType(
          [embedsl.Type.Mat4, embedsl.Type.Vec4, embedsl.Type.Mat3])));
  expectTrue(embedsl.Type.Bvec3.equals(
      this.ti4.calculateReturnType(
          [embedsl.Type.Vec3, embedsl.Type.Vec3, embedsl.Type.Vec3])));
  expectTrue(embedsl.Type.Bvec4.equals(
      this.ti4.calculateReturnType(
          [embedsl.Type.Vec4, embedsl.Type.Vec4, embedsl.Type.Vec4])));

  expectTrue(embedsl.Type.Float.equals(
      this.ti5.calculateReturnType(
          [embedsl.Type.Float, embedsl.Type.Float, embedsl.Type.Float])));
};

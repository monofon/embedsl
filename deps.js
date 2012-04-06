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

// This file has been auto-generated by GenJsDeps, please do not edit.

goog.addDependency('../../../../embedsl/ast.js', ['embedsl.Ast'], ['embedsl.Definition', 'goog.format.JsonPrettyPrinter', 'goog.json']);
goog.addDependency('../../../../embedsl/attribute.js', ['embedsl.Attribute'], ['embedsl.Expression', 'embedsl.Kind']);
goog.addDependency('../../../../embedsl/attributes.js', ['embedsl.AttributeBool', 'embedsl.AttributeBvec2', 'embedsl.AttributeBvec3', 'embedsl.AttributeBvec4', 'embedsl.AttributeFloat', 'embedsl.AttributeInt', 'embedsl.AttributeIvec2', 'embedsl.AttributeIvec3', 'embedsl.AttributeIvec4', 'embedsl.AttributeSet', 'embedsl.AttributeVec2', 'embedsl.AttributeVec3', 'embedsl.AttributeVec4'], ['embedsl.Attribute', 'goog.vec', 'goog.vec.Mat4', 'goog.vec.Vec3']);
goog.addDependency('../../../../embedsl/definition.js', ['embedsl.Definition', 'embedsl.DefinitionKind'], []);
goog.addDependency('../../../../embedsl/examples/cube.js', ['cube', 'cube.Attributes', 'cube.BaseShader', 'cube.LambertShader', 'cube.Uniforms'], ['WebGLUtils', 'embedsl.Argument', 'embedsl.AttributeSet', 'embedsl.Program', 'embedsl.UniformMat4', 'embedsl.lang', 'goog.vec.Mat4', 'goog.vec.Vec3', 'scene']);
goog.addDependency('../../../../embedsl/examples/cubemap.js', ['scene.Cubemap'], []);
goog.addDependency('../../../../embedsl/examples/geometry.js', ['scene.Geometry'], ['embedsl.AttributeSet', 'scene.SolidAttributes']);
goog.addDependency('../../../../embedsl/examples/globals.js', ['scene.SolidAttributes'], ['goog.vec.Vec3', 'goog.vec.Vec4']);
goog.addDependency('../../../../embedsl/examples/scene.js', ['scene'], ['embedsl.AttributeSet', 'scene.Cubemap', 'scene.Geometry', 'scene.Texture', 'scene.solids']);
goog.addDependency('../../../../embedsl/examples/shaders.js', ['shaders', 'shaders.AppUniforms', 'shaders.Base', 'shaders.DiffuseMap', 'shaders.DiffuseMapBlur', 'shaders.EnvMap', 'shaders.Lambert', 'shaders.Lit', 'shaders.MeshAttribs', 'shaders.Phong', 'shaders.Ripple', 'shaders.SkyBox'], ['WebGLUtils', 'embedsl.AttributeSet', 'embedsl.AttributeVec2', 'embedsl.AttributeVec3', 'embedsl.Program', 'embedsl.UniformFloat', 'embedsl.UniformMat4', 'embedsl.UniformSampler2d', 'embedsl.UniformSamplercube', 'embedsl.UniformSet', 'embedsl.UniformVec3', 'embedsl.lang', 'goog.vec.Mat4', 'goog.vec.Vec3', 'goog.vec.Vec4']);
goog.addDependency('../../../../embedsl/examples/solids.js', ['scene.solids'], ['goog.vec', 'goog.vec.Mat4', 'goog.vec.Vec3', 'scene.SolidAttributes']);
goog.addDependency('../../../../embedsl/examples/sphere.js', ['sphere'], ['WebGLUtils', 'goog.vec.Mat4', 'goog.vec.Vec3', 'scene', 'shaders', 'shaders.AppUniforms', 'shaders.MeshAttribs']);
goog.addDependency('../../../../embedsl/examples/texture.js', ['scene.Texture'], []);
goog.addDependency('../../../../embedsl/examples/webgl-utils.js', ['WebGLUtils'], []);
goog.addDependency('../../../../embedsl/expression.js', ['embedsl.Argument', 'embedsl.Expression', 'embedsl.Kind'], ['embedsl.Type', 'goog.array']);
goog.addDependency('../../../../embedsl/glslgenerator.js', ['embedsl.GLSLGenerator'], ['embedsl.Ast', 'embedsl.Definition', 'embedsl.DefinitionKind', 'embedsl.Expression', 'embedsl.GlobalNameStream', 'embedsl.Kind', 'embedsl.Transformer']);
goog.addDependency('../../../../embedsl/inferrer.js', ['embedsl.Inferrer'], ['embedsl.Ast', 'embedsl.Definition', 'embedsl.Transformer', 'goog.array', 'goog.string']);
goog.addDependency('../../../../embedsl/lang.js', ['embedsl.lang'], ['embedsl.Accumulate', 'embedsl.Accumulator', 'embedsl.Argument', 'embedsl.Expression', 'embedsl.Generator', 'embedsl.Iterator', 'embedsl.Virtual', 'goog.vec', 'goog.vec.Mat3', 'goog.vec.Mat4', 'goog.vec.Vec3', 'goog.vec.Vec4', 'util']);
goog.addDependency('../../../../embedsl/localizer.js', ['embedsl.Localizer'], ['embedsl.Definition', 'embedsl.Transformer']);
goog.addDependency('../../../../embedsl/loop.js', ['embedsl.Accumulate', 'embedsl.Accumulator', 'embedsl.Generator', 'embedsl.Iterator'], ['embedsl.Expression']);
goog.addDependency('../../../../embedsl/mapper.js', ['embedsl.Mapper'], ['embedsl.Ast', 'embedsl.Definition', 'embedsl.Expression', 'embedsl.Kind', 'embedsl.Transformer']);
goog.addDependency('../../../../embedsl/namestream.js', ['embedsl.GlobalNameStream', 'embedsl.NameStream'], ['goog.array']);
goog.addDependency('../../../../embedsl/plumber.js', ['embedsl.Plumber'], ['embedsl.Ast', 'embedsl.Definition', 'embedsl.Expression', 'embedsl.Kind', 'embedsl.Transformer']);
goog.addDependency('../../../../embedsl/program.js', ['embedsl.Program'], ['embedsl.Ast', 'embedsl.Definition', 'embedsl.DefinitionKind', 'embedsl.Expression', 'embedsl.GLSLGenerator', 'embedsl.Inferrer', 'embedsl.Kind', 'embedsl.Localizer', 'embedsl.Mapper', 'embedsl.Plumber', 'embedsl.Purger']);
goog.addDependency('../../../../embedsl/purger.js', ['embedsl.Purger'], ['embedsl.Ast', 'embedsl.Definition', 'embedsl.Expression', 'embedsl.Kind', 'embedsl.Transformer']);
goog.addDependency('../../../../embedsl/transformer.js', ['embedsl.Transformer', 'embedsl.TransformerFunction'], ['embedsl.Ast', 'embedsl.Expression']);
goog.addDependency('../../../../embedsl/type.js', ['embedsl.ParameterTypeList', 'embedsl.Type', 'embedsl.TypeConstraint', 'embedsl.TypeDependency', 'embedsl.TypeInfo', 'embedsl.TypeUnion'], ['goog.array']);
goog.addDependency('../../../../embedsl/uniform.js', ['embedsl.Uniform'], ['embedsl.Expression', 'embedsl.GlobalNameStream', 'embedsl.Kind', 'goog.vec.Mat3', 'goog.vec.Mat4', 'goog.vec.Vec3', 'goog.vec.Vec4']);
goog.addDependency('../../../../embedsl/uniforms.js', ['embedsl.UniformBool', 'embedsl.UniformBvec2', 'embedsl.UniformBvec3', 'embedsl.UniformBvec4', 'embedsl.UniformFloat', 'embedsl.UniformInt', 'embedsl.UniformIvec2', 'embedsl.UniformIvec3', 'embedsl.UniformIvec4', 'embedsl.UniformMat2', 'embedsl.UniformMat3', 'embedsl.UniformMat4', 'embedsl.UniformSampler2d', 'embedsl.UniformSamplercube', 'embedsl.UniformSet', 'embedsl.UniformVec2', 'embedsl.UniformVec3', 'embedsl.UniformVec4'], ['embedsl.Uniform', 'goog.vec', 'goog.vec.Mat4', 'goog.vec.Vec3']);
goog.addDependency('../../../../embedsl/util.js', ['util'], ['goog.dom', 'goog.format.JsonPrettyPrinter', 'goog.json']);
goog.addDependency('../../../../embedsl/virtual.js', ['embedsl.Virtual'], ['embedsl.Expression']);
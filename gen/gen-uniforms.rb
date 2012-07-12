# Copyright 2011 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Copyright 2012 Google Inc. All Rights Reserved.
#
# Generate classes for all possible uniform types. For each type give
# the GLSL name and the corresponding Closure type signature for
# uniform and attribute values.. The generic Uniform.set method is
# supposed to dynamically check the type.
#
# [n.n] refers to section n.n of the OpenGL ES 1.0 specification.
#
#

# TODO(tramberend) Use Type::ConcreteType here.

$types = {
  # [4.1]
  :float => {
    :closure => 'number',
    :size => 1 ,
    :esl => 'embedsl.Type.Float',
    :glcall => "gl.uniform1f(loc, /** @type {number} */(this.value))" },
  :int => {
    :closure => 'number',
    :size => 1 ,
    :esl => 'embedsl.Type.Int',
    :glcall => "gl.uniform1i(loc, /** @type {number} */(this.value))" },
  :bool => {
    :closure => 'boolean',
    :size => 1 ,
    :esl => 'embedsl.Type.Bool',
    :glcall => "gl.uniform1i(loc, /** @type {number} */(this.value))" },
  :vec2 => {
    :closure => 'Array.<number>',
    :size => 2 ,
    :esl => 'embedsl.Type.Vec2',
    :glcall => "gl.uniform2fv(loc, /** @type {Array.<number>} */(this.value))" },
  :vec3 => {
    :closure => 'goog.vec.Vec3.AnyType',
    :size => 3 ,
    :esl => 'embedsl.Type.Vec3',
    :glcall => "gl.uniform3fv(loc, /** @type {Array.<number>} */(this.value))" },
  :vec4 => {
    :closure => 'goog.vec.Vec4.AnyType',
    :size => 4 ,
    :esl => 'embedsl.Type.Vec4',
    :glcall => "gl.uniform4fv(loc, /** @type {Array.<number>} */(this.value))" },
  :bvec2 => {
    :closure => 'Array.<boolean>',
    :size => 2 ,
    :esl => 'embedsl.Type.Bvec2',
    :glcall => "gl.uniform2iv(loc, /** @type {Array.<number>} */(this.value))" },
  :bvec3 => {
    :closure => 'Array.<boolean>',
    :size => 3 ,
    :esl => 'embedsl.Type.Bvec3',
    :glcall => "gl.uniform3iv(loc, /** @type {Array.<number>} */(this.value))" },
  :bvec4 => {
    :closure => 'Array.<boolean>',
    :size => 4 ,
    :esl => 'embedsl.Type.Bvec4',
    :glcall => "gl.uniform4iv(loc, /** @type {Array.<number>} */(this.value))" },
  :ivec2 => {
    :closure => 'Array.<number>',
    :size => 2 ,
    :esl => 'embedsl.Type.Ivec2',
    :glcall => "gl.uniform2iv(loc, /** @type {Array.<number>} */(this.value))" },
  :ivec3 => {
    :closure => 'Array.<number>',
    :size => 3 ,
    :esl => 'embedsl.Type.Ivec3',
    :glcall => "gl.uniform3iv(loc, /** @type {Array.<number>} */(this.value))" },
  :ivec4 => {
    :closure => 'Array.<number>',
    :size => 4 ,
    :esl => 'embedsl.Type.Ivec4',
    :glcall => "gl.uniform4iv(loc, /** @type {Array.<number>} */(this.value))" },
  :mat2 => {
    :closure => 'Array.<number>',
    :size => 4 ,
    :esl => 'embedsl.Type.Mat2',
    :glcall => "gl.uniformMatrix2fv(loc, false, /** @type {Array.<number>} */(this.value))" },
  :mat3 => {
    :closure => 'goog.vec.Mat3.AnyType',
    :size => 9 ,
    :esl => 'embedsl.Type.Mat3',
    :glcall => "gl.uniformMatrix3fv(loc, false, /** @type {Array.<number>} */(this.value))" },
  :mat4 => {
    :closure => 'goog.vec.Mat4.AnyType',
    :size => 16 ,
    :esl => 'embedsl.Type.Mat4',
    :glcall => "gl.uniformMatrix4fv(loc, false, /** @type {Array.<number>} */(this.value))" },
  :sampler2D => {
    :closure => 'number',
    :size => 1 ,
    :esl => 'embedsl.Type.Sampler2d',
    :glcall => "gl.uniform1i(loc, /** @type {number} */(this.value))" },
  :samplerCube => {
    :closure => 'number',
    :size => 1 ,
    :esl => 'embedsl.Type.Samplercube',
    :glcall => "gl.uniform1i(loc, /** @type {number} */(this.value))" },
}

$provides = []
$declarations = []

def generate(type, array)
  utype = type.to_s.capitalize
  closure = $types[type][:closure]
  glcall = $types[type][:glcall]
  esl = $types[type][:esl]
  closure = "Array.<#{closure}>" if array != 1
  arraystr = case array
             when 0
               'Array'
             when 1
               ''
             else
               "Array#{size}"
             end

  $provides.push "goog.provide('embedsl.Uniform#{utype}#{arraystr}');"
  $declarations.push <<EOT
/**
 * Uniform class for type '#{(array != 1 ? 'array of ' : '')}#{type}'.
 *
 * @param {string=} name Uniform name.
 * @param {#{closure}=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.Uniform#{utype}#{arraystr} = function(name, value) {
  goog.base(this, #{esl}, name, value);
};
goog.inherits(embedsl.Uniform#{utype}#{arraystr}, embedsl.Uniform);

/**
 * Create a new uniform object for type #{closure}.
 *
 * @param {string=} name Uniform name.
 * @param {#{closure}=} value Initial value.
 * @return {!embedsl.Uniform#{utype}#{arraystr}} Uniform expression.
 */
embedsl.uniform#{utype}#{arraystr} = function(name, value) {
  return new embedsl.Uniform#{utype}#{arraystr}(name, value);
};

/**
 * Set this uniform to a value of type '#{closure}'.
 *
 * @param {#{closure}} value A new value.
 */
embedsl.Uniform#{utype}#{arraystr}.prototype.set = function(value) {
  /** @type {#{closure}} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. '#{closure}'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.Uniform#{utype}#{arraystr}.prototype.apply = function(gl, loc) {
  #{glcall};
};

/**
 * Create a new uniform object for type #{closure} within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {#{closure}=} value Initial value.
 * @return {!embedsl.Uniform#{utype}#{arraystr}} Uniform expression.
 */
embedsl.UniformSet.prototype.uniform#{utype}#{arraystr} = function(name, value) {
  var u = embedsl.uniform#{utype}#{arraystr}(name, value);
  this.uniforms_[name] = u;
  return u;
};

EOT
end

$types.each do |type, info|
  generate(type, 1)
  # TODO(tramberend) Implement array types for uniforms.
  # puts generate(type, 0)
end

puts <<EOT
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
 * @fileoverview This file contains Uniform classes for all vaid OpenGL
 * unfirm types. Array types are not yet implemented.
 *
 * ATTENTION: Do not edit. This file has been generated from
 * #{$0} by rakefile. Edit those files instead.
 *
 */
EOT

$provides.push "goog.provide('embedsl.UniformSet');"

$provides.sort.each do |req|
  puts req
end

puts <<EOT

goog.require('embedsl.Uniform');
goog.require('goog.vec');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');

/**
 * A set of uniforms that use unique indices.
 *
 * @constructor
 */
embedsl.UniformSet = function() {
  this.uniforms_ = {};
};

EOT

$declarations.each do |req|
  puts req
end

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

# Generate classes for all possible attribute types. For each type give
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
  :float => { :esl => 'embedsl.Type.Float', :closure => 'number', :size => 1 },
  :int => { :esl => 'embedsl.Type.Int', :closure => 'number', :size => 1 },
  :bool => { :esl => 'embedsl.Type.Bool', :closure => 'boolean', :size => 1 },
  :vec2 => { :esl => 'embedsl.Type.Vec2', :closure => 'Array.<number>', :size => 2 },
  :vec3 => { :esl => 'embedsl.Type.Vec3', :closure => 'goog.vec.Vec3.Vec3Like', :size => 3 },
  :vec4 => { :esl => 'embedsl.Type.Vec4', :closure => 'goog.vec.Vec3.Vec3Like', :size => 4 },
  :bvec2 => { :esl => 'embedsl.Type.Bvec2', :closure => 'Array.<boolean>', :size => 2 },
  :bvec3 => { :esl => 'embedsl.Type.Bvec3', :closure => 'Array.<boolean>', :size => 3 },
  :bvec4 => { :esl => 'embedsl.Type.Bvec4', :closure => 'Array.<boolean>', :size => 4 },
  :ivec2 => { :esl => 'embedsl.Type.Ivec2', :closure => 'Array.<number>', :size => 2 },
  :ivec3 => { :esl => 'embedsl.Type.Ivec3', :closure => 'Array.<number>', :size => 3 },
  :ivec4 => { :esl => 'embedsl.Type.Ivec4', :closure => 'Array.<number>', :size => 4 },
}

$provides = []
$declarations = []

def generate(type, array)
  utype = type.to_s.capitalize
  esl = $types[type][:esl]
  closure = $types[type][:closure]
  $provides.push "goog.provide('embedsl.Attribute#{utype}');";
  $declarations.push <<EOT
/**
 * Attribute class for type '#{type}'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.Attribute#{utype} = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, #{esl}),
    name, index);
};
goog.inherits(embedsl.Attribute#{utype}, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.Attribute#{utype}} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attribute#{utype} = function(name) {
  var a = new embedsl.Attribute#{utype}(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

EOT
end

$types.each do |type, info|
  generate(type, 0)
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
 * @fileoverview This file contains Attribute classes for all vaid OpenGL
 * attribute types.
 *
 * ATTENTION: Do not edit. This file has been generated from
 * #{$0} by rakefile. Edit those files instead.
 *
 */
EOT

$provides.push "goog.provide('embedsl.AttributeSet');"

$provides.sort.each do |req|
  puts req
end

puts <<EOT

goog.require('embedsl.Attribute');
goog.require('goog.vec');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');

/**
 * A set of attributes that use unique indices.
 *
 * @constructor
 */
embedsl.AttributeSet = function() {
  this.index_ = 0;
  this.attributes_ = {};
};

EOT

$declarations.each do |req|
  puts req
end

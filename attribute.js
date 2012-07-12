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
 * @fileoverview This file contains expressions that provide vertex attribute
 * input data to the shader programs.
 *
 * ATTENTION: This file has been generated. Do not edit.
 *
 */
goog.provide('embedsl.Attribute');

goog.require('embedsl.Expression');
goog.require('embedsl.Kind');

/**
 * An expression representing an attribute variable.
 *
 * @param {!embedsl.TypeInfo} type Dynamic type info for the expression.
 * @param {string=} name Attribute name.
 * @param {number=} index Generic attribute index for this attribute variable.
 * @constructor
 * @extends {embedsl.Expression}
 */
embedsl.Attribute = function(type, name, index) {
  goog.base(this, embedsl.Kind.ATTRIBUTE, type,
            name || embedsl.GlobalNameStream.create());
  this.index = index || -1;
};
goog.inherits(embedsl.Attribute, embedsl.Expression);

// TODO(tramberend) Remove all dependencies on WebGL from expression definition
// and compilation to enable AOT compilation with V8 at build time.

/**
 * Bind this attribute to generic attribute index for the specified program.
 *
 * @param {WebGLRenderingContext} gl Rendering context.
 * @param {WebGLProgram} program Compiled but not linked WebGL program object.
 */
embedsl.Attribute.prototype.bindLocation = function(gl, program) {
  if (this.index >= 0)
    gl.bindAttribLocation(program, this.index, this.name);
};

/**
 * Returns the number of floats this attribute consists of.
 *
 * @return {number} Number of floats.
 */
embedsl.Attribute.prototype.floats = function() {
  return this.typeInfo.returnType().floats();
};

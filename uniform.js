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
 * @fileoverview Defines the base class for all uniform input expressions.
 *
 * ATTENTION: This file has been generated. Do not edit.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('embedsl.Uniform');

goog.require('embedsl.Expression');
goog.require('embedsl.Kind');
goog.require('embedsl.GlobalNameStream');
goog.require('goog.vec.Mat3');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');
goog.require('goog.vec.Vec4');

/**
 * Base class for all uniforms. Doubles as expression for the AST and
 * as interface to the application.
 *
 * @param {!embedsl.Type} type Type of the uniform.
 * @param {string=} name Name of the uniform.
 * @param {(number|boolean|goog.vec.AnyType)=} value Initial value of the
 * uniform variable.
 * @constructor
 * @extends {embedsl.Expression}
 */
embedsl.Uniform = function(type, name, value) {
  goog.base(this, embedsl.Kind.UNIFORM,
            new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, type),
            name || embedsl.GlobalNameStream.create());

  /** @type {?(number|boolean|goog.vec.AnyType)} */
  this.value = value || null;

  /** @type {number} */
  this.version = 0;
};
goog.inherits(embedsl.Uniform, embedsl.Expression);

// TODO(tramberend) Remove all dependencies on WebGL from expression definition
// and compilation to enable AOT compilation with V8 at build time.

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
 * @fileoverview Definition of the Geometry class that represents geometry and
 * renders it.
 *
 */
goog.provide('scene.Geometry');

goog.require('embedsl.AttributeSet');
goog.require('scene.SolidAttributes');


/**
 * Generates a new geometry object using the passed vertex attribute
 * data. Data must be passed for all attributes defined in the
 * attribute set. The size of the position array determines the
 * attribute count. Indexed geometry is not supported. Attribute data
 * is specified by arrays organized in a javascript object. Object
 * attributes name the vertex attributes.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {!embedsl.AttributeSet} attribset Attribute set.
 * @param {!scene.SolidAttributes} attribdata Attribute data.
 * @constructor
 */
scene.Geometry = function(gl, attribset, attribdata) {
  // Create the opengl objects. Do not save the data.
  // The 'position' attribute is mandatory.
  /** type {number} */
  this.count = attribdata.position.length / 3;

  /** @type {Object.<string,{size: number, vbo: WebGLBuffer}>} */
  this.info = {};
  for (var name in attribset.attributes_) {
    /** @type {Array.<number>} */
    var data = attribdata[name];
    if (!data)
      throw 'Data for required attribute not provided: ' + name;
    var attrib = attribset.attributes_[name];

    /** type {{size: number, vbo: WebGLBuffer}} */
    var ai = {};

    ai.size = Math.round(data.length / this.count);
    ai.vbo = gl.createBuffer();
    // ai.index = attrib.index_;
    gl.bindBuffer(gl.ARRAY_BUFFER, ai.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    this.info[name] = ai;
  }
};

/**
 * Bind the attributes and render the geometry.
 *
 * TODO(tramberend) Clean up binding between geometry and program.
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {!embedsl.Program} program Embedsl shader program.
 */
scene.Geometry.prototype.drawFor = function(gl, program) {
  // Bind data to the attribute indices.
  for (var name in this.info) {
    var index = program.attributeLocationByName(name);
    if (index >= 0) {
      var attribute = this.info[name];
      gl.bindBuffer(gl.ARRAY_BUFFER, this.info[name].vbo);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, this.info[name].size,
                           gl.FLOAT, false, 0, 0);
    }
  }

  // Do the work.
  gl.drawArrays(gl.TRIANGLES, 0, this.count);

  // Unbind everything.
  for (var name in this.info) {
    var index = program.attributeLocationByName(name);
    gl.disableVertexAttribArray(index);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

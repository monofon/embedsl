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
 * @fileoverview Represent a WebGL texture object.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('scene.Texture');

/**
 * Represents a WebGL texture object.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @constructor
 */
scene.Texture = function(gl) {
  /** @type {WebGLTexture} */
  this.obj = gl.createTexture();
};

/**
 * Bind texture to a texture unit.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {number} unit Unit to bind to.
 */
scene.Texture.prototype.bind = function(gl, unit) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, this.obj);
};

/**
 * Construct a texture object from an image URL.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {string} url URL to get the image from.
 * @return {!scene.Texture} Tetxure object.
 */
scene.Texture.create2DFromURL = function(gl, url) {
  var texture = new scene.Texture(gl);
  var image = new Image();
  image.onload = function() {
    // Use texture unit 0 for texture loading.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.obj);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                     gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                     gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
                     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
                     gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                  gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  image.src = url;
  return texture;
};


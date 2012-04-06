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
 * @fileoverview Construction and use of cubemap textures.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('scene.Cubemap');

/**
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @constructor
 */
scene.Cubemap = function(gl) {
  /** @type {WebGLTexture} */
  this.obj = gl.createTexture();

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.obj);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                   gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                   gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
                   gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
                   gl.CLAMP_TO_EDGE);

  scene.Cubemap.dir = scene.Cubemap.dir || {
    'negx': gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    'negy': gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    'negz': gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    'posx': gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    'posy': gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    'posz': gl.TEXTURE_CUBE_MAP_POSITIVE_Z
  };
};

/**
 * Bind texture to a texture unit.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {number} unit Texture unit to bind to.
 */
scene.Cubemap.prototype.bind = function(gl, unit) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.obj);
};

/**
 * Create a cubemap from six images provided as URLs.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {!Object.<string,string>} urls Six image URLs.
 * @return {!scene.Cubemap} Cubemap instance.
 */
scene.Cubemap.createFromURLs = function(gl, urls) {
  var texture = new scene.Cubemap(gl);

  function oneside(dir) {
    var image = new Image();
    image.onload = function() {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.obj);
      gl.texImage2D(scene.Cubemap.dir[dir], 0, gl.RGBA,
                    gl.RGBA, gl.UNSIGNED_BYTE, image);
      console.log(dir + ': ' + scene.Cubemap.dir[dir] + ', ' + image.src);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    };
    image.src = urls[dir];
  }

  for (var dir in urls)
    oneside(dir);

  return texture;
};

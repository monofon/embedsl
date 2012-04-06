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
 * @fileoverview Requires everthing that is in the esl namespace to
 * make genjsdeps.sh happy without having to fiddle with the requires
 * all the time. Will be removed eventually.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('scene');

goog.require('embedsl.AttributeSet');
goog.require('scene.Cubemap');
goog.require('scene.Geometry');
goog.require('scene.Texture');
goog.require('scene.solids');

/**
 * Create a sphere.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {!embedsl.AttributeSet} attribset Attribute set the geometry must support.
 * @return {!scene.Geometry} The sphere geometry.
 */
scene.createSphere = function(gl, attribset) {
  var mesh = scene.solids.makeSphere(4);
  return new scene.Geometry(gl, attribset, mesh);
};

/**
 * Create a cube.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {!embedsl.AttributeSet} attribset Attribute set the geometry must support.
 * @param {boolean=} invert Invert vertex positions, if true.
 * @return {!scene.Geometry} The cube geometry.
 */
scene.createCube = function(gl, attribset, invert) {
  var mesh = scene.solids.makeCube(invert);
  return new scene.Geometry(gl, attribset, mesh);
};

/**
 * Create a texture from an image URL.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @param {string} url Image URL.
 * @return {!scene.Texture} The texture.
 */
scene.createTexture = function(gl, url) {
  return scene.Texture.create2DFromURL(gl, url);
};

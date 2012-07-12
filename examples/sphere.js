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
 * @fileoverview Example for composition of shader modules.
 *
 */
goog.provide('sphere');

goog.require('WebGLUtils');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');
goog.require('shaders');
goog.require('shaders.AppUniforms');
goog.require('shaders.MeshAttribs');
goog.require('scene');

/**
 * Onload handler for the example.
 */
window.onload = function() {
  var Mat4 = goog.vec.Mat4;

  var webglCanvas =
      /** @type {!HTMLCanvasElement} */
      (document.getElementById('webgl-canvas'));
  var gl = WebGLUtils.setupWebGL(webglCanvas);

  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);

  // The shaders from shaders.js
  var compiled = shaders.compiled(gl);
  var skyshader = shaders.skyshader(gl);

  // The geometry beeing used.
  var mesh = scene.createSphere(gl, shaders.attributeSet);
  var skybox = scene.createCube(gl, shaders.attributeSet, true);
  var uniform = shaders.uniformSet;
  var texture = scene.Texture.create2DFromURL(
      gl, 'small-sesame.png');

  var envtex = scene.Cubemap.createFromURLs(
      gl, {
        'negx': 'grid1k.png',
        'negy': 'grid1k.png',
        'negz': 'grid1k.png',
        'posx': 'grid1k.png',
        'posy': 'grid1k.png',
        'posz': 'grid1k.png'
      });

  var angle = 0;
  var mouseX = 0.0, mouseY = 0.0;
  webglCanvas.onmousemove = function(event) {
    mouseX = 2.0 * event.clientX / webglCanvas.width - 1.0;
    mouseY = -2.0 * event.clientY / webglCanvas.height + 1.0;
  };

  var renderLoop = function(time, elapsed) {
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    // Bind the texture
    texture.bind(gl, 1);
    uniform.texture.set(1);

    // Bind the environment texture
    envtex.bind(gl, 2);
    uniform.environment.set(2);

    // Set a perspective projection matrix for the current canvas size.
    var aspect = 1.0 * gl.viewportWidth / gl.viewportHeight;
    uniform.projection.set(
        Mat4.makePerspective(
            Mat4.createFloat32Identity(), 1.0, aspect, 0.1, 100));

    // The model does rotate.
    angle += elapsed * Math.PI / 8;
    var rmat = Mat4.makeRotate(
        Mat4.createFloat32Identity(), angle, 0, 1, 0);

    // The viewing transformation.
    var cam = [mouseX * 20, mouseY * 20, 10];
    var view = Mat4.makeLookAt(
        Mat4.createFloat32Identity(), cam, [0, 0, 0], [0, 1, 0]);

    uniform.camera.set(cam);
    uniform.view.set(view);

    // Render the skybox.
    gl.depthMask(false);
    skyshader.use(gl);
    skybox.drawFor(gl, skyshader);
    gl.depthMask(true);

    var shader = 0;
    var sizex = 4;
    var sizey = 3;
    var sdx = (sizex - 1) / 2.0;
    var sdy = (sizey - 1) / 2.0;
    var d = 3;
    for (var x = 0; x != sizex; x++) {
      var dx = (x - sdx) * d;
      for (var y = 0; y != sizey; y++) {
        var dy = (y - sdy) * d;
        var tmat = Mat4.makeTranslate(Mat4.createFloat32Identity(), dx, dy, 0);
        uniform.model.set(
            Mat4.multMat(tmat, rmat,
                         Mat4.createFloat32Identity()));
        // Bind the shader program, draw the mesh.
        compiled[shader].use(gl);
        mesh.drawFor(gl, compiled[shader]);

        shader = (shader + 1) % compiled.length;
      }
    }

    // Tell the time
    uniform.time.set(time);
  };

  var last = new Date().getTime();
  var time = 0;
  var vsyncedRenderLoop = function() {
    window['requestAnimFrame'](vsyncedRenderLoop, webglCanvas);

    var now = new Date().getTime();
    var elapsed = (now - last) * 1e-3;
    last = now;
    time += elapsed;

    gl.viewportWidth = webglCanvas.width;
    gl.viewportHeight = webglCanvas.height;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    renderLoop(time, elapsed);
  };

  vsyncedRenderLoop();
};

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
 * @fileoverview Simple embedsl example.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('cube');
goog.provide('cube.Attributes');
goog.provide('cube.Uniforms');
goog.provide('cube.BaseShader');
goog.provide('cube.LambertShader');

goog.require('WebGLUtils');
goog.require('embedsl.AttributeSet');
goog.require('embedsl.Program');
goog.require('embedsl.UniformMat4');
goog.require('embedsl.Argument');
goog.require('embedsl.lang');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');
goog.require('scene');

/**
 * Defines the attributes that are used in these examples.
 *
 * @constructor
 * @extends {embedsl.AttributeSet}
 */
cube.Attributes = function() {
  goog.base(this);

  /**
   * @type {!embedsl.AttributeVec3}
   */
  this.position = this.attributeVec3('position');

  /**
   * @type {!embedsl.AttributeVec3}
   */
  this.normal = this.attributeVec3('normal');
};
goog.inherits(cube.Attributes, embedsl.AttributeSet);

/**
 * Defines the uniforms that are used in these examples.
 *
 * @constructor
 * @extends {embedsl.UniformSet}
 */
cube.Uniforms = function() {
  goog.base(this);

  /**
   * @type {!embedsl.UniformMat4}
   */
  this.model = this.uniformMat4('model');

  /**
   * @type {!embedsl.UniformMat4}
   */
  this.view = this.uniformMat4('view');

  /**
   * @type {!embedsl.UniformMat4}
   */
  this.projection = this.uniformMat4('projection');
};
goog.inherits(cube.Uniforms, embedsl.UniformSet);

// Expressions
var s = embedsl.lang;

/**
 * A basic shader program that performs the necessary transformations and uses
 * the interpolated vertex position as the fragment color.
 *
 * @param {!cube.Attributes} attrib The available attributes.
 * @param {!cube.Uniforms} uniform The available uniforms.
 * @extends {embedsl.Program}
 * @constructor
 */
cube.BaseShader = function(attrib, uniform) {
  goog.base(this);

  /**
   * The surface normal vector in eye space.
   * @type {!embedsl.Expression}
   */
  this.vNormal =
      s.perVertexN(
          s.mul(uniform.view, uniform.model, s.vec4(attrib.normal, 0)).xyz());

  /* Set the expression that defines the value of the gl_Position variable. */
  this.gl_Position(
      s.mul(uniform.projection, uniform.view, uniform.model,
            s.vec4(attrib.position, 1)));

  /**
   * The calculated intensity. This is declared virtual an can be overrriden in
   * derived shaders.
   * @type {!embedsl.Virtual}
   */
  this.intensity =
      s.virtual(
          s.mul(0.5, s.add(1, attrib.position)));

  /* Set the expression that defines the value of the gl_FragColor variable. */
  this.gl_FragColor(
      s.vec4(this.intensity, 1));
};
goog.inherits(cube.BaseShader, embedsl.Program);

/**
 * Assembles an expression that calulates Lambert shading.
 *
 * @param {!embedsl.Argument} kd Diffuse coefficient.
 * @param {!embedsl.Argument} intensity Light source intensity.
 * @param {!embedsl.Argument} light Direction to light source.
 * @param {!embedsl.Argument} normal Surface normal vector.
 * @return {!embedsl.Expression} Assembled expression.
 */
cube.lambert = function(kd, intensity, light, normal) {
  return s.add(
      s.mul(kd, 0.2, intensity),
      s.mul(kd, s.mul(s.max(s.dot(normal, light), 0), intensity)));
};

/**
 * Extends the BaseShader and overrides the intensity definition.
 *
 * @param {!cube.Attributes} attrib The available attributes.
 * @param {!cube.Uniforms} uniform The available uniforms.
 * @extends {cube.BaseShader}
 * @constructor
 */
cube.LambertShader = function(attrib, uniform) {
  goog.base(this, attrib, uniform);

  /* Overrides the intensity definiton. Uses the global lambert function. */
  this.intensity.override(
      cube.lambert([1, 0, 0], [0.8, 0.8, 0.8], [1, 1, -1], this.vNormal));
};
goog.inherits(cube.LambertShader, cube.BaseShader);

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
  gl.enable(gl.CULL_FACE);

  var attributes = new cube.Attributes();
  var uniforms = new cube.Uniforms();

  /* Compiles the shader programs. */
  var baseShader = new cube.BaseShader(attributes, uniforms).compile();
  var lambertShader = new cube.LambertShader(attributes, uniforms).compile();

  console.log('\n');
  console.log(baseShader.ast.vertexShader);
  console.log(baseShader.ast.fragmentShader);
  console.log('\n');
  console.log(lambertShader.ast.vertexShader);
  console.log(lambertShader.ast.fragmentShader);
  console.log('\n');

  var cubeMesh = scene.createCube(gl, attributes);

  var shader = lambertShader;
  webglCanvas.onclick = function() {
    shader = (shader === baseShader ? lambertShader : baseShader);
  };

  var angle = 0;

  var renderLoop = function(time, elapsed) {
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    // Set a perspective projection matrix for the current canvas size.
    var aspect = 1.0 * gl.viewportWidth / gl.viewportHeight;
    var projectionMat =
        Mat4.makePerspective(
            Mat4.createFloat32Identity(), 1.0, aspect, 0.1, 100);

    // The model does rotate.
    angle += elapsed * Math.PI / 8;
    var rotationMat = Mat4.makeRotate(
        Mat4.createFloat32Identity(), angle, 0, 1, 0);


    // The viewing transformation.
    var viewMat = Mat4.makeLookAt(
        Mat4.createFloat32Identity(), [0, 0, 5], [0, 0, 0], [0, 1, 0]);

    uniforms.view.set(viewMat);
    uniforms.model.set(rotationMat);
    uniforms.projection.set(projectionMat);

    shader.use(gl);
    cubeMesh.drawFor(gl, shader);
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

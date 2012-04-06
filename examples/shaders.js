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
 * @fileoverview Shader definitions for the sphere example.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('shaders');
goog.provide('shaders.AppUniforms');
goog.provide('shaders.Base');
goog.provide('shaders.DiffuseMap');
goog.provide('shaders.DiffuseMapBlur');
goog.provide('shaders.EnvMap');
goog.provide('shaders.Lambert');
goog.provide('shaders.Lit');
goog.provide('shaders.MeshAttribs');
goog.provide('shaders.Phong');
goog.provide('shaders.Ripple');
goog.provide('shaders.SkyBox');

goog.require('WebGLUtils');
goog.require('embedsl.AttributeSet');
goog.require('embedsl.AttributeVec2');
goog.require('embedsl.AttributeVec3');
goog.require('embedsl.Program');
goog.require('embedsl.UniformFloat');
goog.require('embedsl.UniformMat4');
goog.require('embedsl.UniformSampler2d');
goog.require('embedsl.UniformSamplercube');
goog.require('embedsl.UniformSet');
goog.require('embedsl.UniformVec3');
goog.require('embedsl.lang');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');
goog.require('goog.vec.Vec4');

/**
 * Transformation matrices.
 * @constructor
 * @extends {embedsl.UniformSet}
 */
shaders.AppUniforms = function() {
  goog.base(this);

  /** @type {embedsl.UniformMat4} */
  this.model = this.uniformMat4('model');

  /** @type {embedsl.UniformMat4} */
  this.view = this.uniformMat4('view');

  /** @type {embedsl.UniformMat4} */
  this.projection = this.uniformMat4('projection');

  /** @type {embedsl.UniformVec3} */
  this.camera = this.uniformVec3('camera');

  /** @type {embedsl.UniformVec3} */
  this.light = this.uniformVec3('light');

  /** @type {embedsl.UniformSampler2d} */
  this.texture = this.uniformSampler2d('texture');

  /** @type {embedsl.UniformSamplercube} */
  this.environment = this.uniformSamplercube('environment');

  /** @type {embedsl.UniformFloat} */
  this.time = this.uniformFloat();
};
goog.inherits(shaders.AppUniforms, embedsl.UniformSet);

/**
 * @constructor
 * @extends {embedsl.AttributeSet}
 */
shaders.MeshAttribs = function() {
  goog.base(this);

  /** @type {embedsl.AttributeVec3} */
  this.position = this.attributeVec3('position');

  /** @type {embedsl.AttributeVec3} */
  this.normal = this.attributeVec3('normal');

  /** @type {embedsl.AttributeVec2} */
  this.texcoord = this.attributeVec2('texcoord');
};
goog.inherits(shaders.MeshAttribs, embedsl.AttributeSet);

/** @type {!shaders.AppUniforms} */
shaders.uniformSet = new shaders.AppUniforms();

/** @type {!shaders.MeshAttribs} */
shaders.attributeSet = new shaders.MeshAttribs();

var Mat4 = goog.vec.Mat4;
var s = embedsl.lang;
var u = shaders.uniformSet;
var m = shaders.attributeSet;

shaders.lambert = function(ka, kd, intensity, light, normal) {
  return s.add(
      s.mul(ka, intensity),
      s.mul(kd, s.mul(s.max(s.dot(normal, light), 0), intensity))
      );
};

shaders.phong = function(ka, kd, ks, ke, intensity, light, normal, eye) {
  return s.add(
      s.mul(ka, intensity),
      s.mul(kd, s.mul(s.max(s.dot(normal, light), 0), intensity)),
      s.mul(ks, s.mul(s.pow(s.max(s.dot(s.reflect(eye, normal), light),
                                  0), ke), intensity))
      );
};

shaders.wave = function(freq, speed, ampl, loc, time, d) {
  var fn = (d ? s.cos : s.sin);
  return s.mul(ampl,
               fn(s.add(s.mul(freq, loc),
                        s.mul(speed, time))));
};

/**
 * Definition of a base shader.
 *
 * @constructor
 * @extends {embedsl.Program}
 */
shaders.Base = function() {
  /** @type {embedsl.Virtual} */
  this.mPosition = s.virtual(m.position);

  /** @type {embedsl.Virtual} */
  this.mNormal = s.virtual(m.normal);

  this.gl_Position(
      s.mul(u.projection, u.view, u.model, s.vec4(this.mPosition, 1)));

  /** @type {embedsl.Virtual} */
  this.intensity = s.virtual(this.mNormal);

  this.gl_FragColor(
      s.vec4(this.intensity, 1));
};
shaders.Base = embedsl.Program.extend(shaders.Base, embedsl.Program);

/**
 * Space-time ripples in model-space.
 *
 * @constructor
 * @extends {shaders.Base}
 */
shaders.Ripple = function() {
  /** @type {embedsl.Expression} */
  var direction = s.normalize(s.vec3(1, 1, 0));

  /** @type {embedsl.Expression} */
  var projected = s.dot(direction, m.position);

  /** @type {embedsl.Expression} */
  var dispdir = s.sub(m.position, s.mul(direction, projected));

  /** @type {embedsl.Expression} */
  var displacement = shaders.wave(5, 10, 0.2, projected, u.time, 0);

  /** @type {embedsl.Expression} */
  var ndisplacement = shaders.wave(5, 10, 0.2, projected, u.time, 1);

  this.mPosition.override(
      s.add(m.position, s.mul(dispdir, displacement)));

  this.mNormal.override(
      s.normalize(s.add(m.normal, s.mul(direction, ndisplacement))));
};
shaders.Ripple = embedsl.Program.extend(shaders.Ripple, shaders.Base);


/**
 * @constructor
 * @extends {shaders.Base}
 */
shaders.Discard = function() {
  this.dcoord = s.floor(s.mul(10, m.texcoord));
  this.intensity.override(
      s.discardOrElse(
          s.eq(0, s.mod(s.add(this.dcoord.x(), this.dcoord.y()), 2)),
          this.intensity.value()));
};
shaders.Discard = embedsl.Program.extend(shaders.Discard, shaders.Base);

/**
 * Lit geometry.
 *
 * @constructor
 * @extends {shaders.Base}
 */
shaders.Lit = function() {
  /** @type {embedsl.Expression} */
  this.vNormal =
      s.perVertexN(
          s.mul(u.view, u.model, s.vec4(this.mNormal, 0)).xyz());

  /** @type {embedsl.Expression} */
  this.vEyeDir =
      s.perVertexN(
          s.mul(u.view, u.model, s.vec4(this.mPosition, 1)).xyz());

  /** @type {embedsl.Expression} */
  this.vLightDir =
      s.perVertexN(
          s.mul(u.view, s.vec4(1, 1, 1, 0)).xyz());

  /** @type {embedsl.Virtual} */
  this.diffuse = s.virtual(
      s.vec3(0.7, 0.0, 0.0));

  /** @type {embedsl.Virtual} */
  this.ambient = s.virtual(
      s.mul(this.diffuse, 0.2));
};
shaders.Lit = embedsl.Program.extend(shaders.Lit, shaders.Base);

/**
 * Definition of an extension module that overrides intensity with a Phong
 * shader.
 *
 * @constructor
 * @extends {shaders.Lit}
 */
shaders.Phong = function() {
  /** @type {embedsl.Expression} */
  this.specular = s.vec3(1.0, 1.0, 1.0);

  this.intensity.override(
      shaders.phong(this.ambient, this.diffuse, this.specular, 50,
                    [0.8, 0.8, 0.8], this.vLightDir,
                    this.vNormal, this.vEyeDir));
};
shaders.Phong = embedsl.Program.extend(shaders.Phong, shaders.Lit);

/**
 * Definition of an extension module that overrides intensity with a lambert
 * shader.
 *
 * @constructor
 * @extends {shaders.Lit}
 */
shaders.Lambert = function() {
  this.intensity.override(
      shaders.lambert(this.ambient, this.diffuse,
                      [0.8, 0.8, 0.8], this.vLightDir,
                      this.vNormal));
};
shaders.Lambert = embedsl.Program.extend(shaders.Lambert, shaders.Lit);

/**
 * Further extending that.
 *
 * @constructor
 * @extends {shaders.Lit}
 */
shaders.DiffuseMap = function() {
  this.diffuse.override(
      s.texture2D(u.texture, m.texcoord).rgb());
};
shaders.DiffuseMap = embedsl.Program.extend(shaders.DiffuseMap, shaders.Lit);

/**
 * A diffuse map that blurs the texture lookup by sampling ten times in the
 * (1,1) direction.
 *
 * @constructor
 * @extends {shaders.Lit}
 */
shaders.DiffuseMapBlur = function() {
  this.diffuse.override(
      s.accumulate(
          s.range(0, 9), s.vec3(0, 0, 0),
          s.add(s.accumulator,
                s.mul(0.1,
                      s.texture2D(u.texture,
                                  s.add(m.texcoord,
                                        s.mul(s.iterator, 0.003))).rgb()))));
};
shaders.DiffuseMapBlur =
    embedsl.Program.extend(shaders.DiffuseMapBlur, shaders.Lit);

/**
 * Further extending that.
 *
 * @constructor
 * @extends {shaders.Lit}
 */
shaders.EnvMap = function() {
  /** @type {embedsl.Expression} */
  var wNormal =
      s.perVertexN(
          s.mul(u.model, s.vec4(this.mNormal, 0)).xyz());

  /** @type {embedsl.Expression} */
  var reflected =
      s.reflect(s.normalize(s.minus(u.camera)),
                wNormal);

  this.intensity.override(
      s.add(s.mul(s.vec3(0.8, 0.8, 0.9),
                  s.textureCube(u.environment, reflected).rgb()),
            shaders.phong([0, 0, 0], [0, 0, 0], [1, 1, 1], 10.1,
                          [0.8, 0.8, 0.8], this.vLightDir,
                          this.vNormal, this.vEyeDir)));
};
shaders.EnvMap = embedsl.Program.extend(shaders.EnvMap, shaders.Lit);

/**
 * A simple skybox.
 *
 * @constructor
 * @extends {embedsl.Program}
 */
shaders.SkyBox = function() {
  /** @type {embedsl.Expression} */
  var direction =
      s.mul(s.vec4(m.position, 0), u.view).xyz();

  this.gl_Position(
      s.mul(u.projection, s.vec4(m.position, 1)));

  this.gl_FragColor(
      s.textureCube(
          u.environment,
          s.normalize(direction)));
};
shaders.SkyBox = embedsl.Program.extend(shaders.SkyBox, embedsl.Program);

/**
 * @constructor
 */

/**
 * Compile shaders to GLSL.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @return {!Array.<embedsl.Program>} Compiled programs.
 */
shaders.compiled = function(gl) {
  var programs =
      [
        new shaders.Base(),
        new shaders.EnvMap(),
        new shaders.Base().mixin(shaders.Ripple),
        new shaders.EnvMap().mixin(shaders.Ripple),
        new shaders.Lambert().mixin(shaders.Ripple).mixin(shaders.Discard),
        new shaders.Lambert().mixin(shaders.Ripple).mixin(shaders.DiffuseMap),
        new shaders.Phong().mixin(shaders.DiffuseMap),
        new shaders.Phong().mixin(shaders.Ripple),
        new shaders.Phong().mixin(shaders.Ripple).mixin(shaders.DiffuseMap),
        new shaders.Phong().mixin(shaders.Ripple).mixin(shaders.DiffuseMapBlur),
        new shaders.Lambert().mixin(shaders.DiffuseMapBlur),
        new shaders.Base().mixin(shaders.Discard)
      ];

  for (var i = 0; i != programs.length; i++) {
    // TODO(tramberend) Remove.
    console.log('\nshaders.compiled(): About to compile program ' + i +
        ' --------------------------');
    programs[i].compile();
    console.log(programs[i].ast.vertexShader);
    console.log(programs[i].ast.fragmentShader);
  }

  return programs;
};

/**
 * Compile skybox shader to GLSL.
 *
 * @param {!WebGLRenderingContext} gl Rendering context.
 * @return {!embedsl.Program} Compiled skybox shader.
 */
shaders.skyshader = function(gl) {
  return new shaders.SkyBox().compile();
};

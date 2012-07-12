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
 * @fileoverview Defines the Program class which is the base class for all
 * embeded shader definitions.
 *
 */
goog.provide('embedsl.Program');

goog.require('embedsl.Ast');
goog.require('embedsl.Definition');
goog.require('embedsl.DefinitionKind');
goog.require('embedsl.Expression');
goog.require('embedsl.GLSLGenerator');
goog.require('embedsl.Inferrer');
goog.require('embedsl.Kind');
goog.require('embedsl.Localizer');
goog.require('embedsl.Mapper');
goog.require('embedsl.Plumber');
goog.require('embedsl.Purger');

/**
 * Base class for an embedded shader program definition. The class defines all
 * built-in global variables available to a shader program. Derived classes can
 * add application specific uniform and attribute variables.
 *
 * Provides access to GLSL 1.0 built-in inputs and constants.
 *
 * @constructor
 */
embedsl.Program = function() {
  /**
   * Output variables used by this shader.
   *
   * @type {!Object.<string,!embedsl.Definition>}
   */
  this.outputs = {};

  /** @type {embedsl.Ast} */
  this.ast = null;

  /** @type {WebGLProgram} */
  this.glProgram = null;

  /** @type {Object.<string,{location:WebGLUniformLocation,version:number}>}
   *  @private
   */
  this.uniformLocations_ = {};

  /** @type {Object.<string,number>}
   *  @private
   */
  this.attributeLocations_ = {};
};

/**
 * Define the value of the gl_Position variable.
 *
 * @param {!embedsl.Expression} def Defining expression.
 */
embedsl.Program.prototype.gl_Position = function(def) {
  this.outputs['gl_Position'] =
      new embedsl.Definition(embedsl.DefinitionKind.BUILTIN,
                         'vertex', embedsl.Type.Vec4, 'gl_Position', def);
};

/**
 * Define the value of the gl_FragColor variable.
 *
 * @param {!embedsl.Expression} def Defining expression.
 */
embedsl.Program.prototype.gl_FragColor = function(def) {
  this.outputs['gl_FragColor'] =
      new embedsl.Definition(embedsl.DefinitionKind.BUILTIN,
                         'fragment', embedsl.Type.Vec4, 'gl_FragColor', def);
};

/**
 * Add a mixin to a progam instance. Applies a constructor function to
 * the existing shader definition.
 *
 * @param {function(?boolean)} mixin Override all definitions found in the
 * mixin.
 * @return {embedsl.Program} Extended shader program.
 */
embedsl.Program.prototype.mixin = function(mixin) {
  mixin.call(this, true);
  return this;
};

/**
 * Inheritance with automatic conditional invocation of the base class
 * constructor function. This is compatible with closure library's
 * base.inherits() method and thus with static type checking.
 *
 * @param {function()} ext Constructor function of the extending shader
 * definiton.
 * @param {function()} base Constructor function of the extended shader
 * definiton.
 * @return {function(?boolean)} Resulting constructor function.
 */
embedsl.Program.extend = function(ext, base) {
  // A fresh constructor function that handles calling of the base
  // constructor functions.
  var ctor = function(mixin) {
    // Don't call the base constructor if this is just mixed in.
    if (!mixin) base.call(this);
    ext.call(this);
  };

  /**
   * Normal proto chain construction.
   *
   * @constructor
   */
  function tempCtor() {};
  tempCtor.prototype = base.prototype;
  ctor.superClass_ = base.prototype;
  ctor.prototype = new tempCtor();
  ctor.prototype.constructor = ctor;
  return ctor;
};

/**
 * Compile the program in-place to GLSL source code. Allows set() functions on
 * uniform properties to be type checked.
 *
 * @param {Object=} options Compile options.
 * @return {!embedsl.Program} The program.
 */
embedsl.Program.prototype.compile = function(options) {
  var opts = {'rename': false};
  goog.object.extend(opts, options || {});

  var passes = [
    new embedsl.Inferrer(),
    new embedsl.Localizer(),
    // TODO(tramberend) Find strange bug in purger. Until then, no optimization.
    // new embedsl.Purger(),
    new embedsl.Mapper(),
    new embedsl.Plumber(),
    new embedsl.GLSLGenerator(opts['rename'])
  ];

  this.ast = new embedsl.Ast(this.outputs, this);
  for (var i in passes)
    this.ast = passes[i].transformAst(this.ast);

  return this;
};

/**
 * Inject a hand crafted ast into the compilation chain. Strictly for debugging.
 *
 * @param {!embedsl.Ast} ast Hand crafted ast.
 * @return {!embedsl.Program} The program.
 */
embedsl.Program.prototype.inject = function(ast) {
  this.ast = ast;
  return this;
};

/**
 * Returns the uniform location object for the named uniform.
 *
 * @param {string} name Uniform name.
 * @return {WebGLUniformLocation} The uniform location.
 */
embedsl.Program.prototype.uniformLocationByName = function(name) {
  var l = this.uniformLocations_[name];
  return l ? l.location : null;
};

/**
 * Returns the attribute index for the named attribute.
 *
 * @param {string} name Attribute name.
 * @return {number} The attribute index.
 */
embedsl.Program.prototype.attributeLocationByName = function(name) {
  var i = this.attributeLocations_[name];
  return i == undefined ? -1 : i;
};

/**
 * Use the program in a WebGL context. Compiles the GLSL source code on the
 * first call.
 *
 * @param {WebGLRenderingContext} gl Rendering context.
 */
embedsl.Program.prototype.use = function(gl) {
  if (!this.ast)
    throw 'Compile embedsl program before use.';

  if (!this.glProgram)
    this.compileAndLinkProgram_(gl);

  gl.useProgram(this.glProgram);

  // Pull the current values from the uniforms.
  for (var name in this.ast.uniforms) {
    var uniform = this.ast.uniforms[name];
    var location = this.uniformLocations_[name];

    // But only if neccessary.
    if (location.version < uniform.version)
      uniform.apply(gl, location.location);
    location.version = uniform.version;
  }
};

// TODO(tramberend) Remove all dependencies on WebGL from expression definition
// and compilation to enable AOT compilation with V8 at build time.
/**
 * Compile GLSL shader.
 *
 * @param {WebGLRenderingContext} gl Rendering context.
 * @param {number} type Shader type.
 * @param {string} source GLSL source code.
 * @return {WebGLShader} Compiled shader.
 * @private
 */
embedsl.Program.prototype.compileShader_ = function(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  // TODO(tramberend) Build more useful error handling.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw gl.getShaderInfoLog(shader) + '\n' + source;
  return shader;
};

/**
 * Compile and link GLSL shader definiton.
 *
 * @param {WebGLRenderingContext} gl Rendering context.
 * @private
 */
embedsl.Program.prototype.compileAndLinkProgram_ = function(gl) {
  this.glProgram = gl.createProgram();

  gl.attachShader(
      this.glProgram,
      this.compileShader_(
          gl, gl.VERTEX_SHADER, this.ast.vertexShader));

  gl.attachShader(
      this.glProgram,
      this.compileShader_(
          gl, gl.FRAGMENT_SHADER, this.ast.fragmentShader));

  // Bind attribute locations, if specified.
  var attribs = this.ast.attributes;
  for (var a in attribs)
    attribs[a].bindLocation(gl, this.glProgram);

  gl.linkProgram(this.glProgram);
  if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS))
    throw gl.getProgramInfoLog(this.glProgram);

  // Get uniform locations.
  for (var name in this.ast.uniforms)
    this.uniformLocations_[name] = {
      location: gl.getUniformLocation(this.glProgram, name),
      version: 0
    };

  // Get attribute locations.
  for (var name in this.ast.attributes)
    this.attributeLocations_[name] = gl.getAttribLocation(this.glProgram, name);
};

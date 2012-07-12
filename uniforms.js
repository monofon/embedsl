// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file contains Uniform classes for all vaid OpenGL
 * unfirm types. Array types are not yet implemented.
 *
 * ATTENTION: Do not edit. This file has been generated from
 * gen/gen-uniforms.rb by rakefile. Edit those files instead.
 *
 */
goog.provide('embedsl.UniformBool');
goog.provide('embedsl.UniformBvec2');
goog.provide('embedsl.UniformBvec3');
goog.provide('embedsl.UniformBvec4');
goog.provide('embedsl.UniformFloat');
goog.provide('embedsl.UniformInt');
goog.provide('embedsl.UniformIvec2');
goog.provide('embedsl.UniformIvec3');
goog.provide('embedsl.UniformIvec4');
goog.provide('embedsl.UniformMat2');
goog.provide('embedsl.UniformMat3');
goog.provide('embedsl.UniformMat4');
goog.provide('embedsl.UniformSampler2d');
goog.provide('embedsl.UniformSamplercube');
goog.provide('embedsl.UniformSet');
goog.provide('embedsl.UniformVec2');
goog.provide('embedsl.UniformVec3');
goog.provide('embedsl.UniformVec4');

goog.require('embedsl.Uniform');
goog.require('goog.vec');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');

/**
 * A set of uniforms that use unique indices.
 *
 * @constructor
 */
embedsl.UniformSet = function() {
  this.uniforms_ = {};
};

/**
 * Uniform class for type 'mat4'.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Mat4.AnyType=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformMat4 = function(name, value) {
  goog.base(this, embedsl.Type.Mat4, name, value);
};
goog.inherits(embedsl.UniformMat4, embedsl.Uniform);

/**
 * Create a new uniform object for type goog.vec.Mat4.AnyType.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Mat4.AnyType=} value Initial value.
 * @return {!embedsl.UniformMat4} Uniform expression.
 */
embedsl.uniformMat4 = function(name, value) {
  return new embedsl.UniformMat4(name, value);
};

/**
 * Set this uniform to a value of type 'goog.vec.Mat4.AnyType'.
 *
 * @param {goog.vec.Mat4.AnyType} value A new value.
 */
embedsl.UniformMat4.prototype.set = function(value) {
  /** @type {goog.vec.Mat4.AnyType} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'goog.vec.Mat4.AnyType'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformMat4.prototype.apply = function(gl, loc) {
  gl.uniformMatrix4fv(loc, false, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type goog.vec.Mat4.AnyType within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Mat4.AnyType=} value Initial value.
 * @return {!embedsl.UniformMat4} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformMat4 = function(name, value) {
  var u = embedsl.uniformMat4(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'vec2'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformVec2 = function(name, value) {
  goog.base(this, embedsl.Type.Vec2, name, value);
};
goog.inherits(embedsl.UniformVec2, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<number>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformVec2} Uniform expression.
 */
embedsl.uniformVec2 = function(name, value) {
  return new embedsl.UniformVec2(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<number>'.
 *
 * @param {Array.<number>} value A new value.
 */
embedsl.UniformVec2.prototype.set = function(value) {
  /** @type {Array.<number>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<number>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformVec2.prototype.apply = function(gl, loc) {
  gl.uniform2fv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<number> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformVec2} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformVec2 = function(name, value) {
  var u = embedsl.uniformVec2(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'ivec2'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformIvec2 = function(name, value) {
  goog.base(this, embedsl.Type.Ivec2, name, value);
};
goog.inherits(embedsl.UniformIvec2, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<number>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformIvec2} Uniform expression.
 */
embedsl.uniformIvec2 = function(name, value) {
  return new embedsl.UniformIvec2(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<number>'.
 *
 * @param {Array.<number>} value A new value.
 */
embedsl.UniformIvec2.prototype.set = function(value) {
  /** @type {Array.<number>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<number>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformIvec2.prototype.apply = function(gl, loc) {
  gl.uniform2iv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<number> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformIvec2} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformIvec2 = function(name, value) {
  var u = embedsl.uniformIvec2(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'sampler2D'.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformSampler2d = function(name, value) {
  goog.base(this, embedsl.Type.Sampler2d, name, value);
};
goog.inherits(embedsl.UniformSampler2d, embedsl.Uniform);

/**
 * Create a new uniform object for type number.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformSampler2d} Uniform expression.
 */
embedsl.uniformSampler2d = function(name, value) {
  return new embedsl.UniformSampler2d(name, value);
};

/**
 * Set this uniform to a value of type 'number'.
 *
 * @param {number} value A new value.
 */
embedsl.UniformSampler2d.prototype.set = function(value) {
  /** @type {number} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'number'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformSampler2d.prototype.apply = function(gl, loc) {
  gl.uniform1i(loc, /** @type {number} */(this.value));
};

/**
 * Create a new uniform object for type number within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformSampler2d} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformSampler2d = function(name, value) {
  var u = embedsl.uniformSampler2d(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'vec3'.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Vec3.AnyType=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformVec3 = function(name, value) {
  goog.base(this, embedsl.Type.Vec3, name, value);
};
goog.inherits(embedsl.UniformVec3, embedsl.Uniform);

/**
 * Create a new uniform object for type goog.vec.Vec3.AnyType.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Vec3.AnyType=} value Initial value.
 * @return {!embedsl.UniformVec3} Uniform expression.
 */
embedsl.uniformVec3 = function(name, value) {
  return new embedsl.UniformVec3(name, value);
};

/**
 * Set this uniform to a value of type 'goog.vec.Vec3.AnyType'.
 *
 * @param {goog.vec.Vec3.AnyType} value A new value.
 */
embedsl.UniformVec3.prototype.set = function(value) {
  /** @type {goog.vec.Vec3.AnyType} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'goog.vec.Vec3.AnyType'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformVec3.prototype.apply = function(gl, loc) {
  gl.uniform3fv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type goog.vec.Vec3.AnyType within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Vec3.AnyType=} value Initial value.
 * @return {!embedsl.UniformVec3} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformVec3 = function(name, value) {
  var u = embedsl.uniformVec3(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'ivec3'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformIvec3 = function(name, value) {
  goog.base(this, embedsl.Type.Ivec3, name, value);
};
goog.inherits(embedsl.UniformIvec3, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<number>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformIvec3} Uniform expression.
 */
embedsl.uniformIvec3 = function(name, value) {
  return new embedsl.UniformIvec3(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<number>'.
 *
 * @param {Array.<number>} value A new value.
 */
embedsl.UniformIvec3.prototype.set = function(value) {
  /** @type {Array.<number>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<number>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformIvec3.prototype.apply = function(gl, loc) {
  gl.uniform3iv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<number> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformIvec3} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformIvec3 = function(name, value) {
  var u = embedsl.uniformIvec3(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'samplerCube'.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformSamplercube = function(name, value) {
  goog.base(this, embedsl.Type.Samplercube, name, value);
};
goog.inherits(embedsl.UniformSamplercube, embedsl.Uniform);

/**
 * Create a new uniform object for type number.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformSamplercube} Uniform expression.
 */
embedsl.uniformSamplercube = function(name, value) {
  return new embedsl.UniformSamplercube(name, value);
};

/**
 * Set this uniform to a value of type 'number'.
 *
 * @param {number} value A new value.
 */
embedsl.UniformSamplercube.prototype.set = function(value) {
  /** @type {number} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'number'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformSamplercube.prototype.apply = function(gl, loc) {
  gl.uniform1i(loc, /** @type {number} */(this.value));
};

/**
 * Create a new uniform object for type number within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformSamplercube} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformSamplercube = function(name, value) {
  var u = embedsl.uniformSamplercube(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'vec4'.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Vec4.AnyType=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformVec4 = function(name, value) {
  goog.base(this, embedsl.Type.Vec4, name, value);
};
goog.inherits(embedsl.UniformVec4, embedsl.Uniform);

/**
 * Create a new uniform object for type goog.vec.Vec4.AnyType.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Vec4.AnyType=} value Initial value.
 * @return {!embedsl.UniformVec4} Uniform expression.
 */
embedsl.uniformVec4 = function(name, value) {
  return new embedsl.UniformVec4(name, value);
};

/**
 * Set this uniform to a value of type 'goog.vec.Vec4.AnyType'.
 *
 * @param {goog.vec.Vec4.AnyType} value A new value.
 */
embedsl.UniformVec4.prototype.set = function(value) {
  /** @type {goog.vec.Vec4.AnyType} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'goog.vec.Vec4.AnyType'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformVec4.prototype.apply = function(gl, loc) {
  gl.uniform4fv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type goog.vec.Vec4.AnyType within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Vec4.AnyType=} value Initial value.
 * @return {!embedsl.UniformVec4} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformVec4 = function(name, value) {
  var u = embedsl.uniformVec4(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'ivec4'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformIvec4 = function(name, value) {
  goog.base(this, embedsl.Type.Ivec4, name, value);
};
goog.inherits(embedsl.UniformIvec4, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<number>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformIvec4} Uniform expression.
 */
embedsl.uniformIvec4 = function(name, value) {
  return new embedsl.UniformIvec4(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<number>'.
 *
 * @param {Array.<number>} value A new value.
 */
embedsl.UniformIvec4.prototype.set = function(value) {
  /** @type {Array.<number>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<number>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformIvec4.prototype.apply = function(gl, loc) {
  gl.uniform4iv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<number> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformIvec4} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformIvec4 = function(name, value) {
  var u = embedsl.uniformIvec4(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'bvec2'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformBvec2 = function(name, value) {
  goog.base(this, embedsl.Type.Bvec2, name, value);
};
goog.inherits(embedsl.UniformBvec2, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<boolean>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @return {!embedsl.UniformBvec2} Uniform expression.
 */
embedsl.uniformBvec2 = function(name, value) {
  return new embedsl.UniformBvec2(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<boolean>'.
 *
 * @param {Array.<boolean>} value A new value.
 */
embedsl.UniformBvec2.prototype.set = function(value) {
  /** @type {Array.<boolean>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<boolean>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformBvec2.prototype.apply = function(gl, loc) {
  gl.uniform2iv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<boolean> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @return {!embedsl.UniformBvec2} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformBvec2 = function(name, value) {
  var u = embedsl.uniformBvec2(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'mat2'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformMat2 = function(name, value) {
  goog.base(this, embedsl.Type.Mat2, name, value);
};
goog.inherits(embedsl.UniformMat2, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<number>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformMat2} Uniform expression.
 */
embedsl.uniformMat2 = function(name, value) {
  return new embedsl.UniformMat2(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<number>'.
 *
 * @param {Array.<number>} value A new value.
 */
embedsl.UniformMat2.prototype.set = function(value) {
  /** @type {Array.<number>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<number>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformMat2.prototype.apply = function(gl, loc) {
  gl.uniformMatrix2fv(loc, false, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<number> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<number>=} value Initial value.
 * @return {!embedsl.UniformMat2} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformMat2 = function(name, value) {
  var u = embedsl.uniformMat2(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'int'.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformInt = function(name, value) {
  goog.base(this, embedsl.Type.Int, name, value);
};
goog.inherits(embedsl.UniformInt, embedsl.Uniform);

/**
 * Create a new uniform object for type number.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformInt} Uniform expression.
 */
embedsl.uniformInt = function(name, value) {
  return new embedsl.UniformInt(name, value);
};

/**
 * Set this uniform to a value of type 'number'.
 *
 * @param {number} value A new value.
 */
embedsl.UniformInt.prototype.set = function(value) {
  /** @type {number} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'number'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformInt.prototype.apply = function(gl, loc) {
  gl.uniform1i(loc, /** @type {number} */(this.value));
};

/**
 * Create a new uniform object for type number within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformInt} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformInt = function(name, value) {
  var u = embedsl.uniformInt(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'bvec3'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformBvec3 = function(name, value) {
  goog.base(this, embedsl.Type.Bvec3, name, value);
};
goog.inherits(embedsl.UniformBvec3, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<boolean>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @return {!embedsl.UniformBvec3} Uniform expression.
 */
embedsl.uniformBvec3 = function(name, value) {
  return new embedsl.UniformBvec3(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<boolean>'.
 *
 * @param {Array.<boolean>} value A new value.
 */
embedsl.UniformBvec3.prototype.set = function(value) {
  /** @type {Array.<boolean>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<boolean>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformBvec3.prototype.apply = function(gl, loc) {
  gl.uniform3iv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<boolean> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @return {!embedsl.UniformBvec3} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformBvec3 = function(name, value) {
  var u = embedsl.uniformBvec3(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'mat3'.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Mat3.AnyType=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformMat3 = function(name, value) {
  goog.base(this, embedsl.Type.Mat3, name, value);
};
goog.inherits(embedsl.UniformMat3, embedsl.Uniform);

/**
 * Create a new uniform object for type goog.vec.Mat3.AnyType.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Mat3.AnyType=} value Initial value.
 * @return {!embedsl.UniformMat3} Uniform expression.
 */
embedsl.uniformMat3 = function(name, value) {
  return new embedsl.UniformMat3(name, value);
};

/**
 * Set this uniform to a value of type 'goog.vec.Mat3.AnyType'.
 *
 * @param {goog.vec.Mat3.AnyType} value A new value.
 */
embedsl.UniformMat3.prototype.set = function(value) {
  /** @type {goog.vec.Mat3.AnyType} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'goog.vec.Mat3.AnyType'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformMat3.prototype.apply = function(gl, loc) {
  gl.uniformMatrix3fv(loc, false, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type goog.vec.Mat3.AnyType within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {goog.vec.Mat3.AnyType=} value Initial value.
 * @return {!embedsl.UniformMat3} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformMat3 = function(name, value) {
  var u = embedsl.uniformMat3(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'bool'.
 *
 * @param {string=} name Uniform name.
 * @param {boolean=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformBool = function(name, value) {
  goog.base(this, embedsl.Type.Bool, name, value);
};
goog.inherits(embedsl.UniformBool, embedsl.Uniform);

/**
 * Create a new uniform object for type boolean.
 *
 * @param {string=} name Uniform name.
 * @param {boolean=} value Initial value.
 * @return {!embedsl.UniformBool} Uniform expression.
 */
embedsl.uniformBool = function(name, value) {
  return new embedsl.UniformBool(name, value);
};

/**
 * Set this uniform to a value of type 'boolean'.
 *
 * @param {boolean} value A new value.
 */
embedsl.UniformBool.prototype.set = function(value) {
  /** @type {boolean} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'boolean'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformBool.prototype.apply = function(gl, loc) {
  gl.uniform1i(loc, /** @type {number} */(this.value));
};

/**
 * Create a new uniform object for type boolean within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {boolean=} value Initial value.
 * @return {!embedsl.UniformBool} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformBool = function(name, value) {
  var u = embedsl.uniformBool(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'bvec4'.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformBvec4 = function(name, value) {
  goog.base(this, embedsl.Type.Bvec4, name, value);
};
goog.inherits(embedsl.UniformBvec4, embedsl.Uniform);

/**
 * Create a new uniform object for type Array.<boolean>.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @return {!embedsl.UniformBvec4} Uniform expression.
 */
embedsl.uniformBvec4 = function(name, value) {
  return new embedsl.UniformBvec4(name, value);
};

/**
 * Set this uniform to a value of type 'Array.<boolean>'.
 *
 * @param {Array.<boolean>} value A new value.
 */
embedsl.UniformBvec4.prototype.set = function(value) {
  /** @type {Array.<boolean>} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'Array.<boolean>'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformBvec4.prototype.apply = function(gl, loc) {
  gl.uniform4iv(loc, /** @type {Array.<number>} */(this.value));
};

/**
 * Create a new uniform object for type Array.<boolean> within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {Array.<boolean>=} value Initial value.
 * @return {!embedsl.UniformBvec4} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformBvec4 = function(name, value) {
  var u = embedsl.uniformBvec4(name, value);
  this.uniforms_[name] = u;
  return u;
};

/**
 * Uniform class for type 'float'.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @constructor
 * @extends {embedsl.Uniform}
 */
embedsl.UniformFloat = function(name, value) {
  goog.base(this, embedsl.Type.Float, name, value);
};
goog.inherits(embedsl.UniformFloat, embedsl.Uniform);

/**
 * Create a new uniform object for type number.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformFloat} Uniform expression.
 */
embedsl.uniformFloat = function(name, value) {
  return new embedsl.UniformFloat(name, value);
};

/**
 * Set this uniform to a value of type 'number'.
 *
 * @param {number} value A new value.
 */
embedsl.UniformFloat.prototype.set = function(value) {
  /** @type {number} */
  this.value = value;
  this.version++;
};

/**
 * Apply this uniforms value to a location. 'number'.
 *
 * @param {!WebGLRenderingContext} gl WebGL rendering context.
 * @param {WebGLUniformLocation} loc Uniform location on the current shader.
 */
embedsl.UniformFloat.prototype.apply = function(gl, loc) {
  gl.uniform1f(loc, /** @type {number} */(this.value));
};

/**
 * Create a new uniform object for type number within
 * this uniform set.
 *
 * @param {string=} name Uniform name.
 * @param {number=} value Initial value.
 * @return {!embedsl.UniformFloat} Uniform expression.
 */
embedsl.UniformSet.prototype.uniformFloat = function(name, value) {
  var u = embedsl.uniformFloat(name, value);
  this.uniforms_[name] = u;
  return u;
};


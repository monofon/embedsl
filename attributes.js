// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file contains Attribute classes for all vaid OpenGL
 * attribute types.
 *
 * ATTENTION: Do not edit. This file has been generated from
 * gen/gen-attributes.rb by rakefile. Edit those files instead.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('embedsl.AttributeBool');
goog.provide('embedsl.AttributeBvec2');
goog.provide('embedsl.AttributeBvec3');
goog.provide('embedsl.AttributeBvec4');
goog.provide('embedsl.AttributeFloat');
goog.provide('embedsl.AttributeInt');
goog.provide('embedsl.AttributeIvec2');
goog.provide('embedsl.AttributeIvec3');
goog.provide('embedsl.AttributeIvec4');
goog.provide('embedsl.AttributeSet');
goog.provide('embedsl.AttributeVec2');
goog.provide('embedsl.AttributeVec3');
goog.provide('embedsl.AttributeVec4');

goog.require('embedsl.Attribute');
goog.require('goog.vec');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');

/**
 * A set of attributes that use unique indices.
 *
 * @constructor
 */
embedsl.AttributeSet = function() {
  this.index_ = 0;
  this.attributes_ = {};
};

/**
 * Attribute class for type 'vec3'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeVec3 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec3),
    name, index);
};
goog.inherits(embedsl.AttributeVec3, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeVec3} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeVec3 = function(name) {
  var a = new embedsl.AttributeVec3(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'ivec3'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeIvec3 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Ivec3),
    name, index);
};
goog.inherits(embedsl.AttributeIvec3, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeIvec3} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeIvec3 = function(name) {
  var a = new embedsl.AttributeIvec3(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'vec4'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeVec4 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec4),
    name, index);
};
goog.inherits(embedsl.AttributeVec4, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeVec4} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeVec4 = function(name) {
  var a = new embedsl.AttributeVec4(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'ivec4'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeIvec4 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Ivec4),
    name, index);
};
goog.inherits(embedsl.AttributeIvec4, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeIvec4} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeIvec4 = function(name) {
  var a = new embedsl.AttributeIvec4(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'bvec2'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeBvec2 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bvec2),
    name, index);
};
goog.inherits(embedsl.AttributeBvec2, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeBvec2} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeBvec2 = function(name) {
  var a = new embedsl.AttributeBvec2(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'int'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeInt = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Int),
    name, index);
};
goog.inherits(embedsl.AttributeInt, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeInt} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeInt = function(name) {
  var a = new embedsl.AttributeInt(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'bvec3'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeBvec3 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bvec3),
    name, index);
};
goog.inherits(embedsl.AttributeBvec3, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeBvec3} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeBvec3 = function(name) {
  var a = new embedsl.AttributeBvec3(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'bool'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeBool = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bool),
    name, index);
};
goog.inherits(embedsl.AttributeBool, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeBool} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeBool = function(name) {
  var a = new embedsl.AttributeBool(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'bvec4'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeBvec4 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Bvec4),
    name, index);
};
goog.inherits(embedsl.AttributeBvec4, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeBvec4} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeBvec4 = function(name) {
  var a = new embedsl.AttributeBvec4(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'vec2'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeVec2 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Vec2),
    name, index);
};
goog.inherits(embedsl.AttributeVec2, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeVec2} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeVec2 = function(name) {
  var a = new embedsl.AttributeVec2(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'ivec2'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeIvec2 = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Ivec2),
    name, index);
};
goog.inherits(embedsl.AttributeIvec2, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeIvec2} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeIvec2 = function(name) {
  var a = new embedsl.AttributeIvec2(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};

/**
 * Attribute class for type 'float'.
 *
 * @param {string=} name Name of the attribute. Used with
 * glBindAttribLocation().
 * @param {number=} index Generic vertex attribute index
 * this is bound to.
 * @constructor
 * @extends {embedsl.Attribute}
 */
embedsl.AttributeFloat = function(name, index) {
  goog.base(this,
    new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, embedsl.Type.Float),
    name, index);
};
goog.inherits(embedsl.AttributeFloat, embedsl.Attribute);

/**
 * Create a named attribute  bound to the next free index.
 *
 * @param {string=} name Attribute name.
 * @return {!embedsl.AttributeFloat} Newly created attribute.
 */
embedsl.AttributeSet.prototype.attributeFloat = function(name) {
  var a = new embedsl.AttributeFloat(name, this.index_++);
  this.attributes_[name] = a;
  return a;
};


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
 * @fileoverview Root of an expression tree.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('embedsl.Definition');
goog.provide('embedsl.DefinitionKind');

/**
 * @enum
 */
embedsl.DefinitionKind = {
  /**
   * A definition corresponding to a built in global variable like gl_Position.
   */
  BUILTIN: 0,

  /**
   * A definition corresponding to a global varying.
   */
  VARYING: 1,

  /**
   * A variable local to a shaders main() function..
   */
  LOCAL: 2,

  /**
   * A defintion of a looping construct. These are special, because they must
   * not be purged.
   */
  ACCUMULATE: 3
};

/**
 * Constructs a new definition. Definitions correspond to GSLS variables.
 *
 * @param {embedsl.DefinitionKind} kind Kind of definiton.
 * @param {string} stage Pipeline stage this definition lives in. Either
 * 'vertex' or 'fragment'.
 * @param {embedsl.Type} type The type of the definition.
 * @param {string} name Name of the definiton.
 * @param {!embedsl.Expression} exp Defining expression.
 * @constructor
 */
embedsl.Definition = function(kind, stage, type, name, exp) {
  /**
   * Kind of this defintion.
   * @type {embedsl.DefinitionKind}
   */
  this.kind = kind;

  /**
   * The stage this definition is located in.
   *
   * @type {string}
   */
  this.stage = stage;

  /**
   * The type of value this definition evaluates to.
   *
   * @type {embedsl.Type}
   */
  this.type = type;

  /**
   * Definitions are named.
   *
   * @type {string}
   */
  this.name = name;

  /**
   * The defining expression.
   *
   * @type {!embedsl.Expression}
   */
  this.exp = exp;

  /**
   * The GLSL code that is generated from the defining expression.
   *
   * @type {?string}
   */
  this.code = null;

  /**
   * Number of named references to this definition.
   *
   * @type {number}
   */
  this.refcount = 0;

  /**
   * A list of variables that are referenced from the defining
   * expression. Calculated during code generation.
   *
   * @type {Array.<string>}
   */
  this.referencedVariables = [];
};

/**
 * Definitions are reference counted with respect to embedsl.Reference. Increases
 * the reference count.
 */
embedsl.Definition.prototype.ref = function() {
  this.refcount += 1;
};

/**
 * Definitions are reference counted with respect to embedsl.Reference. Decreases
 * the reference count.
 */
embedsl.Definition.prototype.unref = function() {
  this.refcount -= 1;
};

/**
 * Copies the return type from the defining expression.
 */
embedsl.Definition.prototype.copyType = function() {
  if (!this.type)
    this.type = this.exp.type;
};

/**
 * Sets the defining expression.
 *
 * @param {!embedsl.Expression} exp The new expression.
 * @param {!embedsl.Type=} type The type.
 */
embedsl.Definition.prototype.setExpression = function(exp, type) {
  this.exp = exp;
  if (type)
    this.type = type;
  else
    this.copyType();
};

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
 * @fileoverview Describes the state that is passed between the
 * different compiler stages.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('embedsl.Ast');

goog.require('embedsl.Definition');
goog.require('goog.format.JsonPrettyPrinter');
goog.require('goog.json');


/**
 * @param {!Object.<string,!embedsl.Definition>} definitions Expression
 * definitions by name.
 * @param {!Object.<string,!embedsl.Expression>} marked Expressions marked
 * as local variables.
 * @param {!Object.<string,!embedsl.Attribute>=} attributes Attributes.
 * @param {!Object.<string,!embedsl.Uniform>=} uniforms Uniforms.
 * @constructor
 */
embedsl.Ast = function(definitions, marked, attributes, uniforms) {
  /** @type {!Object.<string,!embedsl.Definition>} */
  this.definitions = definitions;

  /** @type {!Object.<string,!embedsl.Expression>} */
  this.marked = marked;

  /** @type {!Object.<string,!embedsl.Definition>} */
  this.locals = {};

  /** @type {string} */
  this.vertexShader = '';

  /** @type {string} */
  this.fragmentShader = '';

  /** @type {Object.<string,!embedsl.Attribute>} */
  this.attributes = attributes || null;

  /** @type {Object.<string,!embedsl.Uniform>} */
  this.uniforms = uniforms || null;
 };

/**
 * Pretty-prints the definitions and local varibles in this ast
 * object to a string for debugging.
 *
 * @return {string} Pretty-printed state.
 */
embedsl.Ast.prototype.prettyPrint = function() {
  var pp = new goog.format.JsonPrettyPrinter(null);

  var out = '';
  for (var d in this.definitions) {
    var def = this.definitions[d];
    out += '-----' + def.name + '--------------------------------';
    out += pp.format(goog.json.serialize(def.exp));
  }
  for (var l in this.locals) {
    var def = this.locals[l];
    out += '-----' + def.name + '--------------------------------';
    out += pp.format(goog.json.serialize(def.exp));
  }
  return out;
};

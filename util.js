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
 * @fileoverview Utility functions, mainly for debugging.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('util');

goog.require('goog.dom');
goog.require('goog.format.JsonPrettyPrinter');
goog.require('goog.json');

/**
 * Print text into a newly created P element.
 *
 * @param {HTMLElement} elem Parent element.
 * @param {string} text Text to print.
 */
util.print = function(elem, text) {
    var p = document.createElement('p');
    p.textContent = text;
    elem.appendChild(p);
};

/**
 * Print text into a newly created P element. Append this to existing element
 * with id 'debug-output'.
 *
 * @param {string} text Text to print.
 */
util.debug = function(text) {
  util.print(document.getElementById('debug-output'), text);
};

/**
 * Throw as a function.
 *
 * @param {string} msg Message to throw.
 */
util.fthrow = function(msg) {
    throw msg;
};

/**
 * Pretty-print a object isn JSON.
 *
 * @param {Object} json Object to pretty-print.
 * @return {string} Pretty printed JSON.
 */
util.pp = function(json) {
    var pp = new goog.format.JsonPrettyPrinter(null);

    return pp.format(goog.json.serialize(json));
};

/**
 * Error wrapper for argument number mismatch in function calls.
 *
 * @param {string} name Function name.
 * @param {number} mn Minimal number of arguments.
 * @param {number} mx Maximum number of arguments.
 * @param {number} num Provided number of arguments.
 */
util.errorWrongNumArgs = function(name, mn, mx, num) {
  throw 'Wrong number of arguments: ' + name + ' needs [' + mn + ',' + mx +
      '] but was called with ' + num + ' arguments.';
};

/**
 * Merge the properties of two objects into a newly allocated object. Only
 * consider own properties.
 *
 * @param {Object} a First object.
 * @param {Object} b Second object.
 * @return {Object} Merged result.
 */
util.merge = function(a, b) {
  var c = {};
  for (var n in a)
    if (a.hasOwnProperty(n))
      c[n] = a[n];
  for (var n in b)
    if (b.hasOwnProperty(n))
      c[n] = b[n];
  return c;
};


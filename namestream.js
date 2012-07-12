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
 * @fileoverview Defines an identifier renaming facility.
 *
 */
goog.provide('embedsl.NameStream');
goog.provide('embedsl.GlobalNameStream');

goog.require('goog.array');

/**
 * A caching renamer that generates new names from an alphabeth of 52 symbols.
 *
 * @constructor
 */
embedsl.NameStream = function() {
  this.init_();
  this.count = 0;
  this.renamed = {};
};

/**
 * Rename an identifier. Each invokation for a particular name returns the same
 * result.
 *
 * @param {string} name Identifier to rename;.
 * @return {string} New name.
 */
embedsl.GlobalNameStream.rename = function(name) {
  return embedsl.GlobalNameStream.instance_.rename(name);
};

/**
 * Generate an identifier.
 *
 * @return {string} New identifier.
 */
embedsl.GlobalNameStream.create = function() {
  return embedsl.GlobalNameStream.instance_.create();
};

/**
 * Reset the global instance.
 */
embedsl.GlobalNameStream.reset = function() {
  embedsl.GlobalNameStream.instance_ = new embedsl.NameStream();
};

/**
 * @private
 */
embedsl.NameStream.prototype.init_ = function() {
  if (this.symbols)
    return;
  this.symbols = [];
  // [a-z].
  for (var i = 97; i <= 122; i++)
    this.symbols.push(String.fromCharCode(i));
  // [A-Z].
  for (var i = 65; i <= 90; i++)
    this.symbols.push(String.fromCharCode(i));
  goog.array.shuffle(this.symbols);
};

/**
 * @param {number} n Number to generate the id for.
 * @return {Array.<string>} The ID.
 * @private
 */
embedsl.NameStream.prototype.toID_ = function(n) {
  var r = n % this.symbols.length;
  if (r == n)
    return [this.symbols[r]];
  else
    return this.toID_(Math.floor(n / this.symbols.length)).
        concat([this.symbols[r]]);
};

/**
 * Rename an identifier. Each invokation for a particular name returns the same
 * result.
 *
 * @param {string} name Identifier to rename;.
 * @return {string} New name.
 */
embedsl.NameStream.prototype.rename = function(name) {
  return this.renamed[name] ||
      (this.renamed[name] = this.toID_(this.count++).join(''));
};

/**
 * Generate an identifier.
 *
 * @return {string} New identifier.
 */
embedsl.NameStream.prototype.create = function() {
  return this.toID_(this.count++).join('');
};

/**
 * @private
 */
embedsl.GlobalNameStream.instance_ = new embedsl.NameStream();


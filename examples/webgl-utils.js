/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */
goog.provide('WebGLUtils');

/**
 * Creates a webgl context.
 *
 * @param {!HTMLCanvasElement} canvas The canvas tag to get context from. If one
 *     is not passed in one will be created.
 * @param {Object=} opt_attribs Optinal attributes for context creation.
 * @return {!WebGLRenderingContext} The created context.
 */
WebGLUtils.setupWebGL = function(canvas, opt_attribs) {
  var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
  /** type {WebGLRenderingContext} */
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    context = (canvas.getContext(names[ii], opt_attribs));
    if (context)
      return /** @type {!WebGLRenderingContext} */ (context);
  }
  if (!context)
    throw 'Unable to create WebGL context.';
};

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window['requestAnimFrame'] =
    (function() {
       return window['requestAnimationFrame'] ||
           window['webkitRequestAnimationFrame'] ||
               window['mozRequestAnimationFrame'] ||
                   window['oRequestAnimationFrame'] ||
                       window['msRequestAnimationFrame'] ||
                           function(callback, element) {
                             window['setTimeout'](callback, 1000 / 60);
                           };
     })();


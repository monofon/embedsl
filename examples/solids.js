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
 * @fileoverview This file contains funcitons that generate vertex meshes that
 * are suitable for us in OpenGL vertex buffers. Generated vertex attributes are
 * position, vertex and texcoord.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */
goog.provide('scene.solids');

goog.require('goog.vec');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');
goog.require('scene.SolidAttributes');

/**
 * Generate triangles for a unit sphere from a tetrahedron. Returns an object
 * containing float arrays for position and normal data.
 *
 * @param {number} depth Number of triangle subdivisions to perform.
 * @return {!scene.SolidAttributes} Generated vertex data.
 */
scene.solids.makeSphere = function(depth) {
  var Vec3 = goog.vec.Vec3;

  var p0 = Vec3.normalize([-1, 1, 1], [0, 0, 0]);
  var p1 = Vec3.normalize([1, 1, -1], [0, 0, 0]);
  var p2 = Vec3.normalize([-1, -1, -1], [0, 0, 0]);
  var p3 = Vec3.normalize([1, -1, 1], [0, 0, 0]);
  var t0 = [0.01, 0.99];
  var t1 = [0.99, 0.99];
  var t2 = [0.5, 1 - Math.sqrt(1.5) / 2.0];

  function mid(v0, v1) {
    var sum = Vec3.add(v0, v1, [0, 0, 0]);
    return Vec3.scale(sum, 0.5, sum);
  };

  function mid2(v0, v1) {
    return [(v0[0] + v1[0]) / 2.0, (v0[1] + v1[1]) / 2.0];
  };

  var positions = [];
  var texcoords = [];

  function tri(v0, v1, v2, t0, t1, t2, d) {
    if (d == 0) {
      function append(a0, a1) {
        for (var i in a1)
          a0.push(a1[i]);
      }

      append(positions, v0);
      append(positions, v1);
      append(positions, v2);
      append(texcoords, t0);
      append(texcoords, t1);
      append(texcoords, t2);
    } else {
      var v01 = Vec3.normalize(mid(v0, v1), [0, 0, 0]);
      var v12 = Vec3.normalize(mid(v1, v2), [0, 0, 0]);
      var v20 = Vec3.normalize(mid(v2, v0), [0, 0, 0]);
      var t01 = mid2(t0, t1);
      var t12 = mid2(t1, t2);
      var t20 = mid2(t2, t0);
      tri(v0, v01, v20, t0, t01, t20, d - 1);
      tri(v01, v1, v12, t01, t1, t12, d - 1);
      tri(v20, v12, v2, t20, t12, t2, d - 1);
      tri(v01, v12, v20, t01, t12, t20, d - 1);
    }
  };

  function sphere() {
    tri(p2, p3, p0, t0, t1, t2, depth);
    tri(p3, p1, p0, t0, t1, t2, depth);
    tri(p1, p2, p0, t0, t1, t2, depth);
    tri(p3, p2, p1, t0, t1, t2, depth);
  };

  sphere();

  var as = {};
  as['position'] = positions;
  as['normal'] = positions;
  as['texcoord'] = texcoords;
  return /** @type {scene.SolidAttributes} */ (as);
};

/**
 * Remap texture coordinates to a spherical UV domain.
 *
 * @param {!scene.SolidAttributes} sphere Vertex data.
 * @return {!scene.SolidAttributes} Remaped vertex data.
 */
scene.solids.mapThetaPhi = function(sphere) {
  var count = sphere.position.length / 3;
  for (var p = 0; p != count; p++) {
    sphere['texcoord'][2 * p + 0] =
        Math.atan2(sphere['position'][3 * p + 1],
                   sphere['position'][3 * p + 0]) / (2 * Math.PI);
    sphere['texcoord'][2 * p + 1] =
        Math.asin(sphere['position'][3 * p + 2]) / Math.PI + 0.5;
  }
  return sphere;
};

/**
 * Generate a mesh for a unit cube. Can be inverted for skybox construction.
 *
 * @param {boolean=} invert Negate position coordinates if true.
 * @return {!scene.SolidAttributes} Generated vertex data.
 */
scene.solids.makeCube = function(invert) {
  var Vec3 = goog.vec.Vec3;

  var p000 = [-1, -1, -1];
  var p100 = [1, -1, -1];
  var p110 = [1, 1, -1];
  var p010 = [-1, 1, -1];
  var p001 = [-1, -1, 1];
  var p101 = [1, -1, 1];
  var p111 = [1, 1, 1];
  var p011 = [-1, 1, 1];

  var n0__ = [-1, 0, 0];
  var n1__ = [1, 0, 0];
  var n_0_ = [0, -1, 0];
  var n_1_ = [0, 1, 0];
  var n__0 = [0, 0, -1];
  var n__1 = [0, 0, 1];

  var t00 = [0.01, 0.01];
  var t10 = [0.99, 0.01];
  var t11 = [0.99, 0.99];
  var t01 = [0.01, 0.99];
  var positions = [];
  var texcoords = [];
  var normals = [];

  function quad(v0, v1, v2, v3, t0, t1, t2, t3, n) {
    function append(a0, a1) {
      for (var i in a1)
        a0.push(a1[i]);
    }
    append(positions, v0);
    append(positions, v1);
    append(positions, v2);
    append(positions, v2);
    append(positions, v3);
    append(positions, v0);
    append(texcoords, t0);
    append(texcoords, t1);
    append(texcoords, t2);
    append(texcoords, t2);
    append(texcoords, t3);
    append(texcoords, t0);
    append(normals, n);
    append(normals, n);
    append(normals, n);
    append(normals, n);
    append(normals, n);
    append(normals, n);
  }

  quad(p001, p101, p111, p011, t00, t10, t11, t01, n__0);
  quad(p000, p010, p110, p100, t00, t01, t11, t10, n__1);
  quad(p000, p100, p101, p001, t00, t10, t11, t01, n_0_);
  quad(p010, p011, p111, p110, t00, t01, t11, t10, n_1_);
  quad(p100, p110, p111, p101, t00, t10, t11, t01, n0__);
  quad(p000, p001, p011, p010, t00, t01, t11, t10, n1__);

  if (invert)
    for (var i = 0; i != positions.length; i++)
      positions[i] = -positions[i];

  var as = {};
  as['position'] = positions;
  as['normal'] = normals;
  as['texcoord'] = texcoords;
  return /** @type {scene.SolidAttributes} */ (as);
};

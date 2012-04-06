/**
 * Copyright 2011 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author tramberend@google.com (Henrik Tramberend)
 */

function EmbedslPlumberTest() {
}

registerTestSuite(EmbedslPlumberTest);

EmbedslPlumberTest.prototype.plumbsInterpolators = function() {
  // Trap debugging output.
  console = { log: function() {} };

  var s = embedsl.lang;

  var one = s.normalize(s.perVertex(s.vec3(1, 1, 1)));

  var ast = new embedsl.Ast(
      {
        'tree': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                   'fragment', 'vec3', 'tree', one)
      }, null);

  var inferrer = new embedsl.Inferrer();
  ast = inferrer.transformAst(ast);

  var plumber = new embedsl.Plumber();
  ast = plumber.transformAst(ast);

  expectThat(ast.definitions['tree'].exp, not(isNull));
  expectThat(ast.varyings['v0'], not(equals(undefined)));
  expectEq(ast.varyings['v0'].type, embedsl.Type.Vec3);
};

EmbedslPlumberTest.prototype.plumbsAttributes = function() {
  // Trap debugging output.
  console = { log: function() {} };

  var s = embedsl.lang;

  var one = new embedsl.AttributeVec4('attr');

  var ast = new embedsl.Ast(
      {
        'tree': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                   'fragment', null, 'tree', one)
      }, null);

  var inferrer = new embedsl.Inferrer();
  ast = inferrer.transformAst(ast);

  var plumber = new embedsl.Plumber();
  ast = plumber.transformAst(ast);

  expectThat(ast.definitions['tree'].exp, not(isNull));
  expectThat(ast.varyings['v0'], not(equals(undefined)));
  expectEq(ast.varyings['v0'].type, embedsl.Type.Vec4);
};

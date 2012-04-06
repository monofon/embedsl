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

function EmbedslLocalizerTest() {
}

registerTestSuite(EmbedslLocalizerTest);

EmbedslLocalizerTest.prototype.findsOneLocal = function() {
  var s = embedsl.lang;

  var one = 1;
  var two = s.add(one, one);

  var marked = { 'one': one };

  var ast = new embedsl.Ast(
      {
        'tree': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                   'vertex', null, 'tree', two)
      }, marked);

  var localzr = new embedsl.Localizer();
  ast = localzr.transformAst(ast);

  expectThat(ast.locals['one'], not(isNull));
};


EmbedslLocalizerTest.prototype.findsTwoLocals = function() {
  // Trap debugging output.
  console = { log: function() {} };

  var s = embedsl.lang;

  var one = s.f(1);
  var two = s.add(one, one);
  var three = s.add(one, two);

  var marked = {
    'one': one,
    'two': two
  };

  var ast = new embedsl.Ast(
      {
        'tree': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                   'vertex', null, 'tree', three)
      }, marked);

  var localzr = new embedsl.Localizer();
  var inferrer = new embedsl.Inferrer();

  ast = inferrer.transformAst(ast);
  ast = localzr.transformAst(ast);

  expectThat(ast.locals['one'], not(isNull));
  expectThat(ast.locals['two'], not(isNull));
  expectEq(ast.locals['one'].refcount, 3);
  expectEq(ast.locals['two'].refcount, 1);
};

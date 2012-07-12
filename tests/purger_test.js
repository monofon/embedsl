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
 */

function EmbedslPurgerTest() {
}

registerTestSuite(EmbedslPurgerTest);

EmbedslPurgerTest.prototype.purgesOneLocal = function() {
  // Trap debugging output.
  console = { log: function() {} };

  var s = embedsl.lang;

  var one = s.f(1);
  var two = s.add(one, 1);
  var three = s.add(two, two);

  var marked = {
    'one': one,
    'two': two
  };

  var ast = new embedsl.Ast(
      {
        'tree': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                   'vertex', null, 'tree', three)
      }, marked);

  var inferrer = new embedsl.Inferrer();
  var localzr = new embedsl.Localizer();

  ast = inferrer.transformAst(ast);
  ast = localzr.transformAst(ast);

  expectThat(ast.locals['one'], not(isNull));
  expectThat(ast.locals['two'], not(isNull));
  expectEq(ast.locals['one'].refcount, 1);
  expectEq(ast.locals['two'].refcount, 2);

  var purger = new embedsl.Purger();
  ast = purger.transformAst(ast);

  expectThat(ast.locals['one'], equals(undefined));
  expectThat(ast.locals['two'], not(isNull));
};

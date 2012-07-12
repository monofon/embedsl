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

function EmbedslLanguageTest() {
}

registerTestSuite(EmbedslLanguageTest);

EmbedslLanguageTest.prototype.constructsAddExpression = function() {
  var add = embedsl.lang.add(1, 1);

  expectEq('+', add.info);
  expectEq(embedsl.Kind.OPERATOR, add.kind);
  expectEq(2, add.args.length);
};

EmbedslLanguageTest.prototype.constructsSelectExpression = function() {
  var select =
      embedsl.lang.select(false, embedsl.lang.vec3(1, 1, 1), embedsl.lang.vec3(0, 0, 0));

  expectEq('select', select.name);
  expectEq(embedsl.Kind.BUILTIN, select.kind);
  expectEq(3, select.args.length);
  expectEq('vec3', select.args[1].name);
  expectEq('vec3', select.args[2].name);
};

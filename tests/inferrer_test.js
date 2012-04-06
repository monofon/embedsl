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

function EmbedslInferrerTest() {
}

registerTestSuite(EmbedslInferrerTest);

EmbedslInferrerTest.prototype.inferesStaticTypes = function() {
  var cos = embedsl.lang.dot([1, 0, 0], [0, 1, 0]);

  var inferrer = new embedsl.Inferrer();
  cos = inferrer.transformExpression(cos);

  expectEq(embedsl.Type.Float, cos.type);
  expectEq(embedsl.Type.Vec3, cos.args[0].type);
  expectEq(embedsl.Type.Vec3, cos.args[1].type);
};

EmbedslInferrerTest.prototype.inferesSameAsArg0Types = function() {
  var min = embedsl.lang.min(0, 1);
  var minv = embedsl.lang.min([1, 0, 0], [0, 1, 0]);

  var inferrer = new embedsl.Inferrer();
  min = inferrer.transformExpression(min);

  expectEq(embedsl.Type.Float, min.type);
  expectEq(embedsl.Type.Float, min.args[0].type);
  expectEq(embedsl.Type.Float, min.args[1].type);

  minv = inferrer.transformExpression(minv);

  expectEq(embedsl.Type.Vec3, minv.type);
  expectEq(embedsl.Type.Vec3, minv.args[0].type);
  expectEq(embedsl.Type.Vec3, minv.args[1].type);
};

EmbedslInferrerTest.prototype.inferesSameMaxArgTypes = function() {
  var sum0 = embedsl.lang.add(0, 1);
  var sum1 = embedsl.lang.add([1, 0, 0], 1);
  var sum2 = embedsl.lang.add(1, [1, 0, 0]);
  var sum3 = embedsl.lang.add([1, 0, 0], [0, 1, 0]);

  var mul0 = embedsl.lang.mul(embedsl.lang.mat3(0), [1, 0, 0]);
  var mul1 = embedsl.lang.mul([1, 0, 0, 0], embedsl.lang.mat4(0));
  var mul2 = embedsl.lang.mul(1, 1);

  var inferrer = new embedsl.Inferrer();

  expectEq(embedsl.Type.Float,
           inferrer.transformExpression(sum0).type);
  expectEq(embedsl.Type.Vec3,
           inferrer.transformExpression(sum1).type);
  expectEq(embedsl.Type.Vec3,
           inferrer.transformExpression(sum2).type);
  expectEq(embedsl.Type.Vec3,
           inferrer.transformExpression(sum3).type);

  expectEq(embedsl.Type.Vec3,
           inferrer.transformExpression(mul0).type);
  expectEq(embedsl.Type.Vec4,
           inferrer.transformExpression(mul1).type);
  expectEq(embedsl.Type.Float,
           inferrer.transformExpression(mul2).type);
};

EmbedslInferrerTest.prototype.setsInferredType = function() {
  var mul0 = embedsl.lang.mul(embedsl.lang.mat3(0), [1, 0, 0]);
  var mul1 = embedsl.lang.mul([1, 0, 0, 0], embedsl.lang.mat4(0));
  var mul2 = embedsl.lang.mul(1, 1);

  var ast = new embedsl.Ast(
      {
        'mul0': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                       'vertex', null, 'mul0', mul0),
        'mul1': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                       'vertex', null, 'mul1', mul1),
        'mul2': new embedsl.Definition(embedsl.Definition.BUILTIN,
                                       'vertex', null, 'mul1', mul2)
      }, null);

  expectEq(embedsl.TypeDependency.MULTIPLICATION,
           ast.definitions['mul0'].exp.typeInfo.dependency_);
  expectEq(embedsl.TypeDependency.MULTIPLICATION,
           ast.definitions['mul1'].exp.typeInfo.dependency_);
  expectEq(embedsl.TypeDependency.MULTIPLICATION,
           ast.definitions['mul1'].exp.typeInfo.dependency_);

  var inferrer = new embedsl.Inferrer();
  ast = inferrer.transformAst(ast);

  expectEq(embedsl.Type.Vec3, ast.definitions['mul0'].type);
  expectEq(embedsl.Type.Vec4, ast.definitions['mul1'].type);
  expectEq(embedsl.Type.Float, ast.definitions['mul2'].type);
};

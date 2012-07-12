# Copyright 2011 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Generate factory functions for the most useful GLSL operator.
#
# Capture all function signature information from the standard. Types
# specification follows the conventions used on the WebGL Reference Card.
#
#
require 'gen/type'
include Type

$operator_info = {}

def oi(factory_name, symbol, typeInfo)
  $operator_info[factory_name] = {
    :symbol => symbol,
    :typeInfo => typeInfo
  }
end

# [n.n] refers to section n.n of the OpenGL ES 1.0 specification.

# Operators [5.1.3]
oi('plus', '+', ti($sameasargs, nil, [ pl([ $num1234 ], []) ] ))
oi('minus', '-', ti($sameasargs, nil, [ pl([ $num1234 ], []) ] ))
oi('negate', '!', ti($constant, $bool, [ pl([ $bool ], []) ] ))

# Operators [5.1.4]
oi('mul', '*', ti($multiplication, nil, [ pl([ $numn, $numn ], [ $matvecsamedimension ], true) ] ))
oi('div', '/', ti($sameasmaxarg, nil, [ pl([ $numn, $numn ], [ $sameorscalar ], true) ] ))

# Operators [5.1.5]
oi('add', '+', ti($sameasmaxarg, nil, [ pl([ $numn, $numn ], [ $sameorscalar ], true) ] ))
oi('sub', '-', ti($sameasmaxarg, nil, [ pl([ $numn, $numn ], [ $sameorscalar ], true) ] ))

# Operators [5.1.7]
oi('lt', '<', ti($constant, $bool, [ pl([ $num, $num ], [ $sametype ]) ] ))
oi('gt', '>', ti($constant, $bool, [ pl([ $num, $num ], [ $sametype ]) ] ))
oi('lte', '<=', ti($constant, $bool, [ pl([ $num, $num ], [ $sametype ]) ] ))
oi('gte', '>=', ti($constant, $bool, [ pl([ $num, $num ], [ $sametype ]) ] ))

# Operators [5.1.8]
oi('eq', '==', ti($constant, $bool, [ pl([ $numn, $numn ], [ $sametype ] ) ] ))
oi('neq', '!=', ti($constant, $bool, [ pl([ $numn, $numn ], [ $sametype ] ) ] ))

# Operators [5.1.12]
oi('and', '&&', ti($constant, $bool, [ pl([ $bool, $bool ], [], true) ] ) )

# Operators [5.1.13]
oi('xor', '^^', ti($constant, $bool, [ pl([ $bool , $bool ], [] ) ] ))

# Operators [5.1.14]
oi('or', '||', ti($constant, $bool, [ pl([ $bool , $bool ], [], true) ] ))

# Operators [5.1.15] implemented as function select() in lang-proto.js.

#
# Generate one factory function.
#
def generate(name, symbol, typeInfo)
  ptl = typeInfo.parameterLists[0]
  return <<EOF

/**
 * Create expression for GLSL operator '#{symbol}'.
 *
#{ptl.toClosureAnnotation}
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.#{name} = (function() {
  var cached = #{typeInfo.toEsl};
  return function(#{ptl.toParameterList}) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
      embedsl.Kind.OPERATOR, cached, '#{name}', '#{symbol}', args);
  };
})();
EOF
end

$operator_info.each_pair do |name, info|
  puts generate(name, info[:symbol], info[:typeInfo])
end

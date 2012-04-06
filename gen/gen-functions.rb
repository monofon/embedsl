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

# Generate factory functions for the most useful GLSL functions.
#
# Capture all function signature information from the standard. Types
# specification follows the conventions used on the WebGL Reference
# Card.
#
# author: tramberend@google.com (Henrik Tramberend)
#
require 'gen/type'
include Type

$function_info = {}

def fi(factory_name, glsl, typeInfo)
  $function_info[factory_name] = {
    :glsl => glsl,
    :typeInfo => typeInfo,
  }
end

# [n.n] refers to section n.n of the OpenGL ES 1.0 specification.

# Angle & Trigonometry Functions [8.1]
fi('radians', 'radians', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('degrees', 'degrees', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('sin', 'sin', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('cos', 'cos', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('tan', 'tan', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('asin', 'asin', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ) )
fi('acos', 'acos', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('atan', 'atan', ti($sameasargs, nil,
                      [ pl( [ $float1234 ] ),
                        pl( [ $float1234, $float1234 ], [$sametype] ) ] ))

# # Exponential Functions [8.2]
fi('pow', 'pow', ti($sameasargs, nil, [ pl( [ $float1234, $float1234 ], [$sametype] ) ] ))
fi('exp', 'exp', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('log', 'log', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('exp2', 'exp2', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('log2', 'log2', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('sqrt', 'sqrt', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('inversesqrt', 'inversesqrt', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))

# # Common functions [8.3]
fi('abs', 'abs', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('sign', 'sign', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('floor', 'floor', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('ceil', 'ceil', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('fract', 'fract', ti($sameasargs, nil, [ pl( [ $float1234 ] ) ] ))
fi('mod', 'mod',
   ti($sameasarg0, nil,
      [ pl( [ $float1234, $float1234 ], [$sametype] ),
        pl( [ $float1234, $float ]) ] ))
fi('min', 'min',
   ti($sameasarg0, nil,
      [ pl( [ $float1234, $float1234 ], [$sametype] ),
        pl( [ $float1234, $float ]) ] ))
fi('max', 'max',
   ti($sameasarg0, nil,
      [ pl( [ $float1234, $float1234 ], [$sametype] ),
        pl( [ $float1234, $float ]) ] ))
fi('clamp', 'clamp',
   ti($sameasarg0, nil,
      [ pl( [ $float1234, $float1234, $float1234 ], [$sametype] ),
        pl( [ $float1234, $float, $float ]) ] ))

fi('mix', 'mix',
   ti($sameasarg0, nil,
      [ pl( [ $float1234, $float1234, $float1234 ], [$sametype] ),
        pl( [ $float1234, $float1234, $float ]) ] ))

fi('step', 'step',
   ti($sameasarg1, nil,
      [ pl( [ $float1234, $float1234 ], [$sametype] ),
        pl( [ $float, $float1234 ]) ] ))

fi('smoothstep', 'smoothstep',
   ti($sameasarg2, nil,
      [ pl( [ $float1234, $float1234, $float1234 ], [$sametype] ),
        pl( [ $float, $float, $float1234 ]) ] ))

# Geometric Functions [8.4]
fi('length', 'length',
   ti($constant, $float, [ pl( [ $float234 ] ) ] ))
fi('distance', 'distance',
   ti($constant, $float, [ pl( [ $float234, $float234 ], [$sametype] ) ] ))
fi('dot', 'dot',
   ti($constant, $float, [ pl( [ $float234, $float234 ], [$sametype] ) ] ))
fi('cross', 'cross',
   ti($constant, $vec3, [ pl( [ $vec3, $vec3 ], [$sametype] ) ] ))
fi('normalize', 'normalize',
   ti($sameasargs, nil, [ pl( [ $float234 ] ) ] ))
fi('faceforward', 'faceforward',
   ti($sameasargs, nil, [ pl( [ $float234, $float234, $float234 ], [$sametype] ) ] ))
fi('reflect', 'reflect',
   ti($sameasargs, nil, [ pl( [ $float234, $float234 ], [$sametype] ) ] ))
fi('refract', 'refract',
   ti($sameasarg0, nil, [ pl( [ $float234, $float234, $float ] ) ] ))

# Matrix Functions [8.5]
fi('matrixCompMult', 'matrixCompMult',
   ti($sameasarg0, nil, [ pl( [ $mat234, $mat234 ], [$sametype] ) ] ))

# Vector Relational Functions [8.6]
fi('lessThan', 'lessThan',
   ti($bvecsizeofargs, nil, [ pl( [ $num234, $num234 ], [$sametype] ) ] ))
fi('lessEqualThan', 'lessEqualThan',
   ti($bvecsizeofargs, nil, [ pl( [ $num234, $num234 ], [$sametype] ) ] ))
fi('greaterThan', 'greaterThan',
   ti($bvecsizeofargs, nil, [ pl( [ $num234, $num234 ], [$sametype] ) ] ))
fi('greaterThanEqual', 'greaterThanEqual',
   ti($bvecsizeofargs, nil, [ pl( [ $num234, $num234 ], [$sametype] ) ] ))
fi('equal', 'equal',
   ti($bvecsizeofargs, nil, [ pl( [ $vec234, $vec234 ], [$sametype] ) ] ))
fi('notEqual', 'notEqual',
   ti($bvecsizeofargs, nil, [ pl( [ $vec234, $vec234 ], [$sametype] ) ] ))
fi('lessThan', 'lessThan',
   ti($bvecsizeofargs, nil, [ pl( [ $num234, $num234 ], [$sametype] ) ] ))
fi('any', 'any',
   ti($constant, $bool, [ pl( [ $bool234, $bool234 ], [$sametype] ) ] ))
fi('all', 'all',
   ti($constant, $bool, [ pl( [ $bool234, $bool234 ], [$sametype] ) ] ))
fi('not', 'not',
   ti($bvecsizeofargs, nil, [ pl( [ $bool234, $bool234 ], [$sametype] ) ] ))

# # Texture Lookup Functions [8.7]
fi('texture2DLod', 'texture2DLod',
   ti($constant, $vec4, [ pl( [ $sampler2d, $vec2, $float ] ) ] ))
fi('texture2DProjLod', 'texture2DProjLod',
   ti($constant, $vec4, [ pl( [ $sampler2d, $float34, $float ] ) ] ))
fi('textureCubeLod', 'textureCubeLod',
   ti($constant, $vec4, [ pl( [ $samplercube, $vec3, $float ] ) ] ))
fi('texture2D', 'texture2D',
   ti($constant, $vec4,
      [ pl( [ $sampler2d, $vec2, $float ] ),
        pl( [ $sampler2d, $vec2 ] ) ] ))
fi('texture2DProj', 'texture2DProj',
   ti($constant, $vec4,
      [ pl( [ $sampler2d, $float34, $float ] ),
        pl( [ $sampler2d, $float34 ] ) ] ))
fi('textureCube', 'textureCube',
   ti($constant, $vec4,
      [ pl( [ $samplercube, $vec3, $float ] ),
        pl( [ $samplercube, $vec3 ] ) ] ))

# Constructors
fi('f', 'float',
   ti($constant, $float, [ pl( [ $scalar ] ) ] ))
fi('i', 'int',
   ti($constant, $int, [ pl( [ $scalar ] ) ] ))
fi('b', 'bool',
   ti($constant, $bool, [ pl( [ $scalar ] ) ] ))
fi('vec2', 'vec2',
   ti($constant, $vec2, [ pl( [ $scalar ] ),
                          pl( [ $float, $float ] ) ] ))
fi('vec3', 'vec3',
   ti($constant, $vec3, [ pl( [ $scalar ] ),
                          pl( [ $num1234, $num1234 ] ),
                          pl( [ $num, $num, $num ], [$sametype] ) ] ))
fi('vec4', 'vec4',
   ti($constant, $vec4, [ pl( [ $scalar ] ),
                          pl( [ $num1234, $num1234 ] ),
                          pl( [ $num1234, $num1234, $num1234 ] ),
                          pl( [ $num, $num, $num, $num ], [$sametype] ) ] ))
fi('mat2', 'mat2',
   ti($constant, $mat2, [ pl( [ $scalar ] ),
                          pl( [ $num2, $num2 ], [$sametype] ),
                          pl( [ $num, $num, $num, $num ], [$sametype] ) ] ))
fi('mat3', 'mat3',
   ti($constant, $mat3, [ pl( [ $scalar ] ),
                          pl( [ $num3, $num3, $num3 ], [$sametype] ),
                          pl( [ $num, $num, $num, $num, $num, $num, $num, $num, $num ], [$sametype] ) ] ))
fi('mat4', 'mat4',
   ti($constant, $mat4, [ pl( [ $scalar ] ),
                          pl( [ $num4, $num4, $num4, $num4 ], [$sametype] ),
                          pl( [ $num, $num, $num, $num, $num, $num, $num, $num,
                                $num, $num, $num, $num, $num, $num, $num, $num ], [$sametype] ) ] ))

#
# Generate one factory function.
#
def generate(name, glsl, typeInfo)
  # Merge type information for all argument lists a function might
  # have.
  minParam, paramTypes = mergeParameterLists(typeInfo.parameterLists)

  # Assemble type annotations for the closure compile.
  paramtypestr = []
  paramstr = []
  (0...minParam).each do |i|
    paramtypestr << " * @param {!(#{paramTypes[i].toClosure})} arg#{i}\n * Function argument #{i}."
    paramstr << "arg#{i}"
  end
  (minParam...paramTypes.size).each do |i|
    paramtypestr << " * @param {!(#{paramTypes[i].toClosure})=} arg#{i}\n * Function argument #{i}."
    paramstr << "arg#{i}"
  end
  annotations = paramtypestr.join("\n")

  return <<EOF

/**
 * Create expression for GLSL function '#{glsl}'.
 *
#{annotations}
 * @return {!embedsl.Expression} Created expression.
 */
embedsl.lang.#{name} = (function() {
  var cached = #{typeInfo.toEsl};
  return function(#{paramstr.join(",\n    ")}) {
    var args = Array.prototype.slice.call(arguments);
    return new embedsl.Expression(
        embedsl.Kind.BUILTIN, cached, '#{name}', '#{glsl}', args);
  };
})();
EOF
end

$function_info.each_pair do |name, info|
  puts generate(name, info[:glsl], info[:typeInfo])
end

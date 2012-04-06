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
#
require "set"

module Type

  class ConcreteType
    attr_reader :base, :dimension, :size, :closure

    def initialize(base, dimension, size, closure)
      @base = base
      @dimension = dimension
      @size = size
      @closure = closure
    end

    def toClosure
      @closure
    end

    def glslScalarName
      name = @base.to_s
      if @dimension[0] > 1
        name = "mat#{@dimension[0]}"
      elsif @dimension[1] > 1
        case @base
        when :float:
            name = "vec#{@dimension[1]}"
        when :int:
            name = "ivec#{@dimension[1]}"
        when :bool:
            name = "bvec#{@dimension[1]}"
        end
      end
      name
    end

    def glslTypeName
      name = self.glslScalarName
      @size > 1 ? "#{name}[#{@size}]": name
    end

    def eslTypeNameFragment
      name = self.glslScalarName.captialize
      @size > 1 ? "#{name}Array#{@size}": name
    end

    def toEsl
      if @size == 1
        "embedsl.Type.#{self.glslScalarName.capitalize}"
      else
        "embedsl.Type.#{self.glslScalarName.capitalize}.array(#{@size})"
      end
    end
  end

  class TypeUnion < Set

    def initialze(types)
      super(types)
    end

    def toClosure
      "embedsl.Expression|" + self.map {|e| e.toClosure.to_s}.uniq.join("|")
    end

    def toEsl
      tl = self.map {|e| e.toEsl}.join(", ")
      "new embedsl.TypeUnion(#{tl})"
    end
  end

  class ParameterTypeList
    attr_reader :types, :constraints

    def initialize(types, constraints, varargs)
      @types = types
      @constraints = constraints
      @varargs = varargs
    end

    def toClosureAnnotation
      argtypestr = []
      (0...types.size).each do |i|
        argtypestr << " * @param {!(#{types[i].toClosure})} arg#{i}\n * Operator argument #{i}."
      end
      if @varargs
        argtypestr << " * @param {...!(#{types[types.size-1].toClosure})} argn\n * Operator arguments."
      end
      argtypestr.join("\n")
    end

    def toParameterList
      argstr = []
      (0...types.size).each do |i|
        argstr << "arg#{i}"
      end
      if @varargs
        argstr << "argn"
      end
      argstr.join(", ")
    end

    def toEsl
      ptl = @types.map {|t| t.toEsl}.join(', ')
      cts = @constraints.map {|c| "embedsl.TypeConstraint.#{c}"}.join(', ')
      var = @varargs ? "true" : "false"
      "new embedsl.ParameterTypeList([#{ptl}], [#{cts}], #{var})"
    end
  end

  def pl(t, c=[], v=false)
    ts = t.map{|t| (t.instance_of?(ConcreteType) ? TypeUnion.new([t]) : t) }
    ParameterTypeList.new(ts, c, v)
  end

  def mergeParameterLists(pls)
    mn = 1000
    mx = 0
    pls.each do |pl|
      mn = [pl.types.size, mn].min
      mx = [pl.types.size, mx].max
    end
    types = []
    (0...mx).each do |i|
      types[i] ||= TypeUnion.new
      pls.each do |pl|
        types[i].merge(pl.types[i]) if pl.types[i]
      end
    end
    return mn, types
  end

  class TypeInfo
    attr_reader :dependency, :returnType, :parameterLists

    def initialize(d, r, p)
      @dependency = d
      @returnType = r
      @parameterLists = p
    end

    def toEsl
      dep = @dependency
      ret = @returnType ? @returnType.toEsl : 'null'
      par = @parameterLists.map {|p| p.toEsl}.join(', ')
      "new embedsl.TypeInfo(embedsl.TypeDependency.#{dep}, #{ret}, [#{par}])"
    end
  end

  def ti(d, r, p)
    TypeInfo.new(d, r, p)
  end

  # Concrete types.
  $float = ConcreteType.new(:float, [1, 1], 1, "number")
  $vec2 = ConcreteType.new(:float, [1, 2], 1, "Array.<number>")
  $vec3 = ConcreteType.new(:float, [1, 3], 1, "goog.vec.Vec3.AnyType")
  $vec4 = ConcreteType.new(:float, [1, 4], 1, "goog.vec.Vec4.AnyType")
  $int = ConcreteType.new(:int, [1, 1], 1, "number")
  $ivec2 = ConcreteType.new(:int, [1, 2], 1, "Array.<number>")
  $ivec3 = ConcreteType.new(:int, [1, 3], 1, "goog.vec.Vec3.AnyType")
  $ivec4 = ConcreteType.new(:int, [1, 4], 1, "goog.vec.Vec4.AnyType")
  $bool = ConcreteType.new(:bool, [1, 1], 1, "boolean")
  $bvec2 = ConcreteType.new(:bool, [1, 2], 1, "Array.<boolean>")
  $bvec3 = ConcreteType.new(:bool, [1, 3], 1, "Array.<boolean>")
  $bvec4 = ConcreteType.new(:bool, [1, 4], 1, "Array.<boolean>")
  $mat2 = ConcreteType.new(:float, [1, 2], 1, "goog.vec.AnyType")
  $mat3 = ConcreteType.new(:float, [3, 3], 1, "goog.vec.Mat3.AnyType")
  $mat4 = ConcreteType.new(:float, [4, 4], 1, "goog.vec.Mat4.AnyType")
  $sampler2d = ConcreteType.new(:sampler2D, [1, 1], 1, "number")
  $samplercube = ConcreteType.new(:samplerCube, [1, 1], 1, "number")

  $concrete = Set.new [ $float, $vec2, $vec3, $vec4, $int, $ivec2, $ivec3, $ivec4, $bool,
                       $bvec2, $bvec3, $bvec4, $mat2, $mat3, $mat4, $sampler2d,
                       $samplercube ]

  # abstract argument types
  $num = TypeUnion.new [ $float, $int ]
  $scalar = TypeUnion.new [ $float, $int, $bool ]

  $float1234 = TypeUnion.new [ $float, $vec2, $vec3, $vec4 ]
  $int1234 = TypeUnion.new [ $int, $ivec2, $ivec3, $ivec4 ]
  $bool1234 = TypeUnion.new [ $bool, $bvec2, $bvec3, $bvec4 ]

  $num1234 = $float1234 | $int1234

  $float234 = TypeUnion.new [ $vec2, $vec3, $vec4 ]
  $int234 = TypeUnion.new [ $ivec2, $ivec3, $ivec4 ]
  $bool234 = TypeUnion.new [ $bvec2, $bvec3, $bvec4 ]

  $float34 = TypeUnion.new [ $vec3, $vec4 ]

  $num2 = TypeUnion.new [ $vec2, $ivec2 ]
  $num3 = TypeUnion.new [ $vec3, $ivec3 ]
  $num4 = TypeUnion.new [ $vec4, $ivec4 ]

  $num234 = $float234 | $int234
  $vec234 = $float234 | $int234 | $bool234

  $mat234 = TypeUnion.new [ $mat2, $mat3, $mat4 ]
  $floatn = $float1234 | $mat234

  $num = TypeUnion.new [ $float, $int ]
  $numn = $num1234 | $mat234

  $union = Set.new [ $float1234, $int1234, $bool1234, $num1234, $float234, $int234,
                    $bool234, $num234, $mat234, $floatn, $num, $numn ]

  $constant = 'CONSTANT'
  $sameasargs = 'SAME_AS_ARGS'
  $sameasmaxarg = 'SAME_AS_MAX_ARG'
  $sameasarg0 = 'SAME_AS_ARG0'
  $sameasarg1 = 'SAME_AS_ARG1'
  $sameasarg2 = 'SAME_AS_ARG2'
  $bvecsizeofargs = 'BVEC_SIZE_OF_ARGS'
  $samebasedim1 = 'SAME_BASE_DIM1'
  $samebasedim2 = 'SAME_BASE_DIM2'
  $samebasedim3 = 'SAME_BASE_DIM3'
  $samebasedim4 = 'SAME_BASE_DIM4'
  $unspecified = 'UNSPECIFIED'
  $multiplication = 'MULTIPLICATION'

  $dependency = Set.new [ $constant, $sameasargs, $sameasmaxarg, $sameasarg0,
                         $sameasarg1, $bvecsizeofargs, $samebasedim1,
                         $samebasedim2, $samebasedim3, $samebasedim4,
                         $unspecified, $multiplication ]

  $none = 'NONE'
  $noarrays = 'NO_ARRAYS'
  $sametype = 'SAME_TYPE'
  $sameorscalar = 'SAME_OR_SCALAR'
  $matvecsamedimension = 'MAT_VEC_SAME_DIMENSION'
  $sameargumentcount = 'SAME_ARGUMENT_COUNT'
  $validargumenttype = 'VALID_ARGUMENT_TYPE'

  $constraint = Set.new [ $none, $noarrays, $sametype, $sameorscalar,
                         $matvecsamedimension, $sameargumentcount,
                         $validargumenttype ]

end

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

goog.provide('embedsl.Argument');
/**
 * @fileoverview Provides the base classes for all AST expression nodes.
 *
 * ATTENTION: Do not edit. This file has been generated from
 * proto/expression-proto.js, gen/gen-swizzlers.rb by rakefile. Edit those files
 * instead.
 *
 */
goog.provide('embedsl.Expression');
goog.provide('embedsl.Kind');

goog.require('embedsl.Type');
goog.require('goog.array');

/**
 * Enum for expression kinds.
 *
 * @enum {string}
 */
embedsl.Kind = {
  ATTRIBUTE: 'attribute',
  BUILTIN: 'builtin',
  BUILTININPUT: 'builtininput',
  CONSTANT: 'constant',
  DISCARD: 'discard',
  GETTER: 'getter',
  INTERPOLATE: 'interpolate',
  OPERATOR: 'operator',
  REFERENCE: 'reference',
  SWIZZLER: 'swizzler',
  UNIFORM: 'uniform',
  VIRTUAL: 'virtual',
  ACCUMULATE: 'accumulate',
  ACCUMULATOR: 'accumulator',
  ITERATOR: 'iterator'
};

/**
 * @typedef {boolean|number|embedsl.Expression|Array.<number>}
 */
embedsl.Argument;

/**
 * The base class for all expressions and AST nodes.
 *
 * @param {!embedsl.Kind} kind Kind of expression.
 * @param {!embedsl.TypeInfo} typeInfo Type info for the expression.
 * @param {?string=} name Name of the expression.
 * @param {?string=} info Additional information.
 * @param {Array.<embedsl.Argument>=} args Arguments of the expression.
 * @constructor
 */
embedsl.Expression = function(kind, typeInfo, name, info, args) {
  /** @type {!embedsl.Kind} */
  this.kind = kind;

  /** @type {!embedsl.TypeInfo} */
  this.typeInfo = typeInfo;

  /** @type {embedsl.Type} */
  this.type = null;

  /** @type {string} */
  this.name = name || '';

  /** @type {string} */
  this.info = info || '';

  /** @type {!Array.<!embedsl.Expression>} */
  this.args = args || [];
  for (var i = 0; i != this.args.length; i++) {
    try {
      this.args[i] = embedsl.Expression.replaceLiteral(this.args[i]);
    }
    catch (e) {
      throw 'Argument ' + i + ': "' + this.args[i] + '" can not be converted to an expression:\n' +
          this.toString(3);
    }
  }
};

/**
 * Genrates a string with n spaces.
 *
 * @param {number} n Number of spaces.
 * @return {string} String.
 * @private
 */
embedsl.Expression.prototype.spaces_ = function(n) {
  var spc = '';
  for (var i = 0; i != n; i++)
    spc += ' ';
  return spc;
};

/**
 * Prints an expression with proper indentation prepended.
 *
 * @param {number} indent Current indentation. Prepend to every new line.
 * @param {number} depth Expression levels to print.
 * @return {string} A fragment of the tree in human readable form.
 * @private
 */
embedsl.Expression.prototype.toString_ = function(indent, depth) {
  if (depth == 0) {
    return '...';

  } else {
    var typeName = this.type ? this.type.glslName() : '<null>';

    switch (this.kind) {
    case embedsl.Kind.BUILTIN:
    case embedsl.Kind.OPERATOR:
    case embedsl.Kind.VIRTUAL:
    case embedsl.Kind.INTERPOLATE:
    case embedsl.Kind.SWIZZLER:
      var argStrings = [];

      for (var i = 0; i != this.args.length; i++)
        argStrings.push(
            this.args[i] != null ?
                this.args[i].toString_(indent + 4, depth - 1) :
                '<undefined>');

      var args;
      switch(argStrings.length) {
      case 0:
        args = '()';
        break;
      case 1:
        args = '(' + argStrings[0] + ')';
        break;
      default:
        args = '(\n' + this.spaces_(indent + 4) +
            argStrings.join(',\n' + this.spaces_(indent + 4)) + '\n' +
            this.spaces_(indent) + ')';
      }
      return typeName + ':' + this.name + args;

    case embedsl.Kind.ATTRIBUTE:
      return typeName + ':' + 'attribute(' + this.name + ')';

    case embedsl.Kind.UNIFORM:
      return typeName + ':' + 'uniform(' + this.name + ')';

    case embedsl.Kind.CONSTANT:
      return typeName + ':' + this.info;

    default:
      return typeName + ':' + this.name;
    }
  }
};

/**
 * Produces a human readable indented string from an expression. Recursively
 * descends the expression tree. Expressions below a specified depth are elided.
 *
 * @param {number=} depth Expression levels to print.
 * @return {string} A fragment of the tree in human readable form.
 */
embedsl.Expression.prototype.toString = function(depth) {
  return this.toString_(0, depth || 1);
};

/**
 * Identifies Javascript literals and replaces them with appropriate
 * expressions.
 *
 * @param {embedsl.Argument} arg Possible literal.
 * @return {!embedsl.Expression} Expression describing the argument value.
 * @protected
 */
embedsl.Expression.replaceLiteral = function(arg) {
  if (!goog.isDefAndNotNull(arg)) {
    throw "Argument is undefined.";

  } else if (goog.isNumber(arg)) {
    var str = Math.round(arg) == arg ? arg.toFixed(1) : arg.toString();
    return new embedsl.Expression(
        embedsl.Kind.CONSTANT,
        embedsl.TypeInfo.ConstantFloat,
        null,
        str);

  } else if (goog.isArray(arg)) {
    /* TODO(tramberend) Currently assuming that arays are constructors for
     * vector literals.  Arrays might be useful for other things too.
     */
    switch (arg.length) {
    case 1: return embedsl.lang.f(
        embedsl.Expression.replaceLiteral(arg[0]));

    case 2: return embedsl.lang.vec2(
        embedsl.Expression.replaceLiteral(arg[0]),
        embedsl.Expression.replaceLiteral(arg[1]));

    case 3: return embedsl.lang.vec3(
        embedsl.Expression.replaceLiteral(arg[0]),
        embedsl.Expression.replaceLiteral(arg[1]),
        embedsl.Expression.replaceLiteral(arg[2]));

    case 4: return embedsl.lang.vec4(
        embedsl.Expression.replaceLiteral(arg[0]),
        embedsl.Expression.replaceLiteral(arg[1]),
        embedsl.Expression.replaceLiteral(arg[2]),
        embedsl.Expression.replaceLiteral(arg[3]));
    case 0:
    default:
      throw 'Javascript array literals in shader expressions not yet fully' +
          'supported. Vector literals only.';
    }

  } else if (goog.isBoolean(arg)) {
    return new embedsl.Expression(
        embedsl.Kind.CONSTANT,
        embedsl.TypeInfo.ConstantBool,
        null,
        (arg ? 'true' : 'false'));

  } else {
    return /** @type {!embedsl.Expression} */ (arg);
  }
};

/**
 * Creates a new reference expression with an already known type.
 *
 * @param {embedsl.Type} type The type.
 * @param {string} name The name of the referenced variable.
 * @return {!embedsl.Expression} The typed expression.
 */
embedsl.Expression.reference = function(type, name) {
  var expression = new embedsl.Expression(
      embedsl.Kind.REFERENCE,
      new embedsl.TypeInfo(embedsl.TypeDependency.CONSTANT, type),
      name);
  expression.type = type;
  return expression;
};

/*
 * All swizzeling functions generated by gen/gen-swizzlers.rb. Do not edit.
 */

/**
 * @return {!embedsl.Expression} Swizzler x.
 */
embedsl.Expression.prototype.x = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'x',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler y.
 */
embedsl.Expression.prototype.y = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'y',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler z.
 */
embedsl.Expression.prototype.z = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'z',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler w.
 */
embedsl.Expression.prototype.w = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'w',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xx.
 */
embedsl.Expression.prototype.xx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'xx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yx.
 */
embedsl.Expression.prototype.yx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'yx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zx.
 */
embedsl.Expression.prototype.zx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'zx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wx.
 */
embedsl.Expression.prototype.wx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'wx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xy.
 */
embedsl.Expression.prototype.xy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'xy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yy.
 */
embedsl.Expression.prototype.yy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'yy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zy.
 */
embedsl.Expression.prototype.zy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'zy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wy.
 */
embedsl.Expression.prototype.wy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'wy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xz.
 */
embedsl.Expression.prototype.xz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'xz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yz.
 */
embedsl.Expression.prototype.yz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'yz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zz.
 */
embedsl.Expression.prototype.zz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'zz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wz.
 */
embedsl.Expression.prototype.wz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'wz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xw.
 */
embedsl.Expression.prototype.xw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'xw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yw.
 */
embedsl.Expression.prototype.yw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'yw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zw.
 */
embedsl.Expression.prototype.zw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'zw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ww.
 */
embedsl.Expression.prototype.ww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxx.
 */
embedsl.Expression.prototype.xxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxx.
 */
embedsl.Expression.prototype.yxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxx.
 */
embedsl.Expression.prototype.zxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxx.
 */
embedsl.Expression.prototype.wxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyx.
 */
embedsl.Expression.prototype.xyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyx.
 */
embedsl.Expression.prototype.yyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyx.
 */
embedsl.Expression.prototype.zyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyx.
 */
embedsl.Expression.prototype.wyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzx.
 */
embedsl.Expression.prototype.xzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzx.
 */
embedsl.Expression.prototype.yzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzx.
 */
embedsl.Expression.prototype.zzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzx.
 */
embedsl.Expression.prototype.wzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwx.
 */
embedsl.Expression.prototype.xwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywx.
 */
embedsl.Expression.prototype.ywx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ywx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwx.
 */
embedsl.Expression.prototype.zwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwx.
 */
embedsl.Expression.prototype.wwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxy.
 */
embedsl.Expression.prototype.xxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxy.
 */
embedsl.Expression.prototype.yxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxy.
 */
embedsl.Expression.prototype.zxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxy.
 */
embedsl.Expression.prototype.wxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyy.
 */
embedsl.Expression.prototype.xyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyy.
 */
embedsl.Expression.prototype.yyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyy.
 */
embedsl.Expression.prototype.zyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyy.
 */
embedsl.Expression.prototype.wyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzy.
 */
embedsl.Expression.prototype.xzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzy.
 */
embedsl.Expression.prototype.yzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzy.
 */
embedsl.Expression.prototype.zzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzy.
 */
embedsl.Expression.prototype.wzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwy.
 */
embedsl.Expression.prototype.xwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywy.
 */
embedsl.Expression.prototype.ywy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ywy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwy.
 */
embedsl.Expression.prototype.zwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwy.
 */
embedsl.Expression.prototype.wwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxz.
 */
embedsl.Expression.prototype.xxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxz.
 */
embedsl.Expression.prototype.yxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxz.
 */
embedsl.Expression.prototype.zxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxz.
 */
embedsl.Expression.prototype.wxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyz.
 */
embedsl.Expression.prototype.xyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyz.
 */
embedsl.Expression.prototype.yyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyz.
 */
embedsl.Expression.prototype.zyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyz.
 */
embedsl.Expression.prototype.wyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzz.
 */
embedsl.Expression.prototype.xzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzz.
 */
embedsl.Expression.prototype.yzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzz.
 */
embedsl.Expression.prototype.zzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzz.
 */
embedsl.Expression.prototype.wzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwz.
 */
embedsl.Expression.prototype.xwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywz.
 */
embedsl.Expression.prototype.ywz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ywz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwz.
 */
embedsl.Expression.prototype.zwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwz.
 */
embedsl.Expression.prototype.wwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxw.
 */
embedsl.Expression.prototype.xxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxw.
 */
embedsl.Expression.prototype.yxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxw.
 */
embedsl.Expression.prototype.zxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxw.
 */
embedsl.Expression.prototype.wxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyw.
 */
embedsl.Expression.prototype.xyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyw.
 */
embedsl.Expression.prototype.yyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyw.
 */
embedsl.Expression.prototype.zyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyw.
 */
embedsl.Expression.prototype.wyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzw.
 */
embedsl.Expression.prototype.xzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzw.
 */
embedsl.Expression.prototype.yzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzw.
 */
embedsl.Expression.prototype.zzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzw.
 */
embedsl.Expression.prototype.wzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'wzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xww.
 */
embedsl.Expression.prototype.xww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'xww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yww.
 */
embedsl.Expression.prototype.yww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'yww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zww.
 */
embedsl.Expression.prototype.zww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'zww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler www.
 */
embedsl.Expression.prototype.www = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'www',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxxx.
 */
embedsl.Expression.prototype.xxxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxxx.
 */
embedsl.Expression.prototype.yxxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxxx.
 */
embedsl.Expression.prototype.zxxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxxx.
 */
embedsl.Expression.prototype.wxxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyxx.
 */
embedsl.Expression.prototype.xyxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyxx.
 */
embedsl.Expression.prototype.yyxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyxx.
 */
embedsl.Expression.prototype.zyxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyxx.
 */
embedsl.Expression.prototype.wyxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzxx.
 */
embedsl.Expression.prototype.xzxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzxx.
 */
embedsl.Expression.prototype.yzxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzxx.
 */
embedsl.Expression.prototype.zzxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzxx.
 */
embedsl.Expression.prototype.wzxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwxx.
 */
embedsl.Expression.prototype.xwxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywxx.
 */
embedsl.Expression.prototype.ywxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwxx.
 */
embedsl.Expression.prototype.zwxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwxx.
 */
embedsl.Expression.prototype.wwxx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwxx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxyx.
 */
embedsl.Expression.prototype.xxyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxyx.
 */
embedsl.Expression.prototype.yxyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxyx.
 */
embedsl.Expression.prototype.zxyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxyx.
 */
embedsl.Expression.prototype.wxyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyyx.
 */
embedsl.Expression.prototype.xyyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyyx.
 */
embedsl.Expression.prototype.yyyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyyx.
 */
embedsl.Expression.prototype.zyyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyyx.
 */
embedsl.Expression.prototype.wyyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzyx.
 */
embedsl.Expression.prototype.xzyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzyx.
 */
embedsl.Expression.prototype.yzyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzyx.
 */
embedsl.Expression.prototype.zzyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzyx.
 */
embedsl.Expression.prototype.wzyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwyx.
 */
embedsl.Expression.prototype.xwyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywyx.
 */
embedsl.Expression.prototype.ywyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwyx.
 */
embedsl.Expression.prototype.zwyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwyx.
 */
embedsl.Expression.prototype.wwyx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwyx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxzx.
 */
embedsl.Expression.prototype.xxzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxzx.
 */
embedsl.Expression.prototype.yxzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxzx.
 */
embedsl.Expression.prototype.zxzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxzx.
 */
embedsl.Expression.prototype.wxzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyzx.
 */
embedsl.Expression.prototype.xyzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyzx.
 */
embedsl.Expression.prototype.yyzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyzx.
 */
embedsl.Expression.prototype.zyzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyzx.
 */
embedsl.Expression.prototype.wyzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzzx.
 */
embedsl.Expression.prototype.xzzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzzx.
 */
embedsl.Expression.prototype.yzzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzzx.
 */
embedsl.Expression.prototype.zzzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzzx.
 */
embedsl.Expression.prototype.wzzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwzx.
 */
embedsl.Expression.prototype.xwzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywzx.
 */
embedsl.Expression.prototype.ywzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwzx.
 */
embedsl.Expression.prototype.zwzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwzx.
 */
embedsl.Expression.prototype.wwzx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwzx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxwx.
 */
embedsl.Expression.prototype.xxwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxwx.
 */
embedsl.Expression.prototype.yxwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxwx.
 */
embedsl.Expression.prototype.zxwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxwx.
 */
embedsl.Expression.prototype.wxwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xywx.
 */
embedsl.Expression.prototype.xywx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xywx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yywx.
 */
embedsl.Expression.prototype.yywx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yywx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zywx.
 */
embedsl.Expression.prototype.zywx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zywx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wywx.
 */
embedsl.Expression.prototype.wywx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wywx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzwx.
 */
embedsl.Expression.prototype.xzwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzwx.
 */
embedsl.Expression.prototype.yzwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzwx.
 */
embedsl.Expression.prototype.zzwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzwx.
 */
embedsl.Expression.prototype.wzwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwwx.
 */
embedsl.Expression.prototype.xwwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywwx.
 */
embedsl.Expression.prototype.ywwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwwx.
 */
embedsl.Expression.prototype.zwwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwwx.
 */
embedsl.Expression.prototype.wwwx = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwwx',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxxy.
 */
embedsl.Expression.prototype.xxxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxxy.
 */
embedsl.Expression.prototype.yxxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxxy.
 */
embedsl.Expression.prototype.zxxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxxy.
 */
embedsl.Expression.prototype.wxxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyxy.
 */
embedsl.Expression.prototype.xyxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyxy.
 */
embedsl.Expression.prototype.yyxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyxy.
 */
embedsl.Expression.prototype.zyxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyxy.
 */
embedsl.Expression.prototype.wyxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzxy.
 */
embedsl.Expression.prototype.xzxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzxy.
 */
embedsl.Expression.prototype.yzxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzxy.
 */
embedsl.Expression.prototype.zzxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzxy.
 */
embedsl.Expression.prototype.wzxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwxy.
 */
embedsl.Expression.prototype.xwxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywxy.
 */
embedsl.Expression.prototype.ywxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwxy.
 */
embedsl.Expression.prototype.zwxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwxy.
 */
embedsl.Expression.prototype.wwxy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwxy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxyy.
 */
embedsl.Expression.prototype.xxyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxyy.
 */
embedsl.Expression.prototype.yxyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxyy.
 */
embedsl.Expression.prototype.zxyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxyy.
 */
embedsl.Expression.prototype.wxyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyyy.
 */
embedsl.Expression.prototype.xyyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyyy.
 */
embedsl.Expression.prototype.yyyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyyy.
 */
embedsl.Expression.prototype.zyyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyyy.
 */
embedsl.Expression.prototype.wyyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzyy.
 */
embedsl.Expression.prototype.xzyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzyy.
 */
embedsl.Expression.prototype.yzyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzyy.
 */
embedsl.Expression.prototype.zzyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzyy.
 */
embedsl.Expression.prototype.wzyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwyy.
 */
embedsl.Expression.prototype.xwyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywyy.
 */
embedsl.Expression.prototype.ywyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwyy.
 */
embedsl.Expression.prototype.zwyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwyy.
 */
embedsl.Expression.prototype.wwyy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwyy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxzy.
 */
embedsl.Expression.prototype.xxzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxzy.
 */
embedsl.Expression.prototype.yxzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxzy.
 */
embedsl.Expression.prototype.zxzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxzy.
 */
embedsl.Expression.prototype.wxzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyzy.
 */
embedsl.Expression.prototype.xyzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyzy.
 */
embedsl.Expression.prototype.yyzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyzy.
 */
embedsl.Expression.prototype.zyzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyzy.
 */
embedsl.Expression.prototype.wyzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzzy.
 */
embedsl.Expression.prototype.xzzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzzy.
 */
embedsl.Expression.prototype.yzzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzzy.
 */
embedsl.Expression.prototype.zzzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzzy.
 */
embedsl.Expression.prototype.wzzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwzy.
 */
embedsl.Expression.prototype.xwzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywzy.
 */
embedsl.Expression.prototype.ywzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwzy.
 */
embedsl.Expression.prototype.zwzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwzy.
 */
embedsl.Expression.prototype.wwzy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwzy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxwy.
 */
embedsl.Expression.prototype.xxwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxwy.
 */
embedsl.Expression.prototype.yxwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxwy.
 */
embedsl.Expression.prototype.zxwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxwy.
 */
embedsl.Expression.prototype.wxwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xywy.
 */
embedsl.Expression.prototype.xywy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xywy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yywy.
 */
embedsl.Expression.prototype.yywy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yywy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zywy.
 */
embedsl.Expression.prototype.zywy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zywy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wywy.
 */
embedsl.Expression.prototype.wywy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wywy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzwy.
 */
embedsl.Expression.prototype.xzwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzwy.
 */
embedsl.Expression.prototype.yzwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzwy.
 */
embedsl.Expression.prototype.zzwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzwy.
 */
embedsl.Expression.prototype.wzwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwwy.
 */
embedsl.Expression.prototype.xwwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywwy.
 */
embedsl.Expression.prototype.ywwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwwy.
 */
embedsl.Expression.prototype.zwwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwwy.
 */
embedsl.Expression.prototype.wwwy = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwwy',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxxz.
 */
embedsl.Expression.prototype.xxxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxxz.
 */
embedsl.Expression.prototype.yxxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxxz.
 */
embedsl.Expression.prototype.zxxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxxz.
 */
embedsl.Expression.prototype.wxxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyxz.
 */
embedsl.Expression.prototype.xyxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyxz.
 */
embedsl.Expression.prototype.yyxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyxz.
 */
embedsl.Expression.prototype.zyxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyxz.
 */
embedsl.Expression.prototype.wyxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzxz.
 */
embedsl.Expression.prototype.xzxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzxz.
 */
embedsl.Expression.prototype.yzxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzxz.
 */
embedsl.Expression.prototype.zzxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzxz.
 */
embedsl.Expression.prototype.wzxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwxz.
 */
embedsl.Expression.prototype.xwxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywxz.
 */
embedsl.Expression.prototype.ywxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwxz.
 */
embedsl.Expression.prototype.zwxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwxz.
 */
embedsl.Expression.prototype.wwxz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwxz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxyz.
 */
embedsl.Expression.prototype.xxyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxyz.
 */
embedsl.Expression.prototype.yxyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxyz.
 */
embedsl.Expression.prototype.zxyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxyz.
 */
embedsl.Expression.prototype.wxyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyyz.
 */
embedsl.Expression.prototype.xyyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyyz.
 */
embedsl.Expression.prototype.yyyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyyz.
 */
embedsl.Expression.prototype.zyyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyyz.
 */
embedsl.Expression.prototype.wyyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzyz.
 */
embedsl.Expression.prototype.xzyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzyz.
 */
embedsl.Expression.prototype.yzyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzyz.
 */
embedsl.Expression.prototype.zzyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzyz.
 */
embedsl.Expression.prototype.wzyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwyz.
 */
embedsl.Expression.prototype.xwyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywyz.
 */
embedsl.Expression.prototype.ywyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwyz.
 */
embedsl.Expression.prototype.zwyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwyz.
 */
embedsl.Expression.prototype.wwyz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwyz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxzz.
 */
embedsl.Expression.prototype.xxzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxzz.
 */
embedsl.Expression.prototype.yxzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxzz.
 */
embedsl.Expression.prototype.zxzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxzz.
 */
embedsl.Expression.prototype.wxzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyzz.
 */
embedsl.Expression.prototype.xyzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyzz.
 */
embedsl.Expression.prototype.yyzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyzz.
 */
embedsl.Expression.prototype.zyzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyzz.
 */
embedsl.Expression.prototype.wyzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzzz.
 */
embedsl.Expression.prototype.xzzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzzz.
 */
embedsl.Expression.prototype.yzzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzzz.
 */
embedsl.Expression.prototype.zzzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzzz.
 */
embedsl.Expression.prototype.wzzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwzz.
 */
embedsl.Expression.prototype.xwzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywzz.
 */
embedsl.Expression.prototype.ywzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwzz.
 */
embedsl.Expression.prototype.zwzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwzz.
 */
embedsl.Expression.prototype.wwzz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwzz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxwz.
 */
embedsl.Expression.prototype.xxwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxwz.
 */
embedsl.Expression.prototype.yxwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxwz.
 */
embedsl.Expression.prototype.zxwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxwz.
 */
embedsl.Expression.prototype.wxwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xywz.
 */
embedsl.Expression.prototype.xywz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xywz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yywz.
 */
embedsl.Expression.prototype.yywz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yywz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zywz.
 */
embedsl.Expression.prototype.zywz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zywz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wywz.
 */
embedsl.Expression.prototype.wywz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wywz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzwz.
 */
embedsl.Expression.prototype.xzwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzwz.
 */
embedsl.Expression.prototype.yzwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzwz.
 */
embedsl.Expression.prototype.zzwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzwz.
 */
embedsl.Expression.prototype.wzwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwwz.
 */
embedsl.Expression.prototype.xwwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywwz.
 */
embedsl.Expression.prototype.ywwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwwz.
 */
embedsl.Expression.prototype.zwwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwwz.
 */
embedsl.Expression.prototype.wwwz = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwwz',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxxw.
 */
embedsl.Expression.prototype.xxxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxxw.
 */
embedsl.Expression.prototype.yxxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxxw.
 */
embedsl.Expression.prototype.zxxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxxw.
 */
embedsl.Expression.prototype.wxxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyxw.
 */
embedsl.Expression.prototype.xyxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyxw.
 */
embedsl.Expression.prototype.yyxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyxw.
 */
embedsl.Expression.prototype.zyxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyxw.
 */
embedsl.Expression.prototype.wyxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzxw.
 */
embedsl.Expression.prototype.xzxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzxw.
 */
embedsl.Expression.prototype.yzxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzxw.
 */
embedsl.Expression.prototype.zzxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzxw.
 */
embedsl.Expression.prototype.wzxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwxw.
 */
embedsl.Expression.prototype.xwxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywxw.
 */
embedsl.Expression.prototype.ywxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwxw.
 */
embedsl.Expression.prototype.zwxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwxw.
 */
embedsl.Expression.prototype.wwxw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwxw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxyw.
 */
embedsl.Expression.prototype.xxyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxyw.
 */
embedsl.Expression.prototype.yxyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxyw.
 */
embedsl.Expression.prototype.zxyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxyw.
 */
embedsl.Expression.prototype.wxyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyyw.
 */
embedsl.Expression.prototype.xyyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyyw.
 */
embedsl.Expression.prototype.yyyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyyw.
 */
embedsl.Expression.prototype.zyyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyyw.
 */
embedsl.Expression.prototype.wyyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzyw.
 */
embedsl.Expression.prototype.xzyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzyw.
 */
embedsl.Expression.prototype.yzyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzyw.
 */
embedsl.Expression.prototype.zzyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzyw.
 */
embedsl.Expression.prototype.wzyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwyw.
 */
embedsl.Expression.prototype.xwyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywyw.
 */
embedsl.Expression.prototype.ywyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwyw.
 */
embedsl.Expression.prototype.zwyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwyw.
 */
embedsl.Expression.prototype.wwyw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwyw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxzw.
 */
embedsl.Expression.prototype.xxzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxzw.
 */
embedsl.Expression.prototype.yxzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxzw.
 */
embedsl.Expression.prototype.zxzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxzw.
 */
embedsl.Expression.prototype.wxzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyzw.
 */
embedsl.Expression.prototype.xyzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyzw.
 */
embedsl.Expression.prototype.yyzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyzw.
 */
embedsl.Expression.prototype.zyzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyzw.
 */
embedsl.Expression.prototype.wyzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzzw.
 */
embedsl.Expression.prototype.xzzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzzw.
 */
embedsl.Expression.prototype.yzzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzzw.
 */
embedsl.Expression.prototype.zzzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzzw.
 */
embedsl.Expression.prototype.wzzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwzw.
 */
embedsl.Expression.prototype.xwzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywzw.
 */
embedsl.Expression.prototype.ywzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwzw.
 */
embedsl.Expression.prototype.zwzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwzw.
 */
embedsl.Expression.prototype.wwzw = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwzw',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xxww.
 */
embedsl.Expression.prototype.xxww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xxww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yxww.
 */
embedsl.Expression.prototype.yxww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yxww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zxww.
 */
embedsl.Expression.prototype.zxww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zxww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wxww.
 */
embedsl.Expression.prototype.wxww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wxww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xyww.
 */
embedsl.Expression.prototype.xyww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xyww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yyww.
 */
embedsl.Expression.prototype.yyww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yyww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zyww.
 */
embedsl.Expression.prototype.zyww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zyww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wyww.
 */
embedsl.Expression.prototype.wyww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wyww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xzww.
 */
embedsl.Expression.prototype.xzww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xzww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler yzww.
 */
embedsl.Expression.prototype.yzww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'yzww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zzww.
 */
embedsl.Expression.prototype.zzww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zzww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wzww.
 */
embedsl.Expression.prototype.wzww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wzww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler xwww.
 */
embedsl.Expression.prototype.xwww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'xwww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ywww.
 */
embedsl.Expression.prototype.ywww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ywww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler zwww.
 */
embedsl.Expression.prototype.zwww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'zwww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler wwww.
 */
embedsl.Expression.prototype.wwww = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'wwww',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler r.
 */
embedsl.Expression.prototype.r = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'r',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler g.
 */
embedsl.Expression.prototype.g = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'g',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler b.
 */
embedsl.Expression.prototype.b = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'b',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler a.
 */
embedsl.Expression.prototype.a = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'a',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rr.
 */
embedsl.Expression.prototype.rr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'rr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gr.
 */
embedsl.Expression.prototype.gr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'gr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler br.
 */
embedsl.Expression.prototype.br = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'br',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ar.
 */
embedsl.Expression.prototype.ar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rg.
 */
embedsl.Expression.prototype.rg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'rg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gg.
 */
embedsl.Expression.prototype.gg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'gg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bg.
 */
embedsl.Expression.prototype.bg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'bg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ag.
 */
embedsl.Expression.prototype.ag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rb.
 */
embedsl.Expression.prototype.rb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'rb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gb.
 */
embedsl.Expression.prototype.gb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'gb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bb.
 */
embedsl.Expression.prototype.bb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'bb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ab.
 */
embedsl.Expression.prototype.ab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ra.
 */
embedsl.Expression.prototype.ra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ga.
 */
embedsl.Expression.prototype.ga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ba.
 */
embedsl.Expression.prototype.ba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aa.
 */
embedsl.Expression.prototype.aa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'aa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrr.
 */
embedsl.Expression.prototype.rrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grr.
 */
embedsl.Expression.prototype.grr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'grr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brr.
 */
embedsl.Expression.prototype.brr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'brr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arr.
 */
embedsl.Expression.prototype.arr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'arr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgr.
 */
embedsl.Expression.prototype.rgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggr.
 */
embedsl.Expression.prototype.ggr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ggr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgr.
 */
embedsl.Expression.prototype.bgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agr.
 */
embedsl.Expression.prototype.agr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'agr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbr.
 */
embedsl.Expression.prototype.rbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbr.
 */
embedsl.Expression.prototype.gbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbr.
 */
embedsl.Expression.prototype.bbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abr.
 */
embedsl.Expression.prototype.abr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'abr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rar.
 */
embedsl.Expression.prototype.rar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gar.
 */
embedsl.Expression.prototype.gar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bar.
 */
embedsl.Expression.prototype.bar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aar.
 */
embedsl.Expression.prototype.aar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'aar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrg.
 */
embedsl.Expression.prototype.rrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grg.
 */
embedsl.Expression.prototype.grg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'grg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brg.
 */
embedsl.Expression.prototype.brg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'brg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arg.
 */
embedsl.Expression.prototype.arg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'arg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgg.
 */
embedsl.Expression.prototype.rgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggg.
 */
embedsl.Expression.prototype.ggg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ggg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgg.
 */
embedsl.Expression.prototype.bgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agg.
 */
embedsl.Expression.prototype.agg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'agg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbg.
 */
embedsl.Expression.prototype.rbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbg.
 */
embedsl.Expression.prototype.gbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbg.
 */
embedsl.Expression.prototype.bbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abg.
 */
embedsl.Expression.prototype.abg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'abg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rag.
 */
embedsl.Expression.prototype.rag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gag.
 */
embedsl.Expression.prototype.gag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bag.
 */
embedsl.Expression.prototype.bag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aag.
 */
embedsl.Expression.prototype.aag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'aag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrb.
 */
embedsl.Expression.prototype.rrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grb.
 */
embedsl.Expression.prototype.grb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'grb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brb.
 */
embedsl.Expression.prototype.brb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'brb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arb.
 */
embedsl.Expression.prototype.arb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'arb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgb.
 */
embedsl.Expression.prototype.rgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggb.
 */
embedsl.Expression.prototype.ggb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ggb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgb.
 */
embedsl.Expression.prototype.bgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agb.
 */
embedsl.Expression.prototype.agb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'agb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbb.
 */
embedsl.Expression.prototype.rbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbb.
 */
embedsl.Expression.prototype.gbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbb.
 */
embedsl.Expression.prototype.bbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abb.
 */
embedsl.Expression.prototype.abb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'abb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rab.
 */
embedsl.Expression.prototype.rab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gab.
 */
embedsl.Expression.prototype.gab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bab.
 */
embedsl.Expression.prototype.bab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aab.
 */
embedsl.Expression.prototype.aab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'aab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rra.
 */
embedsl.Expression.prototype.rra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gra.
 */
embedsl.Expression.prototype.gra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bra.
 */
embedsl.Expression.prototype.bra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ara.
 */
embedsl.Expression.prototype.ara = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ara',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rga.
 */
embedsl.Expression.prototype.rga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gga.
 */
embedsl.Expression.prototype.gga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bga.
 */
embedsl.Expression.prototype.bga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aga.
 */
embedsl.Expression.prototype.aga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'aga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rba.
 */
embedsl.Expression.prototype.rba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'rba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gba.
 */
embedsl.Expression.prototype.gba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bba.
 */
embedsl.Expression.prototype.bba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'bba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aba.
 */
embedsl.Expression.prototype.aba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'aba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler raa.
 */
embedsl.Expression.prototype.raa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'raa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gaa.
 */
embedsl.Expression.prototype.gaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'gaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler baa.
 */
embedsl.Expression.prototype.baa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'baa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aaa.
 */
embedsl.Expression.prototype.aaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'aaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrrr.
 */
embedsl.Expression.prototype.rrrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grrr.
 */
embedsl.Expression.prototype.grrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brrr.
 */
embedsl.Expression.prototype.brrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arrr.
 */
embedsl.Expression.prototype.arrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgrr.
 */
embedsl.Expression.prototype.rgrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggrr.
 */
embedsl.Expression.prototype.ggrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgrr.
 */
embedsl.Expression.prototype.bgrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agrr.
 */
embedsl.Expression.prototype.agrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbrr.
 */
embedsl.Expression.prototype.rbrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbrr.
 */
embedsl.Expression.prototype.gbrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbrr.
 */
embedsl.Expression.prototype.bbrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abrr.
 */
embedsl.Expression.prototype.abrr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abrr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rarr.
 */
embedsl.Expression.prototype.rarr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rarr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler garr.
 */
embedsl.Expression.prototype.garr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'garr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler barr.
 */
embedsl.Expression.prototype.barr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'barr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aarr.
 */
embedsl.Expression.prototype.aarr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aarr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrgr.
 */
embedsl.Expression.prototype.rrgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grgr.
 */
embedsl.Expression.prototype.grgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brgr.
 */
embedsl.Expression.prototype.brgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler argr.
 */
embedsl.Expression.prototype.argr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'argr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rggr.
 */
embedsl.Expression.prototype.rggr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rggr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gggr.
 */
embedsl.Expression.prototype.gggr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gggr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bggr.
 */
embedsl.Expression.prototype.bggr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bggr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aggr.
 */
embedsl.Expression.prototype.aggr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aggr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbgr.
 */
embedsl.Expression.prototype.rbgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbgr.
 */
embedsl.Expression.prototype.gbgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbgr.
 */
embedsl.Expression.prototype.bbgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abgr.
 */
embedsl.Expression.prototype.abgr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abgr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ragr.
 */
embedsl.Expression.prototype.ragr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ragr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gagr.
 */
embedsl.Expression.prototype.gagr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gagr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bagr.
 */
embedsl.Expression.prototype.bagr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bagr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aagr.
 */
embedsl.Expression.prototype.aagr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aagr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrbr.
 */
embedsl.Expression.prototype.rrbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grbr.
 */
embedsl.Expression.prototype.grbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brbr.
 */
embedsl.Expression.prototype.brbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arbr.
 */
embedsl.Expression.prototype.arbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgbr.
 */
embedsl.Expression.prototype.rgbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggbr.
 */
embedsl.Expression.prototype.ggbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgbr.
 */
embedsl.Expression.prototype.bgbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agbr.
 */
embedsl.Expression.prototype.agbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbbr.
 */
embedsl.Expression.prototype.rbbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbbr.
 */
embedsl.Expression.prototype.gbbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbbr.
 */
embedsl.Expression.prototype.bbbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abbr.
 */
embedsl.Expression.prototype.abbr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abbr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rabr.
 */
embedsl.Expression.prototype.rabr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rabr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gabr.
 */
embedsl.Expression.prototype.gabr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gabr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler babr.
 */
embedsl.Expression.prototype.babr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'babr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aabr.
 */
embedsl.Expression.prototype.aabr = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aabr',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrar.
 */
embedsl.Expression.prototype.rrar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grar.
 */
embedsl.Expression.prototype.grar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brar.
 */
embedsl.Expression.prototype.brar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arar.
 */
embedsl.Expression.prototype.arar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgar.
 */
embedsl.Expression.prototype.rgar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggar.
 */
embedsl.Expression.prototype.ggar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgar.
 */
embedsl.Expression.prototype.bgar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agar.
 */
embedsl.Expression.prototype.agar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbar.
 */
embedsl.Expression.prototype.rbar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbar.
 */
embedsl.Expression.prototype.gbar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbar.
 */
embedsl.Expression.prototype.bbar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abar.
 */
embedsl.Expression.prototype.abar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler raar.
 */
embedsl.Expression.prototype.raar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'raar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gaar.
 */
embedsl.Expression.prototype.gaar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gaar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler baar.
 */
embedsl.Expression.prototype.baar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'baar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aaar.
 */
embedsl.Expression.prototype.aaar = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aaar',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrrg.
 */
embedsl.Expression.prototype.rrrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grrg.
 */
embedsl.Expression.prototype.grrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brrg.
 */
embedsl.Expression.prototype.brrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arrg.
 */
embedsl.Expression.prototype.arrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgrg.
 */
embedsl.Expression.prototype.rgrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggrg.
 */
embedsl.Expression.prototype.ggrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgrg.
 */
embedsl.Expression.prototype.bgrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agrg.
 */
embedsl.Expression.prototype.agrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbrg.
 */
embedsl.Expression.prototype.rbrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbrg.
 */
embedsl.Expression.prototype.gbrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbrg.
 */
embedsl.Expression.prototype.bbrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abrg.
 */
embedsl.Expression.prototype.abrg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abrg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rarg.
 */
embedsl.Expression.prototype.rarg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rarg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler garg.
 */
embedsl.Expression.prototype.garg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'garg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler barg.
 */
embedsl.Expression.prototype.barg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'barg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aarg.
 */
embedsl.Expression.prototype.aarg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aarg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrgg.
 */
embedsl.Expression.prototype.rrgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grgg.
 */
embedsl.Expression.prototype.grgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brgg.
 */
embedsl.Expression.prototype.brgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler argg.
 */
embedsl.Expression.prototype.argg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'argg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rggg.
 */
embedsl.Expression.prototype.rggg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rggg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gggg.
 */
embedsl.Expression.prototype.gggg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gggg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bggg.
 */
embedsl.Expression.prototype.bggg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bggg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aggg.
 */
embedsl.Expression.prototype.aggg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aggg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbgg.
 */
embedsl.Expression.prototype.rbgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbgg.
 */
embedsl.Expression.prototype.gbgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbgg.
 */
embedsl.Expression.prototype.bbgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abgg.
 */
embedsl.Expression.prototype.abgg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abgg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ragg.
 */
embedsl.Expression.prototype.ragg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ragg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gagg.
 */
embedsl.Expression.prototype.gagg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gagg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bagg.
 */
embedsl.Expression.prototype.bagg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bagg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aagg.
 */
embedsl.Expression.prototype.aagg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aagg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrbg.
 */
embedsl.Expression.prototype.rrbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grbg.
 */
embedsl.Expression.prototype.grbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brbg.
 */
embedsl.Expression.prototype.brbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arbg.
 */
embedsl.Expression.prototype.arbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgbg.
 */
embedsl.Expression.prototype.rgbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggbg.
 */
embedsl.Expression.prototype.ggbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgbg.
 */
embedsl.Expression.prototype.bgbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agbg.
 */
embedsl.Expression.prototype.agbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbbg.
 */
embedsl.Expression.prototype.rbbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbbg.
 */
embedsl.Expression.prototype.gbbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbbg.
 */
embedsl.Expression.prototype.bbbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abbg.
 */
embedsl.Expression.prototype.abbg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abbg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rabg.
 */
embedsl.Expression.prototype.rabg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rabg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gabg.
 */
embedsl.Expression.prototype.gabg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gabg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler babg.
 */
embedsl.Expression.prototype.babg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'babg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aabg.
 */
embedsl.Expression.prototype.aabg = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aabg',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrag.
 */
embedsl.Expression.prototype.rrag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grag.
 */
embedsl.Expression.prototype.grag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brag.
 */
embedsl.Expression.prototype.brag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arag.
 */
embedsl.Expression.prototype.arag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgag.
 */
embedsl.Expression.prototype.rgag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggag.
 */
embedsl.Expression.prototype.ggag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgag.
 */
embedsl.Expression.prototype.bgag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agag.
 */
embedsl.Expression.prototype.agag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbag.
 */
embedsl.Expression.prototype.rbag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbag.
 */
embedsl.Expression.prototype.gbag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbag.
 */
embedsl.Expression.prototype.bbag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abag.
 */
embedsl.Expression.prototype.abag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler raag.
 */
embedsl.Expression.prototype.raag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'raag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gaag.
 */
embedsl.Expression.prototype.gaag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gaag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler baag.
 */
embedsl.Expression.prototype.baag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'baag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aaag.
 */
embedsl.Expression.prototype.aaag = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aaag',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrrb.
 */
embedsl.Expression.prototype.rrrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grrb.
 */
embedsl.Expression.prototype.grrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brrb.
 */
embedsl.Expression.prototype.brrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arrb.
 */
embedsl.Expression.prototype.arrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgrb.
 */
embedsl.Expression.prototype.rgrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggrb.
 */
embedsl.Expression.prototype.ggrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgrb.
 */
embedsl.Expression.prototype.bgrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agrb.
 */
embedsl.Expression.prototype.agrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbrb.
 */
embedsl.Expression.prototype.rbrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbrb.
 */
embedsl.Expression.prototype.gbrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbrb.
 */
embedsl.Expression.prototype.bbrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abrb.
 */
embedsl.Expression.prototype.abrb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abrb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rarb.
 */
embedsl.Expression.prototype.rarb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rarb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler garb.
 */
embedsl.Expression.prototype.garb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'garb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler barb.
 */
embedsl.Expression.prototype.barb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'barb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aarb.
 */
embedsl.Expression.prototype.aarb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aarb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrgb.
 */
embedsl.Expression.prototype.rrgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grgb.
 */
embedsl.Expression.prototype.grgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brgb.
 */
embedsl.Expression.prototype.brgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler argb.
 */
embedsl.Expression.prototype.argb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'argb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rggb.
 */
embedsl.Expression.prototype.rggb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rggb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gggb.
 */
embedsl.Expression.prototype.gggb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gggb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bggb.
 */
embedsl.Expression.prototype.bggb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bggb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aggb.
 */
embedsl.Expression.prototype.aggb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aggb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbgb.
 */
embedsl.Expression.prototype.rbgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbgb.
 */
embedsl.Expression.prototype.gbgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbgb.
 */
embedsl.Expression.prototype.bbgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abgb.
 */
embedsl.Expression.prototype.abgb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abgb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ragb.
 */
embedsl.Expression.prototype.ragb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ragb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gagb.
 */
embedsl.Expression.prototype.gagb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gagb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bagb.
 */
embedsl.Expression.prototype.bagb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bagb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aagb.
 */
embedsl.Expression.prototype.aagb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aagb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrbb.
 */
embedsl.Expression.prototype.rrbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grbb.
 */
embedsl.Expression.prototype.grbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brbb.
 */
embedsl.Expression.prototype.brbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arbb.
 */
embedsl.Expression.prototype.arbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgbb.
 */
embedsl.Expression.prototype.rgbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggbb.
 */
embedsl.Expression.prototype.ggbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgbb.
 */
embedsl.Expression.prototype.bgbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agbb.
 */
embedsl.Expression.prototype.agbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbbb.
 */
embedsl.Expression.prototype.rbbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbbb.
 */
embedsl.Expression.prototype.gbbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbbb.
 */
embedsl.Expression.prototype.bbbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abbb.
 */
embedsl.Expression.prototype.abbb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abbb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rabb.
 */
embedsl.Expression.prototype.rabb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rabb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gabb.
 */
embedsl.Expression.prototype.gabb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gabb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler babb.
 */
embedsl.Expression.prototype.babb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'babb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aabb.
 */
embedsl.Expression.prototype.aabb = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aabb',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrab.
 */
embedsl.Expression.prototype.rrab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grab.
 */
embedsl.Expression.prototype.grab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brab.
 */
embedsl.Expression.prototype.brab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arab.
 */
embedsl.Expression.prototype.arab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgab.
 */
embedsl.Expression.prototype.rgab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggab.
 */
embedsl.Expression.prototype.ggab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgab.
 */
embedsl.Expression.prototype.bgab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agab.
 */
embedsl.Expression.prototype.agab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbab.
 */
embedsl.Expression.prototype.rbab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbab.
 */
embedsl.Expression.prototype.gbab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbab.
 */
embedsl.Expression.prototype.bbab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abab.
 */
embedsl.Expression.prototype.abab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler raab.
 */
embedsl.Expression.prototype.raab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'raab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gaab.
 */
embedsl.Expression.prototype.gaab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gaab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler baab.
 */
embedsl.Expression.prototype.baab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'baab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aaab.
 */
embedsl.Expression.prototype.aaab = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aaab',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrra.
 */
embedsl.Expression.prototype.rrra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grra.
 */
embedsl.Expression.prototype.grra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brra.
 */
embedsl.Expression.prototype.brra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arra.
 */
embedsl.Expression.prototype.arra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgra.
 */
embedsl.Expression.prototype.rgra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggra.
 */
embedsl.Expression.prototype.ggra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgra.
 */
embedsl.Expression.prototype.bgra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agra.
 */
embedsl.Expression.prototype.agra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbra.
 */
embedsl.Expression.prototype.rbra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbra.
 */
embedsl.Expression.prototype.gbra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbra.
 */
embedsl.Expression.prototype.bbra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abra.
 */
embedsl.Expression.prototype.abra = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abra',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rara.
 */
embedsl.Expression.prototype.rara = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rara',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gara.
 */
embedsl.Expression.prototype.gara = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gara',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bara.
 */
embedsl.Expression.prototype.bara = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bara',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aara.
 */
embedsl.Expression.prototype.aara = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aara',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrga.
 */
embedsl.Expression.prototype.rrga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grga.
 */
embedsl.Expression.prototype.grga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brga.
 */
embedsl.Expression.prototype.brga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arga.
 */
embedsl.Expression.prototype.arga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgga.
 */
embedsl.Expression.prototype.rgga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggga.
 */
embedsl.Expression.prototype.ggga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgga.
 */
embedsl.Expression.prototype.bgga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agga.
 */
embedsl.Expression.prototype.agga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbga.
 */
embedsl.Expression.prototype.rbga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbga.
 */
embedsl.Expression.prototype.gbga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbga.
 */
embedsl.Expression.prototype.bbga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abga.
 */
embedsl.Expression.prototype.abga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler raga.
 */
embedsl.Expression.prototype.raga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'raga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gaga.
 */
embedsl.Expression.prototype.gaga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gaga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler baga.
 */
embedsl.Expression.prototype.baga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'baga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aaga.
 */
embedsl.Expression.prototype.aaga = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aaga',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rrba.
 */
embedsl.Expression.prototype.rrba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rrba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler grba.
 */
embedsl.Expression.prototype.grba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'grba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler brba.
 */
embedsl.Expression.prototype.brba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'brba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler arba.
 */
embedsl.Expression.prototype.arba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'arba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgba.
 */
embedsl.Expression.prototype.rgba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggba.
 */
embedsl.Expression.prototype.ggba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgba.
 */
embedsl.Expression.prototype.bgba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agba.
 */
embedsl.Expression.prototype.agba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbba.
 */
embedsl.Expression.prototype.rbba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbba.
 */
embedsl.Expression.prototype.gbba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbba.
 */
embedsl.Expression.prototype.bbba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abba.
 */
embedsl.Expression.prototype.abba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler raba.
 */
embedsl.Expression.prototype.raba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'raba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gaba.
 */
embedsl.Expression.prototype.gaba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gaba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler baba.
 */
embedsl.Expression.prototype.baba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'baba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aaba.
 */
embedsl.Expression.prototype.aaba = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aaba',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rraa.
 */
embedsl.Expression.prototype.rraa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rraa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler graa.
 */
embedsl.Expression.prototype.graa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'graa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler braa.
 */
embedsl.Expression.prototype.braa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'braa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler araa.
 */
embedsl.Expression.prototype.araa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'araa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rgaa.
 */
embedsl.Expression.prototype.rgaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rgaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ggaa.
 */
embedsl.Expression.prototype.ggaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ggaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bgaa.
 */
embedsl.Expression.prototype.bgaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bgaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler agaa.
 */
embedsl.Expression.prototype.agaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'agaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler rbaa.
 */
embedsl.Expression.prototype.rbaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'rbaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gbaa.
 */
embedsl.Expression.prototype.gbaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gbaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler bbaa.
 */
embedsl.Expression.prototype.bbaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'bbaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler abaa.
 */
embedsl.Expression.prototype.abaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'abaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler raaa.
 */
embedsl.Expression.prototype.raaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'raaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler gaaa.
 */
embedsl.Expression.prototype.gaaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'gaaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler baaa.
 */
embedsl.Expression.prototype.baaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'baaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler aaaa.
 */
embedsl.Expression.prototype.aaaa = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'aaaa',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler s.
 */
embedsl.Expression.prototype.s = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      's',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler t.
 */
embedsl.Expression.prototype.t = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      't',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler p.
 */
embedsl.Expression.prototype.p = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'p',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler q.
 */
embedsl.Expression.prototype.q = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim1,
      'q',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ss.
 */
embedsl.Expression.prototype.ss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ts.
 */
embedsl.Expression.prototype.ts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ps.
 */
embedsl.Expression.prototype.ps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'ps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qs.
 */
embedsl.Expression.prototype.qs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'qs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler st.
 */
embedsl.Expression.prototype.st = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'st',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tt.
 */
embedsl.Expression.prototype.tt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'tt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pt.
 */
embedsl.Expression.prototype.pt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'pt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qt.
 */
embedsl.Expression.prototype.qt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'qt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sp.
 */
embedsl.Expression.prototype.sp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'sp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tp.
 */
embedsl.Expression.prototype.tp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'tp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pp.
 */
embedsl.Expression.prototype.pp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'pp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qp.
 */
embedsl.Expression.prototype.qp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'qp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sq.
 */
embedsl.Expression.prototype.sq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'sq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tq.
 */
embedsl.Expression.prototype.tq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'tq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pq.
 */
embedsl.Expression.prototype.pq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'pq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qq.
 */
embedsl.Expression.prototype.qq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim2,
      'qq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sss.
 */
embedsl.Expression.prototype.sss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tss.
 */
embedsl.Expression.prototype.tss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pss.
 */
embedsl.Expression.prototype.pss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qss.
 */
embedsl.Expression.prototype.qss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sts.
 */
embedsl.Expression.prototype.sts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tts.
 */
embedsl.Expression.prototype.tts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pts.
 */
embedsl.Expression.prototype.pts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qts.
 */
embedsl.Expression.prototype.qts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sps.
 */
embedsl.Expression.prototype.sps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tps.
 */
embedsl.Expression.prototype.tps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pps.
 */
embedsl.Expression.prototype.pps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qps.
 */
embedsl.Expression.prototype.qps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqs.
 */
embedsl.Expression.prototype.sqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqs.
 */
embedsl.Expression.prototype.tqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqs.
 */
embedsl.Expression.prototype.pqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqs.
 */
embedsl.Expression.prototype.qqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sst.
 */
embedsl.Expression.prototype.sst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tst.
 */
embedsl.Expression.prototype.tst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pst.
 */
embedsl.Expression.prototype.pst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qst.
 */
embedsl.Expression.prototype.qst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stt.
 */
embedsl.Expression.prototype.stt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'stt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttt.
 */
embedsl.Expression.prototype.ttt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ttt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptt.
 */
embedsl.Expression.prototype.ptt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ptt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtt.
 */
embedsl.Expression.prototype.qtt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qtt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spt.
 */
embedsl.Expression.prototype.spt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'spt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpt.
 */
embedsl.Expression.prototype.tpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppt.
 */
embedsl.Expression.prototype.ppt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ppt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpt.
 */
embedsl.Expression.prototype.qpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqt.
 */
embedsl.Expression.prototype.sqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqt.
 */
embedsl.Expression.prototype.tqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqt.
 */
embedsl.Expression.prototype.pqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqt.
 */
embedsl.Expression.prototype.qqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssp.
 */
embedsl.Expression.prototype.ssp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ssp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsp.
 */
embedsl.Expression.prototype.tsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psp.
 */
embedsl.Expression.prototype.psp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'psp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsp.
 */
embedsl.Expression.prototype.qsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stp.
 */
embedsl.Expression.prototype.stp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'stp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttp.
 */
embedsl.Expression.prototype.ttp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ttp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptp.
 */
embedsl.Expression.prototype.ptp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ptp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtp.
 */
embedsl.Expression.prototype.qtp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qtp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spp.
 */
embedsl.Expression.prototype.spp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'spp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpp.
 */
embedsl.Expression.prototype.tpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppp.
 */
embedsl.Expression.prototype.ppp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ppp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpp.
 */
embedsl.Expression.prototype.qpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqp.
 */
embedsl.Expression.prototype.sqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqp.
 */
embedsl.Expression.prototype.tqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqp.
 */
embedsl.Expression.prototype.pqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqp.
 */
embedsl.Expression.prototype.qqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssq.
 */
embedsl.Expression.prototype.ssq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ssq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsq.
 */
embedsl.Expression.prototype.tsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psq.
 */
embedsl.Expression.prototype.psq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'psq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsq.
 */
embedsl.Expression.prototype.qsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stq.
 */
embedsl.Expression.prototype.stq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'stq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttq.
 */
embedsl.Expression.prototype.ttq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ttq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptq.
 */
embedsl.Expression.prototype.ptq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ptq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtq.
 */
embedsl.Expression.prototype.qtq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qtq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spq.
 */
embedsl.Expression.prototype.spq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'spq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpq.
 */
embedsl.Expression.prototype.tpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppq.
 */
embedsl.Expression.prototype.ppq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'ppq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpq.
 */
embedsl.Expression.prototype.qpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqq.
 */
embedsl.Expression.prototype.sqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'sqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqq.
 */
embedsl.Expression.prototype.tqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'tqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqq.
 */
embedsl.Expression.prototype.pqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'pqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqq.
 */
embedsl.Expression.prototype.qqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim3,
      'qqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssss.
 */
embedsl.Expression.prototype.ssss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsss.
 */
embedsl.Expression.prototype.tsss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psss.
 */
embedsl.Expression.prototype.psss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsss.
 */
embedsl.Expression.prototype.qsss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stss.
 */
embedsl.Expression.prototype.stss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttss.
 */
embedsl.Expression.prototype.ttss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptss.
 */
embedsl.Expression.prototype.ptss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtss.
 */
embedsl.Expression.prototype.qtss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spss.
 */
embedsl.Expression.prototype.spss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpss.
 */
embedsl.Expression.prototype.tpss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppss.
 */
embedsl.Expression.prototype.ppss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpss.
 */
embedsl.Expression.prototype.qpss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqss.
 */
embedsl.Expression.prototype.sqss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqss.
 */
embedsl.Expression.prototype.tqss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqss.
 */
embedsl.Expression.prototype.pqss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqss.
 */
embedsl.Expression.prototype.qqss = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqss',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssts.
 */
embedsl.Expression.prototype.ssts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsts.
 */
embedsl.Expression.prototype.tsts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psts.
 */
embedsl.Expression.prototype.psts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsts.
 */
embedsl.Expression.prototype.qsts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stts.
 */
embedsl.Expression.prototype.stts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttts.
 */
embedsl.Expression.prototype.ttts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptts.
 */
embedsl.Expression.prototype.ptts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtts.
 */
embedsl.Expression.prototype.qtts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spts.
 */
embedsl.Expression.prototype.spts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpts.
 */
embedsl.Expression.prototype.tpts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppts.
 */
embedsl.Expression.prototype.ppts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpts.
 */
embedsl.Expression.prototype.qpts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqts.
 */
embedsl.Expression.prototype.sqts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqts.
 */
embedsl.Expression.prototype.tqts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqts.
 */
embedsl.Expression.prototype.pqts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqts.
 */
embedsl.Expression.prototype.qqts = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqts',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssps.
 */
embedsl.Expression.prototype.ssps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsps.
 */
embedsl.Expression.prototype.tsps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psps.
 */
embedsl.Expression.prototype.psps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsps.
 */
embedsl.Expression.prototype.qsps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stps.
 */
embedsl.Expression.prototype.stps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttps.
 */
embedsl.Expression.prototype.ttps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptps.
 */
embedsl.Expression.prototype.ptps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtps.
 */
embedsl.Expression.prototype.qtps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spps.
 */
embedsl.Expression.prototype.spps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpps.
 */
embedsl.Expression.prototype.tpps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppps.
 */
embedsl.Expression.prototype.ppps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpps.
 */
embedsl.Expression.prototype.qpps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqps.
 */
embedsl.Expression.prototype.sqps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqps.
 */
embedsl.Expression.prototype.tqps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqps.
 */
embedsl.Expression.prototype.pqps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqps.
 */
embedsl.Expression.prototype.qqps = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqps',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssqs.
 */
embedsl.Expression.prototype.ssqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsqs.
 */
embedsl.Expression.prototype.tsqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psqs.
 */
embedsl.Expression.prototype.psqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsqs.
 */
embedsl.Expression.prototype.qsqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stqs.
 */
embedsl.Expression.prototype.stqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttqs.
 */
embedsl.Expression.prototype.ttqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptqs.
 */
embedsl.Expression.prototype.ptqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtqs.
 */
embedsl.Expression.prototype.qtqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spqs.
 */
embedsl.Expression.prototype.spqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpqs.
 */
embedsl.Expression.prototype.tpqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppqs.
 */
embedsl.Expression.prototype.ppqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpqs.
 */
embedsl.Expression.prototype.qpqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqqs.
 */
embedsl.Expression.prototype.sqqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqqs.
 */
embedsl.Expression.prototype.tqqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqqs.
 */
embedsl.Expression.prototype.pqqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqqs.
 */
embedsl.Expression.prototype.qqqs = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqqs',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssst.
 */
embedsl.Expression.prototype.ssst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsst.
 */
embedsl.Expression.prototype.tsst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psst.
 */
embedsl.Expression.prototype.psst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsst.
 */
embedsl.Expression.prototype.qsst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stst.
 */
embedsl.Expression.prototype.stst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttst.
 */
embedsl.Expression.prototype.ttst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptst.
 */
embedsl.Expression.prototype.ptst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtst.
 */
embedsl.Expression.prototype.qtst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spst.
 */
embedsl.Expression.prototype.spst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpst.
 */
embedsl.Expression.prototype.tpst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppst.
 */
embedsl.Expression.prototype.ppst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpst.
 */
embedsl.Expression.prototype.qpst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqst.
 */
embedsl.Expression.prototype.sqst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqst.
 */
embedsl.Expression.prototype.tqst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqst.
 */
embedsl.Expression.prototype.pqst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqst.
 */
embedsl.Expression.prototype.qqst = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqst',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sstt.
 */
embedsl.Expression.prototype.sstt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sstt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tstt.
 */
embedsl.Expression.prototype.tstt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tstt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pstt.
 */
embedsl.Expression.prototype.pstt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pstt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qstt.
 */
embedsl.Expression.prototype.qstt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qstt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sttt.
 */
embedsl.Expression.prototype.sttt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sttt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tttt.
 */
embedsl.Expression.prototype.tttt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tttt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pttt.
 */
embedsl.Expression.prototype.pttt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pttt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qttt.
 */
embedsl.Expression.prototype.qttt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qttt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sptt.
 */
embedsl.Expression.prototype.sptt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sptt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tptt.
 */
embedsl.Expression.prototype.tptt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tptt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pptt.
 */
embedsl.Expression.prototype.pptt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pptt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qptt.
 */
embedsl.Expression.prototype.qptt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qptt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqtt.
 */
embedsl.Expression.prototype.sqtt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqtt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqtt.
 */
embedsl.Expression.prototype.tqtt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqtt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqtt.
 */
embedsl.Expression.prototype.pqtt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqtt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqtt.
 */
embedsl.Expression.prototype.qqtt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqtt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sspt.
 */
embedsl.Expression.prototype.sspt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sspt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tspt.
 */
embedsl.Expression.prototype.tspt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tspt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pspt.
 */
embedsl.Expression.prototype.pspt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pspt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qspt.
 */
embedsl.Expression.prototype.qspt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qspt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stpt.
 */
embedsl.Expression.prototype.stpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttpt.
 */
embedsl.Expression.prototype.ttpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptpt.
 */
embedsl.Expression.prototype.ptpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtpt.
 */
embedsl.Expression.prototype.qtpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sppt.
 */
embedsl.Expression.prototype.sppt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sppt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tppt.
 */
embedsl.Expression.prototype.tppt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tppt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pppt.
 */
embedsl.Expression.prototype.pppt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pppt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qppt.
 */
embedsl.Expression.prototype.qppt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qppt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqpt.
 */
embedsl.Expression.prototype.sqpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqpt.
 */
embedsl.Expression.prototype.tqpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqpt.
 */
embedsl.Expression.prototype.pqpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqpt.
 */
embedsl.Expression.prototype.qqpt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqpt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssqt.
 */
embedsl.Expression.prototype.ssqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsqt.
 */
embedsl.Expression.prototype.tsqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psqt.
 */
embedsl.Expression.prototype.psqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsqt.
 */
embedsl.Expression.prototype.qsqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stqt.
 */
embedsl.Expression.prototype.stqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttqt.
 */
embedsl.Expression.prototype.ttqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptqt.
 */
embedsl.Expression.prototype.ptqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtqt.
 */
embedsl.Expression.prototype.qtqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spqt.
 */
embedsl.Expression.prototype.spqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpqt.
 */
embedsl.Expression.prototype.tpqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppqt.
 */
embedsl.Expression.prototype.ppqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpqt.
 */
embedsl.Expression.prototype.qpqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqqt.
 */
embedsl.Expression.prototype.sqqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqqt.
 */
embedsl.Expression.prototype.tqqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqqt.
 */
embedsl.Expression.prototype.pqqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqqt.
 */
embedsl.Expression.prototype.qqqt = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqqt',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sssp.
 */
embedsl.Expression.prototype.sssp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sssp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tssp.
 */
embedsl.Expression.prototype.tssp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tssp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pssp.
 */
embedsl.Expression.prototype.pssp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pssp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qssp.
 */
embedsl.Expression.prototype.qssp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qssp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stsp.
 */
embedsl.Expression.prototype.stsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttsp.
 */
embedsl.Expression.prototype.ttsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptsp.
 */
embedsl.Expression.prototype.ptsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtsp.
 */
embedsl.Expression.prototype.qtsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spsp.
 */
embedsl.Expression.prototype.spsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpsp.
 */
embedsl.Expression.prototype.tpsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppsp.
 */
embedsl.Expression.prototype.ppsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpsp.
 */
embedsl.Expression.prototype.qpsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqsp.
 */
embedsl.Expression.prototype.sqsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqsp.
 */
embedsl.Expression.prototype.tqsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqsp.
 */
embedsl.Expression.prototype.pqsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqsp.
 */
embedsl.Expression.prototype.qqsp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqsp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sstp.
 */
embedsl.Expression.prototype.sstp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sstp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tstp.
 */
embedsl.Expression.prototype.tstp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tstp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pstp.
 */
embedsl.Expression.prototype.pstp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pstp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qstp.
 */
embedsl.Expression.prototype.qstp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qstp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sttp.
 */
embedsl.Expression.prototype.sttp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sttp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tttp.
 */
embedsl.Expression.prototype.tttp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tttp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pttp.
 */
embedsl.Expression.prototype.pttp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pttp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qttp.
 */
embedsl.Expression.prototype.qttp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qttp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sptp.
 */
embedsl.Expression.prototype.sptp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sptp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tptp.
 */
embedsl.Expression.prototype.tptp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tptp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pptp.
 */
embedsl.Expression.prototype.pptp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pptp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qptp.
 */
embedsl.Expression.prototype.qptp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qptp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqtp.
 */
embedsl.Expression.prototype.sqtp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqtp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqtp.
 */
embedsl.Expression.prototype.tqtp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqtp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqtp.
 */
embedsl.Expression.prototype.pqtp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqtp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqtp.
 */
embedsl.Expression.prototype.qqtp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqtp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sspp.
 */
embedsl.Expression.prototype.sspp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sspp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tspp.
 */
embedsl.Expression.prototype.tspp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tspp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pspp.
 */
embedsl.Expression.prototype.pspp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pspp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qspp.
 */
embedsl.Expression.prototype.qspp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qspp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stpp.
 */
embedsl.Expression.prototype.stpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttpp.
 */
embedsl.Expression.prototype.ttpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptpp.
 */
embedsl.Expression.prototype.ptpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtpp.
 */
embedsl.Expression.prototype.qtpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sppp.
 */
embedsl.Expression.prototype.sppp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sppp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tppp.
 */
embedsl.Expression.prototype.tppp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tppp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pppp.
 */
embedsl.Expression.prototype.pppp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pppp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qppp.
 */
embedsl.Expression.prototype.qppp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qppp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqpp.
 */
embedsl.Expression.prototype.sqpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqpp.
 */
embedsl.Expression.prototype.tqpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqpp.
 */
embedsl.Expression.prototype.pqpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqpp.
 */
embedsl.Expression.prototype.qqpp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqpp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssqp.
 */
embedsl.Expression.prototype.ssqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsqp.
 */
embedsl.Expression.prototype.tsqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psqp.
 */
embedsl.Expression.prototype.psqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsqp.
 */
embedsl.Expression.prototype.qsqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stqp.
 */
embedsl.Expression.prototype.stqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttqp.
 */
embedsl.Expression.prototype.ttqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptqp.
 */
embedsl.Expression.prototype.ptqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtqp.
 */
embedsl.Expression.prototype.qtqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spqp.
 */
embedsl.Expression.prototype.spqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpqp.
 */
embedsl.Expression.prototype.tpqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppqp.
 */
embedsl.Expression.prototype.ppqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpqp.
 */
embedsl.Expression.prototype.qpqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqqp.
 */
embedsl.Expression.prototype.sqqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqqp.
 */
embedsl.Expression.prototype.tqqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqqp.
 */
embedsl.Expression.prototype.pqqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqqp.
 */
embedsl.Expression.prototype.qqqp = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqqp',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sssq.
 */
embedsl.Expression.prototype.sssq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sssq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tssq.
 */
embedsl.Expression.prototype.tssq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tssq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pssq.
 */
embedsl.Expression.prototype.pssq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pssq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qssq.
 */
embedsl.Expression.prototype.qssq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qssq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stsq.
 */
embedsl.Expression.prototype.stsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttsq.
 */
embedsl.Expression.prototype.ttsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptsq.
 */
embedsl.Expression.prototype.ptsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtsq.
 */
embedsl.Expression.prototype.qtsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spsq.
 */
embedsl.Expression.prototype.spsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpsq.
 */
embedsl.Expression.prototype.tpsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppsq.
 */
embedsl.Expression.prototype.ppsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpsq.
 */
embedsl.Expression.prototype.qpsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqsq.
 */
embedsl.Expression.prototype.sqsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqsq.
 */
embedsl.Expression.prototype.tqsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqsq.
 */
embedsl.Expression.prototype.pqsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqsq.
 */
embedsl.Expression.prototype.qqsq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqsq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sstq.
 */
embedsl.Expression.prototype.sstq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sstq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tstq.
 */
embedsl.Expression.prototype.tstq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tstq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pstq.
 */
embedsl.Expression.prototype.pstq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pstq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qstq.
 */
embedsl.Expression.prototype.qstq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qstq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sttq.
 */
embedsl.Expression.prototype.sttq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sttq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tttq.
 */
embedsl.Expression.prototype.tttq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tttq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pttq.
 */
embedsl.Expression.prototype.pttq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pttq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qttq.
 */
embedsl.Expression.prototype.qttq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qttq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sptq.
 */
embedsl.Expression.prototype.sptq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sptq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tptq.
 */
embedsl.Expression.prototype.tptq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tptq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pptq.
 */
embedsl.Expression.prototype.pptq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pptq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qptq.
 */
embedsl.Expression.prototype.qptq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qptq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqtq.
 */
embedsl.Expression.prototype.sqtq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqtq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqtq.
 */
embedsl.Expression.prototype.tqtq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqtq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqtq.
 */
embedsl.Expression.prototype.pqtq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqtq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqtq.
 */
embedsl.Expression.prototype.qqtq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqtq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sspq.
 */
embedsl.Expression.prototype.sspq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sspq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tspq.
 */
embedsl.Expression.prototype.tspq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tspq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pspq.
 */
embedsl.Expression.prototype.pspq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pspq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qspq.
 */
embedsl.Expression.prototype.qspq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qspq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stpq.
 */
embedsl.Expression.prototype.stpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttpq.
 */
embedsl.Expression.prototype.ttpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptpq.
 */
embedsl.Expression.prototype.ptpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtpq.
 */
embedsl.Expression.prototype.qtpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sppq.
 */
embedsl.Expression.prototype.sppq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sppq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tppq.
 */
embedsl.Expression.prototype.tppq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tppq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pppq.
 */
embedsl.Expression.prototype.pppq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pppq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qppq.
 */
embedsl.Expression.prototype.qppq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qppq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqpq.
 */
embedsl.Expression.prototype.sqpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqpq.
 */
embedsl.Expression.prototype.tqpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqpq.
 */
embedsl.Expression.prototype.pqpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqpq.
 */
embedsl.Expression.prototype.qqpq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqpq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ssqq.
 */
embedsl.Expression.prototype.ssqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ssqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tsqq.
 */
embedsl.Expression.prototype.tsqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tsqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler psqq.
 */
embedsl.Expression.prototype.psqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'psqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qsqq.
 */
embedsl.Expression.prototype.qsqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qsqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler stqq.
 */
embedsl.Expression.prototype.stqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'stqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ttqq.
 */
embedsl.Expression.prototype.ttqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ttqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ptqq.
 */
embedsl.Expression.prototype.ptqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ptqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qtqq.
 */
embedsl.Expression.prototype.qtqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qtqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler spqq.
 */
embedsl.Expression.prototype.spqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'spqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tpqq.
 */
embedsl.Expression.prototype.tpqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tpqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler ppqq.
 */
embedsl.Expression.prototype.ppqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'ppqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qpqq.
 */
embedsl.Expression.prototype.qpqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qpqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler sqqq.
 */
embedsl.Expression.prototype.sqqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'sqqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler tqqq.
 */
embedsl.Expression.prototype.tqqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'tqqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler pqqq.
 */
embedsl.Expression.prototype.pqqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'pqqq',
      null,
      [this]);
};
/**
 * @return {!embedsl.Expression} Swizzler qqqq.
 */
embedsl.Expression.prototype.qqqq = function() {
  // Generated by gen/gen-swizzlers.rb. Do not edit.
  return new embedsl.Expression(
      embedsl.Kind.SWIZZLER,
      embedsl.TypeInfo.SameBaseDim4,
      'qqqq',
      null,
      [this]);
};

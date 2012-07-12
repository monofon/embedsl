.center.middle
# Embedsl

Embedded Shading Language


.fitwidth50.framed
![Embedsl sphere example](embedsl.png)

__Henrik Tramberend__

Google Switzerland

Beuth University of Applied Sciences Berlin

---

# Graphics Hardware

## GPU

* Discrete processing unit connected to the CPU.
* Typically between 500 and 1500 unified SIMD processing cores running at 1 GHz.
* Dynamically allocated to 2 to 5 programmable stages of the rendering pipeline.

## Software

* Host language on the CPU.
* Binding to low-level graphics library, e.g. OpenGL or DirectX.
* Domain specific shader language with 3D specific types and functions for the GPU cores.

---

# WebGL 1.0 Pipeline

.fitwidth
![WebGL 1.0 Pipeline](opengl-es2-pipeline-model.png)

---

# Problems

## Composition

* Shader programs to not compose well.
* Large shader families are hard to maintain.
* Preprocessor based solution are not type-safe, ugly and fragile.

## Parameter passing

* From CPU to GPU and from pipeline stage to pipeline stage.
* Via *weakly typed* memory buffers and global variables.

## Code hygiene

* Memory buffers and global variables require a lot of *boiler plate code*.
* Type correctness can only be checked dynamically at runtime.

---

# Collateral Damage

## Language incompatibility

* No common *type and object system*.
* High-level *abstraction mechanisms* of the host language can not be used for shader programs.
* No polymorphism, type parameters, closures, continuations or module systems at the language barrier.
* *Tooling* is difficult.

## Late shader compilation

* Shader programs are compiled at run-time.
* To late for many tests and error checks.

---

# Example WebGL: Passing a Vector

## Host program

Javascript

	.javascript
	var loc = gl.getUniformLocation(shader, 'color');
	gl.uniformVec4([1, 0, 0, 1]);

## Shader program

GL Shading Language

	.cpp
	uniform vec4 color;

	void main(void) {
		gL_FragColor = color;
	}

---

# Embedsl

First prototype targeted at WebGL and Javascript.

## Approach

* Embed the shader definition into the host language.
* Provide a builder API for the shader expression tree.
* Use classes and inheritance of the host language to modularize shader programs.
* Compile the expression tree to GLSL source code.

## Shader classes

* Define shaders as Javascript constructor functions.
* Properties represent shader local variables.
* Attribute and uniform objects interface between host and shader.

---

# Inheritance

* Define inheritance relationship between shader classes.
* Shader properties can be declared virtual. 
* Derived shaders can override inherited properties.

# Composition

* Shader classes can be used as mixins on shader instances.
* Override properties out side of the inheritance hierarchy.

---

# Embedsl Example Code

## Base shader class

	.javascript
	/**
	 * Definition of a base shader.
	 *
	 * @constructor
	 * @extends {embedsl.Program}
	 */
	Base = function() {
	  this.mPosition = s.virtual(m.position);
	  this.mNormal = s.virtual(m.normal);
	  this.gl_Position(
	      s.mul(u.projection, u.view, u.model, 
	      	s.vec4(this.mPosition, 1)));
	  this.intensity = s.virtual(this.mNormal);
	  this.gl_FragColor(
	      s.vec4(this.intensity, 1));
	};
	embedsl.Program.extend(Base, embedsl.Program);

---

# Embedsl Example Code

## Derived shader class

	.javascript
	/**
	 * @constructor
	 * @extends {Base}
	 */
	Discard = function() {
	  this.dcoord = s.floor(s.mul(10, m.texcoord));
	  this.intensity.override(
	      s.discardOrElse(
	          s.eq(0, s.mod(s.add(this.dcoord.x(), 
	          					  this.dcoord.y()), 2)),
	          this.intensity.value()));
	};
	embedsl.Program.extend(Discard, Base);


---

# Embedsl Example Code

## Composition

	.javascript
	var programs = [
	  new Base(),
	  new EnvMap(),
	  new Base().mixin(Ripple),
	  new EnvMap().mixin(Ripple),
	  new Lambert().mixin(Ripple).mixin(Discard),
	  new Lambert().mixin(Ripple).mixin(DiffuseMap),
	  new Phong().mixin(DiffuseMap),
	  new Phong().mixin(Ripple),
	  new Phong().mixin(Ripple).mixin(DiffuseMap),
	  new Phong().mixin(Ripple).mixin(DiffuseMapBlur),
	  new Lambert().mixin(DiffuseMapBlur),
	  new Base().mixin(Discard)
	];

---

# Generated Shader Code

## Fragment shader (Base)

	.javascript
	attribute vec3 position;
	attribute vec3 normal;
	uniform mat4 projection;
	uniform mat4 view;
	uniform mat4 model;
	varying vec3 v0;
	 	 
	void main() {
	    vec3 mPosition = position;
	    v0 = normal;
	    gl_Position = (projection * view * model * vec4(mPosition, 1.0));
	}

---

# Generated Shader Code

## Fragment shader (Base)

	.javascript
	precision highp int;
	precision highp float;
	 
	varying vec3 v0;
	 
	void main() {
	    vec3 mNormal = v0;
	    vec3 intensity = mNormal;
	    gl_FragColor = vec4(intensity, 1.0);
	}

---

# Embedsl Demo

.framed.fitwidth
[![Embedsl sphere example](embedsl.png)](../examples/sphere.html)

[Live Example](../examples/sphere.html)

---

# Benefits

## Composability

* Embedsl shaders compose well.

## No boiler plate

* Uniform and attribute definitions are generated.
* Varyings for attribute plumbing are auto-generated.

## More type safety

* Closure compiler type annotations can be used.
* Static type checking at build-time is possible.

## Optimization and tooling

* Many opportunities for shader optimization at AST level.
* Code instrumentation for debugging and testing.

---

# The End

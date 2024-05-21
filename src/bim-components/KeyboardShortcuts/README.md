<p align="center">
  <a href="https://thatopen.com/">TOC</a>
  |
  <a href="https://docs.thatopen.com/intro">documentation</a>
  |
  <a href="https://thatopen.github.io/engine_components/src/fragments/FragmentIfcLoader/index.html">demo</a>
  |
  <a href="https://people.thatopen.com/">community</a>
  |
  <a href="https://www.npmjs.com/package/openbim-components">npm package</a>
</p>

This library is a collection of BIM tools based on [Three.js](https://github.com/mrdoob/three.js/) and other libraries. It includes pre-made features to easily build browser-based 3D BIM applications, such as postproduction, dimensions, floorplan navigation, DXF export and much more. 

### Usage

Import the 

```js
import * as THREE from "three";
import * as OBC from "openbim-components";

// Get the <div> element where the scene will be displayed

const container = document.getElementById('container');

// Initialize the basic components needed to use this library

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
components._renderer = new OBC.SimpleRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

// Add some elements to the scene

components.scene.setup();

const scene = components.scene.get();

const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshStandardMaterial({ color: "red" });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 1.5, 0);
scene.add(cube);

components.meshes.push(cube);
```



[npm]: https://img.shields.io/npm/v/openbim-components
[npm-url]: https://www.npmjs.com/package/openbim-components
[npm-downloads]: https://img.shields.io/npm/dw/openbim-components

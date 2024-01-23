'use strict'


// ------------------------------ IMPORTS ------------------------------- //


// importing three.js
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


// ------------------------------ THREE D VIEWER ------------------------------- //


export class ThreeDViewer {
    cameraPerspective: number
    scene: THREE.Scene
    viewer: HTMLElement
    viewerRect: DOMRect
    aspectRatio: number
    renderer: THREE.WebGL1Renderer
    camera: THREE.PerspectiveCamera
    directionalLight: THREE.DirectionalLight
    ambientLight: THREE.AmbientLight
    geometry: THREE.BoxGeometry
    material: THREE.Material | THREE.MeshStandardMaterial
    mesh: THREE.Mesh
    cameraControls: OrbitControls

    constructor(domElementViewer: string,
        ambientLightIntensity: number,
        cameraPosition: number,
        geometry: THREE.BoxGeometry | undefined = undefined,
        material: THREE.Material | THREE.MeshStandardMaterial | undefined = undefined,
        ) {
        this.scene = new THREE.Scene()
        try {
            this.viewer = document.getElementById(domElementViewer) as HTMLElement
        } catch (error) {
            console.log(error)
        }
        this.cameraPerspective = 75
        this.viewerRect = this.viewer.getBoundingClientRect()
        this.updateAspectRatio()
        this.renderer = new THREE.WebGL1Renderer()
        this.viewer.append(this.renderer.domElement)
        this.updateRenderSize()
        this.camera = new THREE.PerspectiveCamera(this.cameraPerspective, this.aspectRatio)
        console.log(this.camera)
        this.directionalLight = new THREE.DirectionalLight()
        this.ambientLight = new THREE.AmbientLight()
        if ( geometry === undefined ) {
            this.geometry = new THREE.BoxGeometry() // creating geometry to see in viewer
        } else {
            this.geometry = geometry
        }
        if ( material === undefined ) {
            this.material = new THREE.MeshStandardMaterial() // create material using threejs for mesh below
        } else {
            this.material = material
        }
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.setAmbientLightIntensity(ambientLightIntensity)
        this.setCameraPosition(cameraPosition)
        this.updateScene()
        this.cameraControls = new OrbitControls(this.camera, this.viewer)
        this.renderScene()
        // this.resize() // calling event listener
    }
    
    updateRenderSize() {
        this.viewerRect = this.viewer.getBoundingClientRect()
        this.renderer.setSize(this.viewerRect.width, this.viewerRect.height)
    }

    updateAspectRatio() {
        this.aspectRatio = this.viewerRect.width / this.viewerRect.height
        this.camera = new THREE.PerspectiveCamera(this.cameraPerspective, this.aspectRatio) // need to create a new one
        // // here, else this.camera when this is run will be undefined.. not sure why
        console.log(this.camera)
        this.camera.aspect = this.aspectRatio
    }

    setAmbientLightIntensity(i: number) {
        this.ambientLight.intensity = i
    }

    setCameraPosition(pos: number) {
        this.camera.position.z = pos
    }

    updateScene() {
        this.scene.add(this.mesh, this.directionalLight, this.ambientLight)
    }

    renderScene() {
        // this will allow to run a function the next time the browser creates or renders a "frame" (fps)
        window.requestAnimationFrame(() => this.renderScene())
        // FINAL SETUP (this code needs to be at the end!!!) this takes frames (fps) frames (pictures) per second
        // so in order to capture all threeD viewer changes or additions, we need this at the end
        // need to tell the renderer the camera and the scene to use
        this.renderer.render(this.scene, this.camera)
    }

    resize() {
        window.addEventListener("resize", () => {
            // this.updateRenderSize()
            // this.updateAspectRatio()
            console.log(this.viewerRect.width, this.viewerRect.height)
            this.viewerRect = this.viewer.getBoundingClientRect()
            this.renderer.setSize(this.viewerRect.width, this.viewerRect.height)
            this.aspectRatio = this.viewerRect.width / this.viewerRect.height
            this.camera.aspect = this.aspectRatio
        })
    }
}







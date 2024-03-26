
// ------------------- importing three.js -------------------- //


import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as OBC from "openbim-components"


// ------------------------ viewer 3D --------------------------- //

export function ThreeDViewer() {
    // can use OBC components library to do what we did above but simplified
// creating the viewer component
const viewer = new OBC.Components()

// creating the scene component
const sceneComponent = new OBC.SimpleScene(viewer)
viewer.scene = sceneComponent
sceneComponent.setup() // applies directional light etc.. refer to source code
// by holding alt and clicking the 'get()' method and then at the top selecting index-d.ts and selecting
// the index.js file

// can get the threejs scene by doing the following
const scene = sceneComponent.get()

// setting up the renderer
const viewerContainer = document.getElementById("viewer") as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

// setting up camera component
const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

// setting up the raycaster component
const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

// call init to start to render the scene
// this is doing similar thing as we did in renderscene function

// renderScene() {
//     // this will allow to run a function the next time the browser creates or renders a "frame" (fps)
//     window.requestAnimationFrame(() => this.renderScene())
//     // FINAL SETUP (this code needs to be at the end!!!) this takes frames (fps) frames (pictures) per second
//     // so in order to capture all threeD viewer changes or additions, we need this at the end
//     // need to tell the renderer the camera and the scene to use
//     this.renderer.render(this.scene, this.camera)
// }

// creating simple mesh to display in viewer
// const geometry = new THREE.BoxGeometry() // creating geometry to see in viewer
// const material = new THREE.MeshStandardMaterial({color: '#4287f5'}) // create material using threejs for mesh below
// const mesh = new THREE.Mesh(geometry, material)

// need to call the viewer.init() method after we have setup the scene the renderer and the camera..
viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true // need to call this after viewer.init()
// scene.add(mesh) // add geometry to scene
// viewer.meshes.add(mesh)

// IFC LOADER

// creating ifcloader component from fragments library
const ifcLoader = new OBC.FragmentIfcLoader(viewer)
// need to do the below because ifc module from open BIM components needs additional files for loading and 
// working with ifc's
ifcLoader.settings.wasm = {
    path: "https://unpkg.com/web-ifc@0.0.43/",
    absolute: true
}


// FULL SCREEN BUTTON
const fullScreenBtn = new OBC.Button(viewer);
fullScreenBtn.materialIcon = "info";
fullScreenBtn.tooltip = "Full screen";

// EXIT FULL SCREEN BUTTON
const exitFullScreenBtn = new OBC.Button(viewer);
exitFullScreenBtn.materialIcon = "handshake";
exitFullScreenBtn.tooltip = "Exit full screen";

// DIMENSIONS

const dimensions = new OBC.AreaMeasurement(viewer);
dimensions.enabled = true;
dimensions.snapDistance = 1;
// const viewerTest = document.getElementById("viewer")
// viewer.ondblclick = () => dimensions.create();
// viewerTest.oncontextmenu = () => dimensions.endCreation();


// SELECTOR
const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()

// LETS US GROUP ELEMENTS
const classifier = new OBC.FragmentClassifier(viewer)
// CREATING WINDOW FOR MODEL VIEWER
const classificationWindow = new OBC.FloatingWindow(viewer)
viewer.ui.add(classificationWindow)

// IFCLOADED EVENT
// OBC has built in event handlers. this one will get triggered when ifc is loaded
ifcLoader.onIfcLoaded.add(async (model) => {
    highlighter.update()
    console.log('MODEL IFC - ', model)
    classifier.byStorey(model)
    classifier.byEntity(model)
    console.log("CLASSIFIER", classifier.get())
    // fragment tree will create a UI for the groups based on the classifier
    const fragmentTree = new OBC.FragmentTree(viewer)
    await fragmentTree.init()
    await fragmentTree.update(['storeys', 'entities'])
    const tree = fragmentTree.get().uiElement.get("tree") // gets the html element for the fragment tree
    // now need to append the html element to the classification window. All UI compoenents have the addChild method
    // which allows you to append html to it
    classificationWindow.addChild(tree)
})

// TOOLBAR

const toolbar = new OBC.Toolbar(viewer)

toolbar.addChild(dimensions.uiElement.get("main"));

// all tools come with uiElement object that has all the premade user interface that the ifcloader object has
// it is html code behind the scenes that gets added. 
// its a uiElement with a get method that we pass in the name of the uiElement we want to get
// now as you can see, the "main" is oof type OBC.SimpleUIComponent. This OBC.SimpleUIComponent object contains the html for the button
// can use the OBC.Toolbar object and use the addChild method to add the SimpleUIComponent object
toolbar.addChild(ifcLoader.uiElement.get("main"))

// ADDING FULL SCREEN / EXIT BUTTONS TO UI
toolbar.addChild(fullScreenBtn);
toolbar.addChild(exitFullScreenBtn);

// append the OBC.Toolbar to the viewer object
viewer.ui.addToolbar(toolbar)


// FULL SCREEN BUTTON EVENT LISTENER
fullScreenBtn.onClick.add(() => {
    const viewerHTML = document.getElementById("viewer")
    if ( !viewerHTML ) return
    viewerHTML.requestFullscreen()
});


exitFullScreenBtn.onClick.add(() => {
    // const viewerHTML = document.getElementById("viewer")
    // if ( !viewerHTML ) return
    document.exitFullscreen()
});


// ------------------------------------- TESTING ADDING TOOL TO ANY DIV ELEMENT --------------------------------------- //


// const componentTools = new OBC.Components()

// const btnTest = new OBC.Button(componentTools);
// btnTest.materialIcon = "info";
// btnTest.tooltip = "Full screen";


// const tools = new OBC.Toolbar(componentTools)

// tools.addChild(btnTest)

}





// ------------------------------ THREE D VIEWER USING THREEJS ------------------------------- //



// const threeDViewer = new ThreeDViewer('viewer-test', 0.4, 5)
// threeDViewer.addAxisHelper()
// // threeDViewer.addGridHelper(10, 10)

// // -------- setting threeD viewers grid ------- //
// threeDViewer.gridHelper.setMaterialOpacity(0.4)
// threeDViewer.gridHelper.setMaterialTransparent(true)
// threeDViewer.gridHelper.setColor("#808080")

// // ------ threeD viewer GUI config ------- //

// // postion control
// threeDViewer.gui.cubeControls.add(threeDViewer.mesh.position, "x", -10, 10, 1) // can leave with just "x" for num input
// // or for num slider specify min max and step
// threeDViewer.gui.cubeControls.add(threeDViewer.mesh.position, "y", -10, 10, 1)
// threeDViewer.gui.cubeControls.add(threeDViewer.mesh.position, "z", -10, 10, 1)
// threeDViewer.gui.cubeControls.add(threeDViewer.mesh, "visible")
// threeDViewer.gui.cubeControls.addColor(threeDViewer.material, "color")
// // directional light controls
// threeDViewer.gui.directionalLightControls.addColor(threeDViewer.directionalLight, "color")
// threeDViewer.gui.directionalLightControls.add(threeDViewer.directionalLight.position, "x", -10, 10, 1)
// threeDViewer.gui.directionalLightControls.add(threeDViewer.directionalLight.position, "y", -10, 10, 1)
// threeDViewer.gui.directionalLightControls.add(threeDViewer.directionalLight.position, "z", -10, 10, 1)

// threeDViewer.gui.directionalLightControls.add(threeDViewer.directionalLight, "intensity", 0, 10, 1)
// threeDViewer.addSpotLight([0, 0, 10], "#fc0320")
// threeDViewer.addSpotLight([30, 10, 0], "#d5e310")

// // load obj file into threeJS
// threeDViewer.loader.objLoad("../Assets/Gear/Gear1.mtl", "../Assets/Gear/Gear1.obj")
// // load an gltf file into threeD viewer
// threeDViewer.loader.loadGLTF("./Assets/GLTFSample/Avocado.gltf")


// ------------------- THREE D VIEWER USING OBC (OPEN BIM COMPONENTS FROM THAT OPEN ENGINE) ------------------------- //

// const components = new OBC.Components()
// const mainToolbar = new OBC.Toolbar(components);
// mainToolbar.name = "Main toolbar";
// components.ui.addToolbar(mainToolbar);


// const alertButton = new OBC.Button(components);
// alertButton.materialIcon = "info";
// alertButton.tooltip = "Information";
// mainToolbar.addChild(alertButton);
// alertButton.onClick.add(() => {
// alert('I\'ve been clicked!');
// });
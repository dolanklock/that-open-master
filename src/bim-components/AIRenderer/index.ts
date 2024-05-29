
import { v4 as uuidv4 } from 'uuid'
import  *  as OBC from "openbim-components"
import {LibraryUIComponent} from "./src/libraryUIComponent"

// const processURL = "https://stablediffusionapi.com/api/v3/img2img";
// const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Avoids CORS locally
// const uploadUrl = "https://stablediffusionapi.com/api/v3/base64_crop";


// TODO: check if fetch in _uploadRender method is failing or if its the test() fetch that is...


export class StableDiffusionRender {
    APIKey = "5Dc5hLuEiPd9ie3PKG6Tv51hXDLlhU52iTOwPhqL6FJZdj6OC5cCYrngMpEq"
    proxyURL: string
    uploadURL: string
    processURL: string
    private _components: OBC.Components

    settings = {
      prompt: "", // Indications to the AI engine
      negative_prompt: null, // Indications to be avoided by the AI engine
      width: "128", // Maximum 1024
      height: "128", // Maximum 1024
      samples: "1", // Maximum 4
      num_inference_steps: "30",
      safety_checker: "no",
      enhance_prompt: "yes",
      guidance_scale: "10", // cifras en string, min 1, max 20
      strength: 0.7, // Intensity of change, min 0, max 1
      seed: null, // If null, it will be randomly generated
      webhook: null,
      track_id: null,
    };

    constructor(components: OBC.Components, proxyURL: string, uploadURL: string, processURL: string) {
        this._components = components
        this.processURL = processURL
        this.proxyURL = proxyURL
        this.uploadURL = uploadURL
    }

    private _takeScreenshot() {
        const postproductionRenderer = this._components.renderer as OBC.PostproductionRenderer
        console.log("HERE", postproductionRenderer)
        postproductionRenderer.postproduction.composer.render()
        const renderer = postproductionRenderer.get();
        const image = renderer.domElement.toDataURL("image/png");
        return image
    }

    private async _uploadRender(APIKey: string, image: string) {
        // api key shouldn't be in your code on production, but on an environment variable  
        // Let's upload the render to stable diffusion
        const url = this.proxyURL + this.uploadURL;
        const crop = "false";
    
        const rawUploadResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ APIKey, image, crop }),
        });
    
        const uploadResponse = await rawUploadResponse.json();
        
        if (!uploadResponse.link) {
            throw new Error("There was a problem with the upload!");
        }
        return uploadResponse.link
    }
    async render(APIKey: string) {
        const image = this._takeScreenshot()
        console.log("IMAGE", image)
        const uploadedImageURL = this._uploadRender(this.APIKey, image)
        const params = {
            APIKey,
            init_image: uploadedImageURL,
            ...this.settings,
        };
        // Image uploaded! Now, let's process it:
        const rawResponse = await fetch(this.processURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });
    
        const response = await rawResponse.json();
    
        if (response.status === "success") {
            return response.output as string[];
        } else {
            throw new Error("Something went wrong rendering");
        }
        
    }
    async test(APIKey: string) {
        const image = this._takeScreenshot()
        console.log("IMAGE", image)
        const uploadedImageURL = this._uploadRender(this.APIKey, image)
        console.log(image)
        // 1. take capture of scene for sending to SD api
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "key": APIKey,
            "prompt": "a cat sitting on a bench",
            "negative_prompt": "bad quality",
            "init_image": uploadedImageURL,
            "width": "512",
            "height": "512",
            "samples": "1",
            "temp": false,
            "safety_checker": false,
            "strength":0.7,
            "seed": null,
            "webhook": null,
            "track_id": null,
        });

        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        };
        // const url = this.proxyURL + "https://modelslab.com/api/v6/realtime/img2img"
        const url = "https://modelslab.com/api/v6/realtime/img2img"
        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        // 2. send captured image to SD for rendering

        // 3. get response from SD with finished image

        // 4. save image to libarary and display in UI
    }
  }

export class AIRenderer extends OBC.Component<LibraryUIComponent> implements OBC.UI{
    enabled: boolean = true
    static uuid: string = uuidv4()
    private _components: OBC.Components
    private _APIKey: string
    proxyURL: string
    uploadURL: string
    processURL: string
    renderer: StableDiffusionRender
    uiElement = new OBC.UIElement<{activationBtn: OBC.Button, LibraryUIComponent: LibraryUIComponent}>()

    constructor(components: OBC.Components, APIKey: string, proxyURL: string, uploadURL: string, processURL: string) {
        super(components)
        this._components = components
        this._components.tools.add(AIRenderer.uuid, this)
        this._APIKey = APIKey
        this._setUI()
        this.processURL = processURL
        this.proxyURL = proxyURL
        this.uploadURL = uploadURL
        this.renderer = new StableDiffusionRender(this._components, this.proxyURL, this.uploadURL, this.processURL)
    }

    private _setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "construction"
        const promptUIBtn = new OBC.Button(this._components)
        promptUIBtn.materialIcon = "construction"
        promptUIBtn.onClick.add(() => {
            form.visible = true
        })
        activationBtn.addChild(promptUIBtn)
        const form = new OBC.Modal(this._components)
        form.title = "AI Renderer"
        this._components.ui.add(form)
        form.onCancel.add(() => {
            form.visible = !form.visible
        })
        form.onAccept.add(async () => {
            form.visible = false
            this.renderer.render(this._APIKey).then(() => {
                console.log("finished render")
            }).catch((err) => {
                console.log("ERRRRR", err)
            })
        })
        // form input
        const todoDescriptionInput = new OBC.TextArea(this._components)
        todoDescriptionInput.label = "Prompt AI"
        form.slots.content.addChild(todoDescriptionInput)
        form.slots.content.get().style.padding = "20px"
        form.slots.content.get().style.display = "flex"
        form.slots.content.get().style.flexDirection = "column"
        form.slots.content.get().style.rowGap = "20px"

        const libraryFloatingWindow = new OBC.FloatingWindow(this._components)
        this._components.ui.add(libraryFloatingWindow)
        libraryFloatingWindow.visible = false
        libraryFloatingWindow.title = "Keyboard Shortcuts"
        const libraryUI = new LibraryUIComponent(this._components)
        libraryFloatingWindow.addChild(libraryUI)
        const libraryUIBtn = new OBC.Button(this._components)
        libraryUIBtn.materialIcon = "construction"
        libraryUIBtn.onClick.add(() => {
            libraryFloatingWindow.visible = true
        })
        activationBtn.addChild(libraryUIBtn)
        this.uiElement.set({activationBtn, LibraryUIComponent: libraryUI})
    }
    /**
     * sends image to stable diffusion and fetches api and returns image generated
     */
    private async _renderImage() {
        
    }

    private _saveImage() {

    }


    dispose() {
    }

    get(): any {
        return undefined
    }
}


// should have a button for generate which will open dialog for user to input text.
// what is showing in the scene is what will be sent to SD API

// library should have thumbnail of small image with time stamp underneath and descirption of render. should
// be able to click on thumbnail and enlarge image to view

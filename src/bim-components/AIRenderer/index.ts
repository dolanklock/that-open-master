
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
        // This shouldn't be in your code on production, but on an environment variable
        const key = "5Dc5hLuEiPd9ie3PKG6Tv51hXDLlhU52iTOwPhqL6FJZdj6OC5cCYrngMpEq";

        const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Avoids CORS locally
        const uploadUrl = "https://modelslab.com/api/v3/base64_crop";
        const processURL = "https://modelslab.com/api/v6/realtime/img2img";

        // Let's upload the render to stable diffusion
        const url = this.proxyURL + this.uploadURL;
        const crop = "false";
        
        const req = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, image, crop }),
        })
        const res = await req.json()
        const imageURL = res.link
        return imageURL
    }
    async render(APIKey: string) {
        // const image = this._takeScreenshot()
        // const imageURL = await this._uploadRender(this.APIKey, image)
        // const params = {
        //     key: this.APIKey,
        //     init_image: imageURL,
        //     ...this.settings,
        //   };
          
        //   const rawResponse = await fetch(this.processURL, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(params),
        //   })
      
        //   const response = await rawResponse.json();
        //   console.log("RESPONSE HERE", response)
        //   if (response.status === "success") {
        //     return response.output as string[];
        //   } else {
        //     throw new Error("Something went wrong rendering");
        //   }
        const image = this._takeScreenshot()
        const uploadedImageURL = await this._uploadRender(this.APIKey, image)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            key: APIKey,
            prompt: "building with glass exterior",
            negative_prompt: "bad quality",
            init_image: uploadedImageURL,
            width: "800",
            height: "800",
            samples: "1",
            temp: false,
            safety_checker: false,
            strength:0.7,
            seed: null,
            webhook: null,
            track_id: null,
        });
        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        };
        const url = this.proxyURL + this.processURL
        const rawResponse = await fetch(url, requestOptions)
        console.log(rawResponse)
        const response = await rawResponse.json()
        console.log(response.output as string[])
        
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

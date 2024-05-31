
import { v4 as uuidv4 } from 'uuid'
import  *  as OBC from "openbim-components"
import {LibraryUIComponent} from "./src/LibraryUIComponent"
import {RibbonUIComponent} from "./src/RibbonUIComponent"
import {SettingsUIComponent} from "./src/SettingsUIComponent"

// const processURL = "https://stablediffusionapi.com/api/v3/img2img";
// const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Avoids CORS locally
// const uploadUrl = "https://stablediffusionapi.com/api/v3/base64_crop";


// TODO: check if fetch in _uploadRender method is failing or if its the test() fetch that is...

// build tool as a bim-panel for toolbar with tools for updating width, height, etc, of render settings available?

// TODO: need to update so API key is not in code base - refer to open companny master class for how to avoid it
// "This shouldn't be in your code on production, but on an environment variable"

// TODO: figure out better way to implement loader. if someone doesnt have loader in html then this will throw error
// have way to integrate loader without user needing to do anything

export class StableDiffusionRender {
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

    /**
     * takes a screen shot of the viewer scene and returns the image as png
     * @returns 
     */
    private _takeScreenshot() {
        const postproductionRenderer = this._components.renderer as OBC.PostproductionRenderer
        console.log("HERE", postproductionRenderer)
        postproductionRenderer.postproduction.composer.render()
        const renderer = postproductionRenderer.get();
        const image = renderer.domElement.toDataURL("image/png");
        return image
    }

    /**
     * uploads image to SD and gets the image url from it
     * @param APIKey 
     * @param image 
     * @returns 
     */
    private async _uploadRender(APIKey: string, image: string) {
        const url = this.proxyURL + this.uploadURL;
        const crop = "false";
        
        const req = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ APIKey, image, crop }),
        })
        const res = await req.json()
        const imageURL = res.link
        return imageURL
    }

    /**
     * sends post request to SD to render the image that we uploaded with the given prompt
     * @param APIKey 
     * @param prompt 
     * @returns 
     */
    async render(APIKey: string, prompt: string) {
        const image = this._takeScreenshot()
        const uploadedImageURL = await this._uploadRender(APIKey, image)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            key: APIKey,
            prompt: prompt,
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
        return response.output as string[]
        
    }
  }

export class AIRenderer extends OBC.Component<RibbonUIComponent> implements OBC.UI{
    enabled: boolean = true
    static uuid: string = uuidv4()
    private _components: OBC.Components
    private _APIKey: string
    proxyURL: string
    uploadURL: string
    processURL: string
    renderer: StableDiffusionRender
    uiElement = new OBC.UIElement<{RibbonUIComponent: RibbonUIComponent}>()

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
        const form = new OBC.Modal(this._components)
        form.title = "AI Renderer"
        this._components.ui.add(form)
        form.onCancel.add(() => {
            form.visible = !form.visible
        })
        form.onAccept.add(async () => {
            const prompt = formPrompt.value
            if (!prompt) {
                alert("Enter a prompt!")
            } else {
                form.visible = false
                const loader = document.querySelector(".loader") as HTMLDivElement
                try {
                    loader.classList.toggle("hide")
                    const renderedImages = await this.renderer.render(this._APIKey, prompt)
                    loader.classList.toggle("hide")
                    if (!renderedImages) {
                        throw new Error("Something went wrong")
                    }
                } catch (error) {
                    loader.classList.toggle("hide")
                    alert(error)
                }
            }
        })
        // form input
        const formPrompt = new OBC.TextArea(this._components)
        formPrompt.label = "Prompt AI"
        form.slots.content.addChild(formPrompt)
        form.slots.content.get().style.padding = "20px"
        form.slots.content.get().style.display = "flex"
        form.slots.content.get().style.flexDirection = "column"
        form.slots.content.get().style.rowGap = "20px"

        // library UI
        const libraryFloatingWindow = new OBC.FloatingWindow(this._components)
        this._components.ui.add(libraryFloatingWindow)
        libraryFloatingWindow.visible = false
        libraryFloatingWindow.title = "AI Rendering Library"
        const libraryUI = new LibraryUIComponent(this._components)
        libraryFloatingWindow.addChild(libraryUI)
    
        // render settings UI
        const settingsFloatingWindow = new OBC.FloatingWindow(this._components)
        settingsFloatingWindow.title = "Render Settings"
        this._components.ui.add(settingsFloatingWindow)
        settingsFloatingWindow.visible = false

        // main ribbon UI
        const ribbonUI = new RibbonUIComponent(this._components)
        ribbonUI.onRenderclick.add(() => {
            form.visible = true
        })
        ribbonUI.onSettingsclick.add(() => {
            settingsFloatingWindow.visible = true
        })
        ribbonUI.onLibraryclick.add(() => {
            libraryFloatingWindow.visible = true
        })

        this.uiElement.set({RibbonUIComponent: ribbonUI})
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

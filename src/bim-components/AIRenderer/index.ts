
import { v4 as uuidv4 } from 'uuid'
import  *  as OBC from "openbim-components"
import {LibraryUIComponent} from "./src/LibraryUIComponent"
import {RibbonUIComponent} from "./src/RibbonUIComponent"
import {SettingsUIComponent} from "./src/SettingsUIComponent"
import {StableDiffusionRender} from "./src/StableDiffusionRender"

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
                    if (!renderedImages) {
                        loader.classList.toggle("hide")
                        throw new Error("Something went wrong")
                    } else {
                        for ( const imageURL of renderedImages ) {
                            libraryUI.addRenderCard(imageURL, "testing")
                        }
                    }
                    loader.classList.toggle("hide")
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
            libraryUI.addRenderCard("https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/38474b53-cf68-4e78-8ac5-e4e34a46ea4b-0.png", "Building Render")
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

// TODO: check if fetch in _uploadRender method is failing or if its the test() fetch that is...

// build tool as a bim-panel for toolbar with tools for updating width, height, etc, of render settings available?

// TODO: need to update so API key is not in code base - refer to open companny master class for how to avoid it
// "This shouldn't be in your code on production, but on an environment variable"

// TODO: figure out better way to implement loader. if someone doesnt have loader in html then this will throw error
// have way to integrate loader without user needing to do anything

// should have a button for generate which will open dialog for user to input text.
// what is showing in the scene is what will be sent to SD API

// library should have thumbnail of small image with time stamp underneath and descirption of render. should
// be able to click on thumbnail and enlarge image to view

import * as OBC from "openbim-components"
import {Gallery} from "./DexieDB"

export class LibraryCard extends OBC.SimpleUIComponent {
    imageURL: string
    title: string
    date: string
    components: OBC.Components
    onclick = new OBC.Event()
    // TODO: add click event on cards which will open image and enlarge it
    // TODO: add ability to edit caard title?
    // add export options to export all renders? and be able to import to library again??
    constructor(components: OBC.Components, imageURL: string, title: string, date: string) {
        const template = `
                <div>
                    <p>${title}</p>
                    <img id="image" src="${imageURL}"></img>
                    <p id="date">${date}</p> 
                </div>
            `
        super(components, template)
        this.components = components
        this.imageURL = imageURL
        this.title = title
        this.date = date
        this.get().style.display = "flex"
        this.get().style.flexDirection = "column"
        this.get().style.rowGap = "10px"
        this.get().style.alignItems = "center"
        this.get().style.justifyContent = "center"
        this.get().style.width = "150px"
        this.get().style.maxWidth = "150px"
        this.get().style.minWidth = "150px"
        this.get().style.height = "auto"
        this.get().style.backgroundColor = "#22272e"
        this.get().style.borderRadius = "8px"
        this.get().style.padding = "15px"
        this.getInnerElement("image")!.style.cursor = "pointer"
        this.getInnerElement("image")!.style.width = "150px"
        this.getInnerElement("image")!.style.height = "auto"
        this.getInnerElement("image")!.style.borderRadius = "8px"
        this.getInnerElement("image")!.style.border = "1px solid darkgray"
        this.getInnerElement("date")!.style.fontSize = "10px"
        this.getInnerElement("date")!.style.color = "darkgray"
        const form = new OBC.Modal(this._components)
        form.title = "Render Enlarged"
        this._components.ui.add(form)
        this.getInnerElement("image")!.addEventListener("click", (e: Event) => {
            console.log("clocked")
            form.visible = true
            const image = this.getInnerElement("image")!.cloneNode(true) as HTMLImageElement
            image!.style.width = "800px"
            image!.style.height = "auto"
            image!.style.border = "none"
            form.slots.content.domElement.insertAdjacentElement("beforeend", image!)
        })
        form.onAccept.add(() => {
            form.visible = false
            form.slots.content.domElement.innerHTML = ""
            
        })
    }
}

export class LibraryUIComponent extends OBC.SimpleUIComponent {
    onclick = new OBC.Event()
    private _gallery: Gallery
    private _cardLibrary: LibraryCard[] = []
    constructor(components: OBC.Components) {
        const template = `
        <div id="library-container">
            
        </div>
        `
        super(components, template)
        this._gallery = new Gallery()
        this.get().style.display = "grid"
        this.get().style.gridTemplateColumns = "repeat(auto-fill, minmax(150px, 150px))"
        this.get().style.gap = "30px 30px"
        this.get().style.padding = "20px 20px 20px 0"
    }
    addRenderCard(imageURL: string, title: string) {
        const date = new Date().toDateString()
        this._gallery.save(imageURL, title, date)
        const card = new LibraryCard(this._components, imageURL, title, date)
        this._cardLibrary.push(card)
        this.get().insertAdjacentElement("beforeend", card.get())
    }

    getLibraryCard(id: string) {
        return this._cardLibrary.find((card) => {
            if ( card.id === id ) return card
        })
    }

    update() {

    }


}

import * as OBC from "openbim-components"

export class LibraryCard extends OBC.SimpleUIComponent {
    imageURL: string
    title: string
    prompt: string
    components: OBC.Components
    onclick = new OBC.Event()
    // TODO: add click event on cards which will open image and enlarge it
    // TODO: add ability to edit caard title?
    // add export options to export all renders? and be able to import to library again??
    constructor(components: OBC.Components, imageURL: string, title: string, prompt: string) {
        const template = `
                <div>
                    <p>Title: </p>
                    <p>Date: ${new Date().toDateString()}</p> 
                    <p>Prompt: </p>
                    <img src="${imageURL}"></img>
                </div>
            `
        super(components, template)
        this.components = components
        this.imageURL = imageURL
        this.title = title
        this.prompt = prompt
        this.get().style.display = "flex"
        this.get().style.flexDirection = "column"
        this.get().style.width = "200x"
        this.get().style.height = "200px"
        this.get().style.backgroundColor = "#22272e"
        this.get().style.borderRadius = "8px"
        this.get().style.padding = "15px"
    }
}

export class LibraryUIComponent extends OBC.SimpleUIComponent {
    onclick = new OBC.Event()
    private _cardLibrary: LibraryCard[] = []
    constructor(components: OBC.Components) {
        const template = `
        <div id="library-container">
            
        </div>
        `
        super(components, template)
        this.get().style.display = "grid"
        this.get().style.gridTemplateColumns = "repeat(auto-fill, minmax(var(--card-width), 1fr))"
        this.get().style.gap = "30px 30px"
        this.get().style.padding = "20px 20px 20px 0"
    }
    addRenderCard(imageURL: string, title: string, prompt: string) {
        const card = new LibraryCard(this._components, imageURL, title, prompt)
        this._cardLibrary.push(card)
        this.get().insertAdjacentElement("beforeend", card.get())
    }
    getLibraryCard(id: string) {
        return this._cardLibrary.find((card) => {
            if ( card.id === id ) return card
        })
    }


}

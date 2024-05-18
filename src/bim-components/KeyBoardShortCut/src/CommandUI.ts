import * as OBC from "openbim-components"

import { dateFormat } from "../../../ProjectFunctions"

export class CommandUIComponent extends OBC.SimpleUIComponent {
    constructor(components: OBC.Components, id: string, commandName: string) {
        // for the template we can use whatever html we want.. this is the poin tof why we are creating
        // our own custom SimpleUIComponent, so we can have a custom HTML item and add it inside of another UI compontent
        // Anytime we need to add a custom UI component with unique HTML that we cant do with out of the box
        // UI components, we need to create our own custom ones just like this
        const template = `
            <div class="command-line" data-uuid=${id}>
                <p class="command">${commandName}</p>
            </div>
        `
        super(components, template)
        this.get().style.border = "none"
    }
    
}

export class ShortcutUIComponent extends OBC.SimpleUIComponent {
    onclick = new OBC.Event()
    constructor(components: OBC.Components, id: string, shortcut: string) {
        // for the template we can use whatever html we want.. this is the poin tof why we are creating
        // our own custom SimpleUIComponent, so we can have a custom HTML item and add it inside of another UI compontent
        // Anytime we need to add a custom UI component with unique HTML that we cant do with out of the box
        // UI components, we need to create our own custom ones just like this
        const template = `
        <div class="command-line" data-uuid=${id}>
            <p class="key">${shortcut}</p>
        </div>
    `
        super(components, template)
        this.get().addEventListener("click", (e: Event) => {
            this.onclick.trigger(e)
        })
        this.get().style.cursor = "pointer"
        this.get().style.border = "none"
        this.get().style.backgroundColor = "lightgray"
        this.get().style.borderRadius = "8px"
        this.get().style.padding = "6px"
        this.get().style.display = "flex"
        this.get().style.justifyContent = "center"
        this.get().style.alignItems = "center"
        

        
    }
}
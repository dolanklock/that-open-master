import * as OBC from "openbim-components"

export class AIRendererUI extends OBC.SimpleUIComponent {
    onclick = new OBC.Event()
    constructor(components: OBC.Components) {
        const template = `
        <bim-toolbar-section label="AI Renderer">
            <bim-button id="load-ifc" vertical label="Render" icon="lets-icons:load-list"></bim-button>
            <bim-button id="import-ifc" vertical label="Render Settings" icon="lets-icons:load-list-light"></bim-button>
        </bim-toolbar-section>
        `
        super(components, template)ß
    }
}
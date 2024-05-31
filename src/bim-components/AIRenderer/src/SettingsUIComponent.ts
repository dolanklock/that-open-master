import * as OBC from "openbim-components"

export class SettingsUIComponent extends OBC.SimpleUIComponent {
    onclick = new OBC.Event()
    constructor(components: OBC.Components) {
        const template = `
        <div id="shortcut-container" style="color: white; background-color: transparent; width: 100%; height: 100%; border: none; padding: 0px; box-sizing: border-box; display: flex; flex-direction: column; row-gap: 25px;">
            
        </div>
        `
        super(components, template)
    }
}
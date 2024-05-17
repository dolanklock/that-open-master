import * as OBC from "openbim-components"

export class KeyBoardShortcutUIComponent extends OBC.SimpleUIComponent {
    appendChild(e: HTMLElement) {
        this.getInnerElement("commands")!.append(e)
    }
    constructor(components: OBC.Components) {
        // for the template we can use whatever html we want.. this is the poin tof why we are creating
        // our own custom SimpleUIComponent, so we can have a custom HTML item and add it inside of another UI compontent
        // Anytime we need to add a custom UI component with unique HTML that we cant do with out of the box
        // UI components, we need to create our own custom ones just like this
        const template = `
        <div id="shortcut-container" style="width: 100%; height: 100%;">
            <div id="shortcut-header">
                <label for="">Search</label>
                <input type="text">
            </div>
            <div id="shortcut-assignments" style="display: flex; flex-direction: row">
                <div id="commands" style="display: flex; flex-direction: column; resize: horizontal; overflow: auto; width: 300px; height: auto; border: 1px solid black;>
                    <h5>Commands</h5>
                
                </div>
                <div class="shortcut">
                    <h5>Shortcuts</h5>
                    <div class="command-line">
                        <p class="key">cnp</p>
                    </div>
                    <div class="command-line">
                        <p class="key">cnp</p>
                    </div>
                    <div class="command-line">
                        <p class="key">cnp</p>
                    </div>
                    <div class="command-line">
                        <p class="key">cnp</p>
                    </div>  
                </div>
            </div>
        </div>
        `
        super(components, template)
    }
}
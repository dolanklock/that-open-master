import * as OBC from "openbim-components"

export class KeyBoardShortcutUIComponent extends OBC.SimpleUIComponent {
    appendChild(e: HTMLElement) {
        this.getInnerElement("command")!.append(e)
    }
    constructor(components: OBC.Components) {
        // for the template we can use whatever html we want.. this is the poin tof why we are creating
        // our own custom SimpleUIComponent, so we can have a custom HTML item and add it inside of another UI compontent
        // Anytime we need to add a custom UI component with unique HTML that we cant do with out of the box
        // UI components, we need to create our own custom ones just like this
        const template = `
        <div id="shortcut-container" style="width: 500px; height: 500px; background-color: lightgray;">
            <div id="shortcut-header">
                <label for="">Search</label>
                <input type="text">
            </div>
            <div id="shortcut-assignments">
                <div class="commands">
                    <div class="command-line">
                        <p class="command">Create new Create new projectCreate new projectproject</p>
                    </div>
                    <div class="command-line">
                        <p class="command">Create new project</p>
                    </div>
                    <div class="command-line">
                        <p class="command">Create new project</p>
                    </div>
                    <div class="command-line">
                        <p class="command">Create new project</p>
                    </div>
                </div>
                <div class="shortcut">
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
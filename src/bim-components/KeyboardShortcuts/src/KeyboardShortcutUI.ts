import * as OBC from "openbim-components"

export class KeyBoardShortcutUIComponent extends OBC.SimpleUIComponent {
    appendCommandChild(e: HTMLElement) {
        this.getInnerElement("commands")!.append(e)
    }
    appendShortcutChild(e: HTMLElement) {
        this.getInnerElement("shortcut")!.append(e)
    }
    constructor(components: OBC.Components) {
        // for the template we can use whatever html we want.. this is the poin tof why we are creating
        // our own custom SimpleUIComponent, so we can have a custom HTML item and add it inside of another UI compontent
        // Anytime we need to add a custom UI component with unique HTML that we cant do with out of the box
        // UI components, we need to create our own custom ones just like this
        const template = `
        <div id="shortcut-container" style="color: white; background-color: transparent; width: 100%; height: 100%; border: none; padding: 0px; box-sizing: border-box; display: flex; flex-direction: column; row-gap: 25px;">
            <div id="shortcut-header" style="display: flex; align-items: center; column-gap: 15px; padding-left: 10px;">
                <label for="">Search</label>
                <input type="text" style="border: 1px solid darkgray; height: 25px">
            </div>
            <div id="shortcut-assignments" style="width: fit-content; display: flex; flex-direction: row; 10px; margin: 10px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <h5>Commands</h5>
                    <hr>
                    <br>
                    <div id="commands" style="display: flex; flex-direction: column; resize: horizontal;
                    overflow: auto; width: 250px; height: auto; border-right: 1px solid darkgray; align-items: center; padding: 10px;">
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <h5>Shortcuts</h5>
                    <hr>
                    <br>
                    <div id="shortcut" style="display: flex; flex-direction: column; resize: horizontal; 
                    overflow: auto; width: 250px; height: auto; border-left: 1px solid darkgray; align-items: center; padding: 10px;">
                    </div>
                </div>
            </div>
        </div>
        `
        super(components, template)
    }
}
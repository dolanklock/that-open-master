import * as OBC from "openbim-components"

export class ToDoCard extends OBC.SimpleUIComponent {
    constructor(components: OBC.Components) {
        const template = `
        <div class="todo-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                    <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
                    <p id="description">Make anything here as you want, even something longer.</p>
                </div>
                <p id="date" style="text-wrap: nowrap; margin-left: 10px;">Fri, 20 sep</p>
            </div>
        </div>
        `
        super(components, template)
    }
}
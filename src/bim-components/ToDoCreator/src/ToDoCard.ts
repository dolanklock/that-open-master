import * as OBC from "openbim-components"
import { ToDo } from "../index"
import { dateFormat } from "../../../ProjectFunctions"

export class ToDoCard extends OBC.SimpleUIComponent {
    set description(val: string) {
        const descriptionElement = this.getInnerElement("description") as HTMLParagraphElement
        descriptionElement.textContent = val
    }
    get description(): string {
        return this.getInnerElement("description")?.textContent as string
    }
    set date(val: Date) {
        const dateElement = this.getInnerElement("date") as HTMLParagraphElement
        dateElement.textContent = val.toDateString()
    }
    get date(): string {
        return this.getInnerElement("date")!.textContent as string
    }
    constructor(components: OBC.Components) {
        // for the template we can use whatever html we want.. this is the poin tof why we are creating
        // our own custom SimpleUIComponent, so we can have a custom HTML item and add it inside of another UI compontent
        // Anytime we need to add a custom UI component with unique HTML that we cant do with out of the box
        // UI components, we need to create our own custom ones just like this
        const template = `
            <div class="todo-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; column-gap: 15px; align-items: center;">
                        <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
                        <p id="description"></p>
                    </div>
                    <p id="date" style="text-wrap: nowrap; margin-left: 10px;"></p>
                </div>
            </div>
        `
        super(components, template)
    }
}
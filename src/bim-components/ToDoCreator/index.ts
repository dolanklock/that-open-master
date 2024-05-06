import  *  as OBC from "openbim-components"
import { ToDoCard } from "./src/ToDoCard"
import { dateFormat } from "../../ProjectFunctions";

export interface ToDo {
    description: string,
    date: Date,
    fragmentMap: OBC.FragmentIdMap | undefined
}

export class ToDoCreator extends OBC.Component<ToDo[]> implements OBC.UI {
    enabled: true;
    static uuid: string = "4e8e4fb2-9ae9-4ec3-9550-44115a03c98d" // this is only a class attribute, will not exist on instances
    private _components: OBC.Components
    uiElement = new OBC.UIElement<{activationButton: OBC.Button, todoList: OBC.FloatingWindow}>() // with this generic
    // we are basically telling typescript that the uiElement will have these to properties
    private _list: ToDo[] = []
    constructor(components: OBC.Components) {
        super(components) // super runs the constructor method from the class we are extending from
        this._components = components
        this._components.tools.add(ToDoCreator.uuid, this)
        this.setUI()
    }

    async addToDo(description: string) {
        // getting the existing highlighter we created from the main components
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        const todo: ToDo = {
            description: description,
            date: new Date(),
            fragmentMap: highlighter.selection.select // this gets the fragmentMap from highlighter of elements selected
        }
        const todoCard = new ToDoCard(this._components)
        todoCard.domElement.style.cursor = "pointer"
        todoCard.domElement.addEventListener("click", this.changeToDoCardEventHandler)
        todoCard.description = todo.description
        todoCard.date = todo.date
        const todoCardList = this.uiElement.get("todoList")
        todoCardList.addChild(todoCard)
        this._list.push(todo)
    }
    private changeToDoCardEventHandler(e: Event) {
        let targetClicked = e.target as HTMLElement
        const clickedParentToDoHTMLElement = targetClicked.closest(".todo-item")
        console.log("parent", clickedParentToDoHTMLElement)
        const clickedParagraphToDoHTMLElement = clickedParentToDoHTMLElement?.querySelector("p")
        console.log("paragraph", clickedParagraphToDoHTMLElement)
        // TODO: are we tracking todo objects and their state? if so should update the todoobject that is 
        // being stored in the _list. currently on todo object is and not the instance of the todocard class??
        // if how it is is fine,,, then how can we update the correct todo object description? currently has no
        // way to find it and identify it in the todo object that is in the _list....
    }
    private setUI() {
        // ------- creating the todo form --------- //

        const form = new OBC.Modal(this._components)
        form.title = "Create Todo Note"
        this._components.ui.add(form)
        form.onCancel.add(() => {
            form.visible = !form.visible
        })
        form.onAccept.add(async () => {
            await this.addToDo(todoDescriptionInput.value)
            todoDescriptionInput.value = ""
            form.visible = false
        })
        // form input
        const todoDescriptionInput = new OBC.TextArea(this._components)
        todoDescriptionInput.label = "Description"
        // adding an obc object to another simpleUIComponent object like OBC.Modal we use slots.content.addChild()
        // slots.centent will return another simpleUIComponent
        // and the get method will return the HTML element for that simpleUIComponent. see source code for exact understanding
        // basically each UI component contains HTML that is associated with it and slots.content.get() returns that exact HTML element
        form.slots.content.addChild(todoDescriptionInput)
        form.slots.content.get().style.padding = "20px"
        form.slots.content.get().style.display = "flex"
        form.slots.content.get().style.flexDirection = "column"
        form.slots.content.get().style.rowGap = "20px"

        // ------- creating the component tools buttons --------- //

        // creating button
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon = "construction"

        // new todo button
        const newToDoBtn = new OBC.Button(this._components, {name: "Create"})
        activationButton.addChild(newToDoBtn)
        newToDoBtn.onClick.add(() => {
            form.visible = true
        })

        // todo list button
        const listToDoBtn = new OBC.Button(this._components, {name: "List"})
        activationButton.addChild(listToDoBtn)
        listToDoBtn.onClick.add(() => {
            todoList.visible = !todoList.visible
        })

        // ------- creating a floating window that will display todos --------- //

        //Creating floating window
        const todoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(todoList)
        todoList.visible = false
        todoList.title = "ToDo List"
        this.uiElement.set({activationButton: activationButton, todoList: todoList})
        // console.log("TESTER", this.uiElement)

        // ------ form event listeners ------- //
        // const formHTMLDialogElement = form.get()
        // formHTMLDialogElement.addEventListener("click", (event: Event) => {
        //     form.visible = true
        // })

    }

    get(): ToDo[] {
        return this._list
    }

}





























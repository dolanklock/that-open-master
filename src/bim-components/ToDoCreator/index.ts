import  *  as OBC from "openbim-components"

export class ToDoCreator extends OBC.Component<null> implements OBC.UI {
    enabled: true;
    static uuid: string = "4e8e4fb2-9ae9-4ec3-9550-44115a03c98d" // this is only a class attribute, will not exist on instances
    private _components: OBC.Components
    uiElement = new OBC.UIElement<{activationButton: OBC.Button, todoList: OBC.FloatingWindow}>() // with this generic
    // we are basically telling typescript that the uiElement will have these to properties
    constructor(components: OBC.Components) {
        super(components) // super runs the constructor method from the class we are extending from
        this._components = components
        this._components.tools.add(ToDoCreator.uuid, this)
    }

    private setUI() {
        // creating button
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon = "constructor"
        //Creating floating window
        const todoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(todoList)
        todoList.visible = false
        todoList.title = "ToDo List"
        this.uiElement.set({activationButton, todoList})
    }

    get(): null {
        
    }

}





































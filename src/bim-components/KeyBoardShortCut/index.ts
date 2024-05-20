import { v4 as uuidv4 } from 'uuid'
import  *  as OBC from "openbim-components"
import { ToDoCard } from "./src/ToDoCard"
import { dateFormat } from "../../ProjectFunctions";
import * as THREE from "three"
import {KeyBoardShortcutUIComponent} from "./src/KeyboardShortcutUI"
import {CommandUIComponent, ShortcutUIComponent} from "./src/CommandUI"



// NEXT STEPS

// TODO: need to figure out how to remove event listener from old key after change the key shortcut

// TODO: need to not let key event get fired if typing in any dialogs. typed in form and it fires event...

// TODO: need to update the command objeects shortcut value when edit shortcut

// TODO: need to finish UI and figure out buttons for adding and removing shortcuts. need to add event listeners
// to the clicking of command lines "CommandUIComponent" and then add methods for ujpdating shortcut or removing them

// TODO: need to figure out adding CommandUIComponent ShortcutUIComponent whenever addCommand method is ran
// OR a user clicks on add shortcut to a seleced command line item

// TODO: need to figure out how i will deal with removing shortcut from a command

// conclusion,, should be few options for methods and logic (remove shortcut, add shortcut) and both methods should update
// backend and frontend UI

interface ICommands {
    [key: string]: [string, Function]
}

class Command {
    id: string
    fn: Function
    event: OBC.Event<Function>
    name: string
    shortcut: string
    constructor(id: string, name: string, shortcut: string, fn: Function, event: OBC.Event<Function>) {
        this.id = id
        this.name = name
        this.shortcut = shortcut
        this.fn = fn
        this.event = event
    }
}

export class KeyBoardShortCutManager extends OBC.Component<KeyBoardShortcutUIComponent> implements OBC.UI{
    enabled: true
    static uuid: string = uuidv4
    private _components: OBC.Components
    private keyboardShortcutUI: KeyBoardShortcutUIComponent
    private form: OBC.Modal
    private _commands: Command[] = []
    private activeModified: HTMLElement
    uiElement = new OBC.UIElement<{activationBtn: OBC.Button, keyboardShortcutUI: KeyBoardShortcutUIComponent}>()

    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        this._components.tools.add(KeyBoardShortCutManager.uuid, this)
        this._setUI()
    }

    private _setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "construction"
        activationBtn.onClick.add(() => {
            keyboardShortcutWindow.visible = true
        })
        this.keyboardShortcutUI = new KeyBoardShortcutUIComponent(this._components)

        const keyboardShortcutWindow = new OBC.FloatingWindow(this._components)
        this._components.ui.add(keyboardShortcutWindow)
        keyboardShortcutWindow.visible = false
        keyboardShortcutWindow.title = "Keyboard Shortcuts"
        keyboardShortcutWindow.addChild(this.keyboardShortcutUI)
        
        // form for when command is clicked, this form will open for new command to be added
        this.form = new OBC.Modal(this._components)
        this.form.title = "Edit Shortcut"
        this._components.ui.add(this.form)
        // form input
        const todoDescriptionInput = new OBC.TextArea(this._components)
        todoDescriptionInput.label = "Key"
        // adding an obc object to another simpleUIComponent object like OBC.Modal we use slots.content.addChild()
        // slots.centent will return another simpleUIComponent
        // and the get method will return the HTML element for that simpleUIComponent. see source code for exact understanding
        // basically each UI component contains HTML that is associated with it and slots.content.get() returns that exact HTML element
        this.form.slots.content.addChild(todoDescriptionInput)
        this.form.slots.content.get().style.padding = "20px"
        this.form.slots.content.get().style.display = "flex"
        this.form.slots.content.get().style.flexDirection = "column"
        this.form.slots.content.get().style.rowGap = "20px"
        this.form.onCancel.add(() => {
            this.form.visible = !this.form.visible
        })
        this._changeShortcutEventHandler()
        this.uiElement.set({activationBtn: activationBtn, keyboardShortcutUI: this.keyboardShortcutUI})
    }

    addCommand(commandName: string, shortcut: string, fn: Function) {
        // TODO: each time i create a new command i need to create a new CommandUIComponent and ShortcutUIComponent
        // object and append it to main keyboardShortcutUI using the keyboardShortcutUI.appendChild method
        // and when create these two objects need to pass in all required args. everything will be linked through its uuid
        if ( this.getCommand(shortcut) ) {
            throw new Error("shortcut is in use")
        }
        // id for both command ui and shortcut ui components
        const id = uuidv4()
        const event = this._createEvent(shortcut, fn)
        // creating new command
        const command = new Command(id, commandName, shortcut, fn, event)
        this._commands.push(command)
        // creating new commandUI
        const commandUI = new CommandUIComponent(this._components, id, commandName)
        this.keyboardShortcutUI.appendCommandChild(commandUI.get())
        // creating new shortcutUI
        const shortcutUI = new ShortcutUIComponent(this._components, id, shortcut)
        shortcutUI.onclick.add((e) => {
            const target = (e as Event).target as HTMLDivElement
            this.activeModified = target.closest(".command-line") as HTMLDivElement
            this.form.visible = true
        })
        this.keyboardShortcutUI.appendShortcutChild(shortcutUI.get())
        
    }

    private _createEvent(shortcut:string, fn: Function): OBC.Event<Function> {
        const event = new OBC.Event()
        event.add(fn)
        window.addEventListener("keypress", (e: KeyboardEvent) => {
            if (e.key === shortcut) {
                event.trigger()
            } 
        })
        return event
    }
    
    private _changeShortcutEventHandler() {
        this.form.onAccept.add(() => {
            const input = this.form.get().querySelector("textarea")?.value
            if (!input) {
                alert("Please enter valid key")
            }
            else {
                const key = this.activeModified.querySelector(".key") as HTMLParagraphElement 
                if (!key) {
                    console.log("returning", key, this.activeModified)
                    return
                }
                key.textContent = input
                const command = this.getCommand(this.activeModified.dataset.uuid!) as Command
                command.shortcut = input
                command.event.reset()
                this._createEvent(command.shortcut, command.fn)
                this.form.visible = false
            }
        })
    }
 
    // TODO: if reassign key will need to clear all event listeners for that jey and then reassign
    // event listener again, otherwise old event listener function will be run on key still
    getCommands() {
        return this._commands
    }

    getCommand(id: string): Command | undefined {
        const command = this._commands.find((command) => {
            if ( command.id === id ) {
                return command
            }
        })
        return command
    }

    get() {
        console.log("add something here later")
    }
}




// now we sshould have a front end UI component which supports this. basically will generate our
// keyboard shortcut dialog which will have a command column, which will be call command names and the shjortcut that it is

// Make so that once initialized, ther user can change the key mapping from the UI and can change to different functionalities and 
// the class will update the mappings based on UI selection. 

// the program should be repsonsilbe for adding the commands as these are built in functions for that application and can 
// set base line default key assignments to some of them or none at all... then when the user opens the dialog
// they can reassign the commands to whatever keystroke they want

// Here is my idea:

// Have a keyboard shortcut dialog class that allows the programmer to initialize it from a class.
// right off the bat the class will come with UI already built which would include the command column,
// shortcut key column and maybe a few other search features, nothing different from the revit keyboard search dialog. 

// Then for the developer the class will come with an addCommand method which will allow them to add functionality
// based on a key stroke as it will be the developers responsiblility to add the commands (functionailty) for there
// application and then the user can assign the key stroke to assign to that command. When the developer adds the command
// the class will automatically update the UI (html) to have the new command and will set the keystroke to none as a default.

// Then on the user side the UI will show that new command (with whatever name developer decides to give when calls addCommand
//     method) and can assign whatever key stroke they want to that command and on the backend it will listen for that new assignment
//     event and re assign that command (function) to that key stroke)

// Basically this will provide developers to quickly deploy/implement keyboard shortcuts in to their application with
// full UI and backend functionality ready

// I am going to work on this as I think its a really cool and useful implementation but let me know what yuo think if you
// have some time. Thanks





// --------------------------------------- ARCHIVE ------------------------------------------ //


// import { v4 as uuidv4 } from 'uuid'

// function addKeyBoardShortcut(key: string, fn: Function) {
//     window.document.addEventListener("keypress", () => {
//         if (KeyboardEvent.name === key) {
//             fn()
//         }
//     })
// }


// interface ICommands {
//     [key: string]: [string, Function]
// }

// // class KeyboardCommandManager {
// //     commands: ICommands
// //     constructor() {

// //     }
// // }

// class Command {
//     id: uuidv4
//     fn: Function
//     name: string
//     shortcut: string
//     constructor(name: string, shortcut: string, fn: Function) {
//         this.id = uuidv4()
//         this.name = name
//         this.shortcut = shortcut
//         this.fn = fn
//     }
// }


// export class KeyBoardShortCutManager {
//     HTMLtemplate: string = `
//         <div>

//         </div>
//     `
//     private _commands: Command[] = []
//     HTMLContainer?: HTMLElement
//     // private commandManager: KeyboardCommandManager
//     constructor(HTMLContainer?: HTMLElement) {
//         this.HTMLContainer = HTMLContainer
//         // this.commandManager = new KeyboardCommandManager()
//     }
//     // TODO: if reassign key will need to clear all event listeners for that jey and then reassign
//     // event listener again, otherwise old event listener function will be run on key still
//     private addKeyOnClick(key: string, fn: Function) {
//         window.document.addEventListener("keypress", (e) => {
//             console.log(e)
//             if (e.key === key) {
//                 console.log("clicked")
//                 fn()
//             }
//         })
//     }
//     getCommands() {
//         return this._commands
//     }
//     getCommand(key: string): Command | undefined {
//         const command = this._commands.find((command) => {
//             if ( command.shortcut === key ) {
//                 return command
//             }
//         })
//         return command
//     }
//     addCommand(commandName: string, shortcut: string, fn: Function) {
//         // this.commands[key] = {commandName: fn}
//         if ( this.getCommand(shortcut) ) {
//             throw new Error("shortcut is in use")
//         }
//         const command = new Command(commandName, shortcut, fn)
//         this._commands.push(command)
//         this.addKeyOnClick(command.shortcut, command.fn)
//     }
//     // changeKey(obj, oldKey, newKey) {
//     //     if (oldKey !== newKey &amp;&amp; obj.hasOwnProperty(oldKey)) {
//     //         obj[newKey] = obj[oldKey];
//     //         delete obj[oldKey];
//     //     }
//     // }
//     private updateCommand(key: string) {
//         // check if key is assigned somewhere else if so warn user its assigned to ** command already
//         // and prompt for them to remove the key assign on the other before assigning to this
//         // or allow them to set other key to none and then go ahead with that assignment
//         const command = this.getCommand(key)
//         if (key in this._commands) {
//             alert(`This key is already assigned to "${this._commands[key][0]}" command`)
//             // TODO: checking if key is in use already, if so prompt use and ask to move forward
//             // (set other to none and assign key to command assigning to or cancel)
//             // if assign clicked then change the key to the command and change the other to none
//             // if cancel then simply cancel and return and do nothing

//             // throw new Error(`This key is already assigned to "${this.commands[key][0]}" command`)
//         } else {
//             this._commands[key] = key
//         }
//         console.log(command)
//     }

// }





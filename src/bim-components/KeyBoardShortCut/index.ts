import { v4 as uuidv4 } from 'uuid'
import  *  as OBC from "openbim-components"
import { ToDoCard } from "./src/ToDoCard"
import { dateFormat } from "../../ProjectFunctions";
import * as THREE from "three"
import {KeyBoardShortcutUIComponent} from "./src/KeyboardShortcutUI"
import {CommandUIComponent, ShortcutUIComponent} from "./src/CommandUI"



// NEXT STEPS

// TODO: need to not let key event get fired if typing in any dialogs. typed in form and it fires event...

// TODO: need to add a keystroke validator. should only allow two characters min. for key shortcut (revit does this) and 
// need to figure out how to deal with if keys have the same pattern and not executing the one if other is intended to be ran
// or figure out a way to deal with it? example, if one command has key stroke "PNN" and another has "PN"

// TODO: need to put event listener for key press that is in createEvent method right now in the constructor function once
// . Right now it is being added each time command is added and every time a key is pressed an event listener callback function is
// executed which is unnecessary. can have it once in constructor and each time it should look through command list to see if shortcut matches

// TODO: verify interface is correct

// TODO: need to figure out how to have so that we can do multiple keys for event listeners and not just single keys

// TODO: need to udpate and complete UI.. make it look nice. also the command lines dont line up with the shortcut divs....

// TODO: need to figure out how i will deal with removing shortcut from a command

// TODO: what about if addCommand takes a function with arguments?


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
    private _keysPressed: string[] = []
    uiElement = new OBC.UIElement<{activationBtn: OBC.Button, keyboardShortcutUI: KeyBoardShortcutUIComponent}>()

    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        this._components.tools.add(KeyBoardShortCutManager.uuid, this)
        this._setUI()
        this._keyEventSetup()
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
        // window.addEventListener("keypress", (e: KeyboardEvent) => {
        //     if (e.key === shortcut) {
        //         event.trigger()
        //     } 
        // })
        return event
    }

    private _keyEventSetup() {
        document.addEventListener("keypress", (e: KeyboardEvent) => {
            const keyPressed = e.key
            this._keysPressed.push(keyPressed)
            // this._keysPressed.splice(-5)
            this._commands.forEach((command) => {
                const currentKeys = this._keysPressed.slice(-command.shortcut.length).join("").toLowerCase()
                console.log(currentKeys, command.shortcut)
                if (currentKeys === command.shortcut.toLowerCase()) {
                    console.log("shortcut keys activated")
                    command?.event.trigger()
                }
            })
        })
    }
    
    private _changeShortcutEventHandler() {
        this.form.onAccept.add(() => {
            const input = this.form.get().querySelector("textarea")
            const inputValue = input!.value
            if (!inputValue) {
                alert("Please enter valid key")
            }
            else {
                const key = this.activeModified.querySelector(".key") as HTMLParagraphElement 
                if (!key) {
                    console.log("returning", key, this.activeModified)
                    return
                }
                key.textContent = inputValue
                const command = this.getCommand(this.activeModified.dataset.uuid!) as Command
                command.shortcut = inputValue
                // command.event.reset()
                // this._createEvent(command.shortcut, command.fn)
                this.form.visible = false
            }
            input!.value = ""
            
        })
    }
 
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


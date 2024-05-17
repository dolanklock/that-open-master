import { v4 as uuidv4 } from 'uuid'

function addKeyBoardShortcut(key: string, fn: Function) {
    window.document.addEventListener("keypress", () => {
        if (KeyboardEvent.name === key) {
            fn()
        }
    })
}


interface ICommands {
    [key: string]: [string, Function]
}

// class KeyboardCommandManager {
//     commands: ICommands
//     constructor() {

//     }
// }

class Command {
    id: uuidv4
    fn: Function
    name: string
    shortcut: string
    constructor(name: string, shortcut: string, fn: Function) {
        this.id = uuidv4()
        this.name = name
        this.shortcut = shortcut
        this.fn = fn
    }
}


export class KeyBoardShortCutManager {
    HTMLtemplate: string = `
        <div>

        </div>
    `
    private _commands: Command[] = []
    HTMLContainer?: HTMLElement
    // private commandManager: KeyboardCommandManager
    constructor(HTMLContainer?: HTMLElement) {
        this.HTMLContainer = HTMLContainer
        // this.commandManager = new KeyboardCommandManager()
    }
    // private checkCommandExists(key: string) {
    //     // this method should check if a command already exists with the same key. for developers only
    //     // should throw error
    //     for (const command of this.commands) {
    //         if ( command.shortcut === key ) {
    //             return true
    //         }
    //     }
    //     return false
    // }
    // TODO: if reassign key will need to clear all event listeners for that jey and then reassign
    // event listener again, otherwise old event listener function will be run on key still
    private addKeyOnClick(key: string, fn: Function) {
        window.document.addEventListener("keypress", (e) => {
            console.log(e)
            if (e.key === key) {
                console.log("clicked")
                fn()
            }
        })
    }
    getCommands() {
        return this._commands
    }
    getCommand(key: string): Command | undefined {
        const command = this._commands.find((command) => {
            if ( command.shortcut === key ) {
                return command
            }
        })
        return command
    }
    addCommand(commandName: string, shortcut: string, fn: Function) {
        // this.commands[key] = {commandName: fn}
        if ( this.getCommand(shortcut) ) {
            throw new Error("shortcut is in use")
        }
        const command = new Command(commandName, shortcut, fn)
        this._commands.push(command)
        this.addKeyOnClick(command.shortcut, command.fn)
    }
    // changeKey(obj, oldKey, newKey) {
    //     if (oldKey !== newKey &amp;&amp; obj.hasOwnProperty(oldKey)) {
    //         obj[newKey] = obj[oldKey];
    //         delete obj[oldKey];
    //     }
    // }
    private updateCommandKey(key: string) {
        // check if key is assigned somewhere else if so warn user its assigned to ** command already
        // and prompt for them to remove the key assign on the other before assigning to this
        // or allow them to set other key to none and then go ahead with that assignment
        const command = this.getCommand(key)
        if (key in this._commands) {
            alert(`This key is already assigned to "${this._commands[key][0]}" command`)
            // TODO: checking if key is in use already, if so prompt use and ask to move forward
            // (set other to none and assign key to command assigning to or cancel)
            // if assign clicked then change the key to the command and change the other to none
            // if cancel then simply cancel and return and do nothing

            // throw new Error(`This key is already assigned to "${this.commands[key][0]}" command`)
        } else {
            this._commands[key] = key
        }
        console.log(command)
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
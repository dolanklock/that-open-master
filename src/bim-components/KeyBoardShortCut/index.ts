

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

export class KeyBoardShortCutManager {
    HTMLtemplate: string = `
        <div>

        </div>
    `
    private commands: ICommands = {}
    HTMLContainer: HTMLElement
    // private commandManager: KeyboardCommandManager
    constructor(HTMLContainer: HTMLElement) {
        this.HTMLContainer = HTMLContainer
        // this.commandManager = new KeyboardCommandManager()
    }
    private addKeyOnClick(key: string, fn: Function) {
        window.document.addEventListener("keypress", (e) => {
            console.log(e)
            if (e.key === key) {
                console.log("clicked")
                fn()
            }
        })
    }
    getCommand(key: string) {
        return this.commands[key]
    }
    addCommand(commandName: string, key: string, fn: Function) {
        // this.commands[key] = {commandName: fn}
        this.commands[key] = [commandName, fn]
        this.addKeyOnClick(key, fn)
    }
    updateCommandKey(key: string) {
        // check if key is assigned somewhere else if so warn user its assigned to ** command already
        // and prompt for them to remove the key assign on the other before assigning to this
        // or allow them to set other key to none and then go ahead with that assignment
        const command = this.getCommand(key)
        if (key in this.commands) { 
            throw new Error(`This key is already assigned to "${this.commands[key][0]}" command`)
        } else {
            this.commands[key] = key
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
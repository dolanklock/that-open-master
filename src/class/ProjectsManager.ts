'use strict';

// --------------------- IMPORTS -------------------- //


import { Project, IProject, ToDo } from "./Projects"
import { showWarnModalFormImportJson, showModalForm, updateProjectDetailsContent,
     updateProjectCardContent, updateToDoHTMLFromProject } from "./Warnings"

// --------------------- VARIABLES -------------------- //


const projectList = document.getElementById('project-list')


// --------------------- FUNCTIONS -------------------- //


// const showWarnModalFormImportJson = function(msg: string) {
//     const warnModal = document.getElementById("warning-dialog-import-json")
//     if ( warnModal && warnModal instanceof HTMLDialogElement) {
//         warnModal.showModal()
//     }
//     if ( !warnModal ) return
//     const warnMessage = warnModal.querySelector('.warn-message h3')
//     if ( !warnMessage ) return
//     warnMessage.textContent = msg
// }


function justNumbers(string: string) {
    var numsStr = string.replace(/[^0-9]/g, '');
    return parseFloat(numsStr);
  }


// ------------------------ CLASSES ----------------------- //


export class ProjectsManager {
    // class attributes
    list: Project[] = [] // use Project[] with brackets because it says that list will be an array of type Project items
    countChange: number
    countLoad: number
    r: string
    constructor() {
        this.countChange = 0
        this.countLoad = 0

    }

    newProject(data: IProject) {
        // console.log('data passed in', data)
        // check if new project has same name as existing ones
        this.countChange ++
        // console.log(`RUNNING newProject method (${this.countChange}) : ${this.list}`)
        console.log(`***** ATTEMPTING TO CREATE PROJECT WITH NAME "${data.projectName}" *****`)
        console.log(this.list)
        this.list.forEach(project => {
            // console.log('** DATA FROM JSON: ', data.projectName, '  -  CURRENT PROJECT NAME: ', project.projectName, " **")
            if ( project.projectName === data.projectName ) {
                console.log(this.list)
                console.log(`* CANT ADD ${project.projectName} PROEJCT ALREAD EXISTS *`)
                console.log(this.list)
                throw new Error(`${data.projectName}`);
            }
        })
        if ( data.projectName.length < 5 ) {
            throw new Error(`Project name must be greater than 5 characters`);
        }
        const project = new Project(data)
        this.list.push(project)
        return project
    }

    getProject(id: string) {
        const project = this.list.find(( project ) => project.id === id)
        return project
    }

    deleteProject(id: string) {
        const project = this.list.find(project => project.id === id)
        if ( !project ) return
        const updatedProjectsList = this.list.filter(project => project.id !== id)
        // assigning project list to updated list with deleted project removed
        this.list = updatedProjectsList
        // removing project card html that was deleted from html
        if ( !projectList ) return
        // console.log(projectList.children)
        for ( const childElement of [...projectList.children] ) {
            // if dont have 'childElement instanceof HTMLElement' then childElement.dataset errors out
            if ( childElement instanceof HTMLElement && childElement.dataset.id === id ) {
                childElement.remove()
            }
        }
    }

    totalCostProjects() {
        if ( !projectList ) return
        const childElements = [...projectList.children]
        // console.log('here')
        childElements.forEach(child => console.log(child.querySelector('.cost')))
        const projectCosts = childElements.map((childElement) => justNumbers(childElement.querySelector('.cost')?.textContent))
        const totalCost = projectCosts.reduce((totalCost, childElement) => totalCost + childElement)
        return totalCost
    }
    
    getProjectByName(name: string) {
        if ( !projectList ) return
        const projectCards = [...projectList.children]
        const project = projectCards.filter(project => name === project.querySelector('.card-title')?.querySelector('h2')?.textContent)
        return project
    }

    addToDo(projectId: string, todo: ToDo) {
        const project = this.list.find(project => project.id == projectId)
        if ( !project ) return
        // console.log('hereeeeee', project)
        // console.log('hereeeeee', project.todoList)
        project.todoList.push(todo)
    }

    _overrideProjectImportJson(event: Event, project) {
        /*
        this method will take in the project object that comes from the JSON file import and set the
        project object (Project class object) and set its values the project object from JSON file
        it will then run the updateProjectCardContent function in order to update the project card content html

        * @param {Event} event - the event object from the addeventlistener method
        * @param {Object} project - the project object from the imported JSON file
        * @returns {none}
        */
        this.countChange ++
        console.log(`_overrideProjectImportJson (${this.countChange})`)
        console.log(this.list)
        event.preventDefault()
        event.stopPropagation()
        // console.log('**OVERRIDING EXISTING PROJECT**')
        showModalForm("warning-dialog-import-json", false)
        const projectOverride = this.list.find(p => p.projectName == project.projectName)
        if ( !projectOverride ) return
        // console.log('PROJECT OBJECT', projectOverride)
        // console.log('PROJECT JSON', project)
        projectOverride.cost = project.cost
        projectOverride.description = project.description
        projectOverride.todoList = project.todoList
        projectOverride.role = project.role
        projectOverride.status = project.status
        projectOverride.finishDate = project.finishDate
        projectOverride.iconColor = project.iconColor
        updateProjectCardContent(projectOverride)
    }


    exportProjectDataJSON(filename: string = 'projects') {
        // JSON.stringify converts JavaScript object to a json string
        const json = JSON.stringify(this.list, null, 2)
        // blob represents a file like object of immutable raw-data
        const blob = new Blob( [ json ], { type: "application/json" } );
        // URL.createObject creates a string containing a URL representing the object given in the parameter. 
        const url = URL.createObjectURL(blob)
        const exportBtn = document.getElementById('export-json')
        if ( exportBtn && exportBtn instanceof HTMLAnchorElement ) {
            exportBtn.href = url
            // the download method will download the given link url that we set with the
            // file name we passed in
            exportBtn.download = filename // setting html button element attribute 'download' to the filename string
            // exportBtn.click()
            // URL.revokeObjectURL(url)
        }
    }

    // test(fileslist, reader) {
    //     const importJSONInput = document.getElementById('import-json')
    //     // event.stopPropagation()
    //     // this.countChange ++
    //     // console.log(`CHANGE HAS RAN : ${this.countChange}`)
    //     // console.log(`change (${this.countChange})`)
    //     // getting the selected files from the input dialog that popped up
    //     fileslist = importJSONInput.files
    //     if ( !fileslist ) return
    //     // console.log('final check here is issue?')
    //     // console.log('filelist', fileslist[0])

    //     // the readAsText method is used to read the contents of the passed
    //     // in blob or file, in this case we are passing in the file as object that we
    //     // selected from the input
    //     reader.readAsText(fileslist[0]) // the file will be the first item in array
    //     // the reader.readAsText will get the text from the file and when done will
    //     // trigger the read 'load' event above
    // }

    // async check(fileslist) {
    //     if ( fileslist?.length == 0 ) {
    //         console.log('testghfghyu567u678678678678')
    //         importJSONInput.removeEventListener('change', this.test.bind(event, fileslist, reader))
    //     } else {
    //         console.log('noting wrong with file list', fileslist)
    //     }
    // }

    importProjectDataJSON(event) {
        console.log('running importProjectDataJSON')
        console.log(this.list)
        event.stopPropagation()
        const importJSONInput = document.getElementById('import-json')
        // console.log('importjsoninput', importJSONInput)
        if (importJSONInput && importJSONInput instanceof HTMLInputElement) {
            console.log('running ok')
            // console.log('here', importJSONInput)
            // getting the HTML input element
            if ( !importJSONInput ) return
            // console.log('** importJSONInput is good **')
            // console.log(this.list)
            importJSONInput.accept = 'application/json' // assigning accept attr to element in html
            // this is the new FileReader object that will be used for the below code
            const reader = new FileReader()
            // * the change event handler below will be triggered first then go to this load
            // event handler once file is chosen
            // reader.addEventListener('click', () => this._readerCallback(reader))
            reader.addEventListener('load', function eventHandler(event) {
                event.stopPropagation()
                this.countLoad ++
                console.log(`LOAD HAS RAN : ${this.countLoad}`)
                // console.log(`Load (${this.countChange})`)
                // with reader.result we are getting the text that was read in the event listener
                // below 'reader.readAsText(fileslist[0])' 
                const json = reader.result
                if ( !json ) return
                // here we are converting the json from the reader into a string
                // format using JSON.parse method and storing in projects attr
                // datatype is an array of IPorject's
                // the as string at the end is type assignment and we are telling
                // TS that this will be a string when its in the projects array
                const projects: IProject[] = JSON.parse(json as string) // json.parse converts json string into a JavaScript object
                console.log(`PROJECTS FROM JSON FILE ${projects}`)
                // iterating through projects array which contains JSON items that
                // we can create a new project from using the 'newProject' method in
                // this class
                for ( const project of projects ) {
                    console.log(`POP : ${project}`)
                    try {
                        console.log('checking before', this.list)
                        this.newProject(project)
                        console.log('checking after', this.list)
                    } catch (error) {
                        // console.log(`catch (${this.countChange})`)
                        // throw new Error(project.projectName)
                        // throw error
                        // TODO: what to do with error here? notify to user there was error loading json?
                        // new Error(`A project with this name already exists, would you like to override it?`)
                        const msg = (`A project with the name "${error.message}" already exists, would you like to override it?`)
                        showWarnModalFormImportJson(msg)
                        const warnFormImportJson = document.getElementById('warn-form-import-json')
                        const warnFormImportJsonCancelBtn = document.getElementById('cancel-warn-import-json-btn')
                        if ( !warnFormImportJson || !warnFormImportJsonCancelBtn ) return

                        warnFormImportJson.addEventListener('submit', (event) => this._overrideProjectImportJson(event, project))

                        warnFormImportJsonCancelBtn.addEventListener('click', function(event){
                            // console.log(`RUNNING cancel addEventListener (${this.countChange})`)
                            event.stopPropagation() // need this because it will run the submit event if dont
                            warnFormImportJson.reset()
                            showModalForm("warning-dialog-import-json", false)
                        }.bind(this))
                    }
                }
            }.bind(this))
          
            // this will get triggered when we select the 'choose file' in the webpage
            importJSONInput.addEventListener('change', function eventHandlerChange(event) {
                event.stopPropagation()
                this.countChange ++
                console.log(`CHANGE HAS RAN : ${this.countChange}`)
                // console.log(`change (${this.countChange})`)
                // getting the selected files from the input dialog that popped up
                const fileslist = importJSONInput.files
               if ( !fileslist ) return
                // the readAsText method is used to read the contents of the passed
                // in blob or file, in this case we are passing in the file as object that we
                // selected from the input
                reader.readAsText(fileslist[0]) // the file will be the first item in array
                // the reader.readAsText will get the text from the file and when done will
                // trigger the read 'load' event above
            }.bind(this))
        }

    }

}



'use strict';

import { Project, IProject } from "./Projects"

//// VARIABLES ////


const projectList = document.getElementById('project-list')


function justNumbers(string) {
    var numsStr = string.replace(/[^0-9]/g, '');
    return parseFloat(numsStr);
  }

//// CLASSES ////


export class ProjectsManager {
    // class attributes
    list: Project[] = [] // use Project[] with brackets because it says that list will be an array of type Project items
    constructor() {
        // console.log('here')
        // console.log(this.list)
    }

    newProject(data: IProject) {
        // check if new project has same name as existing ones
        this.list.forEach(project => {
            if ( project.projectName === data.projectName ) {
                throw new Error(`A project with the name "${data.projectName}" already exists.`);
            }
        })
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
        console.log(projectList.children)
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
        console.log('here')
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

    importProjectDataJSON() {
        const importJSONInput = document.getElementById('import-json')
        if (importJSONInput && importJSONInput instanceof HTMLInputElement) {
            // getting the HTML input element
            if ( !importJSONInput ) return
            importJSONInput.accept = 'application/json' // assigning accept attr to element in html
            // this is the new FileReader object that will be used for the below code
            const reader = new FileReader()
            // * the change event handler below will be triggered first then go to this load
            // event handler once file is chosen
            reader.addEventListener('load', () => {
                // with reader.result we are getting the text that was read in the event listener
                // below 'reader.readAsText(fileslist[0])' 
                const json = reader.result
                if ( !json ) return
                // here we are converting the json from the reader into a string
                // format using JSON.parse method and storing in projects attr
                // datatype is an array of IPorject's
                // the as string at the end is type assignment and we are telling
                // TS that this will be a string when its in the projects array
                const projects: IProject[] = JSON.parse(json as string)
                // iterating through projects array which contains JSON items that
                // we can create a new project from using the 'newProject' method in
                // this class
                for ( const project of projects ) {
                    try {
                        this.newProject(project)
                    } catch (error) {
                        
                    }
                }
            })
            // const importJSONbtn = document.getElementById('import-json')
            // importJSONbtn.addEventListener('e', () => input.click())


            // this will get triggered when we select the 'choose file' in the webpage
            importJSONInput.addEventListener('change', () => {
                // getting the selected files from the input dialog that popped up
                const fileslist = importJSONInput.files
                if ( !fileslist ) return
                // console.log('filelist', fileslist[0])

                // the readAsText method is used to read the contents of the passed
                // in blob or file, in this case we are passing in the file as object that we
                // selected from the input
                reader.readAsText(fileslist[0]) // the file will be the first item in array
                // the reader.readAsText will get the text from the file and when done will
                // trigger the read 'load' event above
            })
        }
    }

}



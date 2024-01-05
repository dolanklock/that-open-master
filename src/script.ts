'use strict';

// IMPORTS //

// this is how to import a module from another file
// now we have access to all classes and functions inside of it
// in the curly brackets we type the classes or functions
// we want to import from the file
// NOTE: we need to add the attribute to the script tag in our HTML file
// to have type="module" - this will let the browser know we are using import/export
// from different modules
import { Project, IProject, projectRole, projectStatus } from "./class/Projects"
import { ProjectsManager } from "./class/ProjectsManager"


// testing new changes

// ----------------- VARIABLES ---------------- //

const projectsPage = document.getElementById('projects-page')
const projectDetails = document.getElementById('project-details')
const newProjectBtn = document.querySelector('.new-project-btn');
const newProjectForm = document.getElementById('new-project-form');
const newProjectDialog = document.getElementById('new-project-modal')
const newProjectSubmitBtn = document.querySelector('.form-submit-btn');
const newProjectCancelBtn = document.querySelector('.form-cancel-btn');
const projectList = document.getElementById('project-list')

const projectsManager = new ProjectsManager()

const testBtn = document.getElementById('test')

// warn elements
const warnModal = document.getElementById('warning-dialog')


// ------------------ FUNCTIONS ----------------- // 


const showModalForm = function(id: string, showModal=true) {
    const modalForm = document.getElementById(id)
    if ( modalForm && modalForm instanceof HTMLDialogElement ) {
        if ( showModal ) modalForm.showModal()
        else modalForm.close()
    } else {
        console.warn(`"${id}" is not a valid CSS id, verify id is correct and in CSS`)
    }
}

const showWarnModalForm = function(msg: string) {
    if ( warnModal && warnModal instanceof HTMLDialogElement) {
        warnModal.showModal()
    }
    const warnMessage = document.getElementById('warn-message')
    if ( !warnMessage ) return
    warnMessage.textContent = msg
}

function toggleProjectsDetailsPage() {
    if ( !projectsPage || !projectDetails ) return
    projectsPage.classList.toggle('page-hidden')
    projectDetails.classList.toggle('page-hidden')
}

function getProject(projectId: string | number) {
    return projectsManager.list.find(project => project.id == projectId)
}

function dateFormat(date: Date) {
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    };
    return new Intl.DateTimeFormat(navigator.language, options).format(date);
}


// ----------- CALLBACK FUNCTIONS ------------ //


function newProjectFormHandler(event: Event, projectForm: HTMLFormElement) {
    event.preventDefault()
    // instantiating formdata object from FormData class and passing in html form element
    // this is an object that we can use to access all input values of our form using .get method
    const formData = new FormData(projectForm)
    console.log(formData)
    // console.log(formData.get('project-name')); // the HTML input tag will have attribute 'name'
    // that is equal to 'project-name' and we can access it with this get method
    const projectFormData: IProject = {
        // as string is type assertion and tells the TS to convert value to string (be careful with this, rarley used)
        projectName: formData.get('project-name') as string,
        description: formData.get('description') as string,
        role: formData.get('role') as projectRole,
        status: formData.get('project-status') as projectStatus,
        // here we are create a new date object from the string we get back from the form
        finishDate: dateFormat(new Date(formData.get('finish-date') as string)),
    }
    // catching error if project name is the same as existing, error coming from projectmanager class
    // in newProject method
    try {
        const project = projectsManager.newProject(projectFormData)
        console.log(project)
        console.log(projectsManager.list)
        projectForm.reset()
        showModalForm('new-project-modal', false) // closes dialog
    } catch (error) {
        showWarnModalForm(error)
    }
}

function projectCardClicked(event: Event) {
    const projectCard = ( event.target as HTMLElement).closest('.project-card')
    if ( !projectCard ) return
    const project = getProject(projectCard.dataset.id)
    const activeProjectTitle = document.getElementById('active-project-title')
    const infoSubHeaderTitle = document.getElementById("info-sub-header-title")
    const infoSubHeaderDescription = document.getElementById("info-sub-header-description")
    const infoBodyStatus = document.getElementById("info-body-status")
    const infoBodyCost = document.getElementById("info-body-cost")
    const infoBodyRole = document.getElementById("info-body-role")
    const infoBodyFinishDate = document.getElementById("info-body-finish-date")
    console.log(project)
    if ( !activeProjectTitle
        || !infoSubHeaderTitle
        || !infoSubHeaderDescription
        || !infoBodyStatus
        || !infoBodyCost
        || !infoBodyRole
        || !infoBodyFinishDate
        || ! project ) return
    activeProjectTitle.textContent = project.projectName
    infoSubHeaderTitle.textContent = project.projectName
    infoSubHeaderDescription.textContent = project.description
    infoBodyStatus.textContent = project.status
    infoBodyCost.value = project.cost
    infoBodyRole.textContent = project.role
    infoBodyFinishDate.textContent = project.finishDate

    toggleProjectsDetailsPage()

}

function projectsClicked(event: Event) {
    if ( !projectsPage ) return
    if ( projectsPage.classList.contains('page-hidden') ) toggleProjectsDetailsPage()
    else return
}


// ---------------- EVENT HANDLER ----------------- //


// new project button is clicked, will open dialog
if ( newProjectBtn ) {
    newProjectBtn.addEventListener('click', () => showModalForm('new-project-modal', true))
}

// if ( newProjectSubmitBtn ) {
//     newProjectSubmitBtn.addEventListener('click', () => showModalForm('new-project-modal', false))
// }

// if cancel button is clicked in new project dialog
if ( newProjectCancelBtn ) {
    newProjectCancelBtn.addEventListener('click', () => showModalForm('new-project-modal', false))
}

// creating a new project
if ( newProjectForm && newProjectForm instanceof HTMLFormElement ) {
    newProjectForm.addEventListener('submit', (event) => newProjectFormHandler(event, newProjectForm))
}

// adding event listener to delete button on project cards. using event delegation
if ( projectList ) {
    projectList.addEventListener('click', (event) => {
        if ( !event.target ) return
        if ( event.target instanceof HTMLElement && event.target.classList.contains('delete-project')) {
            const card = event.target.closest(".project-card")
            // if ( !card ) return
            if ( card && card instanceof HTMLElement ) {
                const projectId = card.dataset.id
                if ( !projectId ) return
                projectsManager.deleteProject(projectId)
            }
        }
    })
}


// ** FOR TESTING ONLY ** //
if ( testBtn ) {
    testBtn.addEventListener('click', (event) => {
        console.log(projectsManager.totalCostProjects())
        console.log(projectsManager.getProjectByName('testing'))
        // projectsManager.exportProjectDataJSON()
    })
}
// ** FOR TESTING ONLY ** //

// for closing the warnModal that opens in the new project dialog if project names are the same
document.getElementById('warn-form')?.addEventListener('click', (event) => {
    if ( warnModal && warnModal instanceof HTMLDialogElement ) warnModal.close()
})

const exportJSONBtn = document.getElementById('export-json')
if (exportJSONBtn) {
    exportJSONBtn.addEventListener('click', () => projectsManager.exportProjectDataJSON())
}

const importJSONBtn = document.getElementById('import-json')
if (importJSONBtn) {
    importJSONBtn.addEventListener('click', () => projectsManager.importProjectDataJSON())
}

// project card click
if (projectList) {
    projectList.addEventListener('click', (event) => projectCardClicked(event))
}

// Projects button on sidebar clicked
const sidebarProjectsBtn = document.getElementById('sidebar-projects-btn')
if ( sidebarProjectsBtn ) {
    sidebarProjectsBtn.addEventListener('click', (event) => projectsClicked(event))
}


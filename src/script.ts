'use strict';

// IMPORTS //

// this is how to import a module from another file
// now we have access to all classes and functions inside of it
// in the curly brackets we type the classes or functions
// we want to import from the file
// NOTE: we need to add the attribute to the script tag in our HTML file
// to have type="module" - this will let the browser know we are using import/export
// from different modules

// ---------------------------- IMPORTS ----------------------------- //


import { ThreeDViewer } from "./class/ThreeDViewer"
import { Project, IProject, projectRole, projectStatus, ToDo } from "./class/Projects"
import { ProjectsManager } from "./class/ProjectsManager"
import { showWarnModalForm,
     showModalForm,
      dateFormat,
       showWarnModalFormImportJson,
        updateProjectDetailsContent,
         updateProjectCardContent } from "./class/ProjectFunctions"

// importing three.js
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


// ------------------------ VARIABLES -------------------------- //


const projectsPage = document.getElementById('projects-page')
const projectDetails = document.getElementById('project-details')
const newProjectBtn = document.querySelector('.new-project-btn');
const newProjectForm = document.getElementById('new-project-form');
const newProjectDialog = document.getElementById('new-project-modal')
const newProjectSubmitBtn = document.querySelector('.form-submit-btn');
const newProjectCancelBtn = document.querySelector('.form-cancel-btn');
const todoBody = document.getElementById('todo-body')
const todoForm = document.getElementById('new-todo-form')
const projectList = document.getElementById('project-list')

const projectsManager = new ProjectsManager()
const testBtn = document.getElementById('test')


// -------------------------- FUNCTIONS ------------------------ // 


function toggleProjectsDetailsPage() {
    if ( !projectsPage || !projectDetails ) return
    projectsPage.classList.toggle('page-hidden')
    projectDetails.classList.toggle('page-hidden')
}


function getProject(projectId: string | number) {
    return projectsManager.list.find(project => project.id == projectId)
}


function getProjectFormData(projectForm: HTMLFormElement) {
    // instantiating formdata object from FormData class and passing in html form element
    // this is an object that we can use to access all input values of our form using .get method
    const formData = new FormData(projectForm)
    // console.log(formData.get('project-name')); // the HTML input tag will have attribute 'name'
    // that is equal to 'project-name' and we can access it with this get method
    const date = formData.get('finish-date')
    const projectFormData: IProject = {
        // as string is type assertion and tells the TS to convert value to string (be careful with this, rarley used)
        projectName: formData.get('project-name') as string,
        description: formData.get('description') as string,
        role: formData.get('role') as projectRole,
        status: formData.get('project-status') as projectStatus,
        // here we are create a new date object from the string we get back from the form
        finishDate: date ? formData.get('finish-date') as string : 'N/A',
    }
    return projectFormData
}


function getActiveProject(): Project | undefined {
    // this function will get the active project (js object) when the user selects a project card from the project page
    const activeProjectTitle = document.getElementById('active-project-title')?.textContent
    const project = projectsManager.list.find(project => project.projectName === activeProjectTitle)
    if ( !activeProjectTitle || !project ) return
    return project
}


function updateProjectDetailsForm(project: Project) {
    // this function will update the form inputs to values of the project editing when you click the edit button on the project
    showModalForm('new-project-modal', true)
    const projectDetailForm = document.getElementById('new-project-form')
    const projectNameInput = document.getElementById('new-project-form-project-name') as HTMLInputElement
    const projectDescriptionInput = document.getElementById('new-project-form-description') as HTMLInputElement
    const projectRoleInput = document.getElementById('new-project-form-role') as HTMLInputElement
    const projectStatusInput = document.getElementById('new-project-form-status') as HTMLInputElement
    const projectDateInput = document.getElementById('new-project-form-date') as HTMLInputElement

    if ( !projectNameInput || !projectDescriptionInput || !projectRoleInput || !projectStatusInput) return
    projectNameInput.value = project.projectName
    projectDescriptionInput.value = project.description
    projectRoleInput.value = project.role
    projectStatusInput.value = project.status
    projectDateInput.valueAsDate = new Date(project.finishDate) // TODO: figure out how to set the date to existing value
}



// --------------------- CALLBACK FUNCTIONS --------------------- //


function newProjectFormHandler(event: Event, projectForm: HTMLFormElement) {
    event.preventDefault()
    if ( projectsPage?.classList.contains('page-hidden') ) {
        // if this block is executed then the user is editing an existing project on details page
        // update existing project data
        const projectFormData = getProjectFormData(projectForm)
        // update the project object with new values from form
        const projectObject = getActiveProject()
        if ( !projectObject ) return
        projectObject.projectName = projectFormData.projectName
        projectObject.description = projectFormData.description
        projectObject.role = projectFormData.role
        projectObject.status = projectFormData.status
        projectObject.finishDate = projectFormData.finishDate
        // update the project details page values with updated values from form
        // updateProjectDetailsForm(projectObject)
        updateProjectDetailsContent(projectObject)
        updateProjectCardContent(projectObject)
        projectForm.reset()
        showModalForm('new-project-modal', false) // closes dialog

    } else {
        // if this block is executeed then user is creating a brand new project
        const projectFormData = getProjectFormData(projectForm)
        // catching error if project name is the same as existing, error coming from projectmanager class
        // in newProject method
        try {
            const project = projectsManager.newProject(projectFormData)
            projectForm.reset()
            showModalForm('new-project-modal', false) // closes dialog
        } catch (error) {
            showWarnModalForm(`A project with the name "${error.message}" already exists.`)
        }
    }
}


function projectCardClicked(event: Event) {
    const projectCard = ( event.target as HTMLElement).closest('.project-card')
    if ( !projectCard ) return
    const project = getProject(projectCard.dataset.id)
    if ( !project ) return
    updateProjectDetailsContent(project)
    renderToDoList(project)
    toggleProjectsDetailsPage()
}


function editProjectCard(event: Event) {
    showModalForm('new-project-modal', true)
    const project = getActiveProject()
    if ( !project ) return
    updateProjectDetailsForm(project)
}


function projectsClicked(event: Event) {
    if ( !projectsPage ) return
    if ( projectsPage.classList.contains('page-hidden') ) toggleProjectsDetailsPage()
    // renderToDoStatusColor(getActiveProject() as Project)
}

function addToDoHandler(event: Event) {
    /*
    when todo form is submitted this function will run and get valie from input and
    add todo to the html and add the todo to the project objects todolist

    * @param {Project} project - the project object to use for rendering the todos. The project passed in will be
                        the data values for the HTML rendered
    * @returns {none}
    */
    event.preventDefault()
    const project = getActiveProject()
    if ( !project || !todoForm ) return
    const todoFormData = new FormData(todoForm as HTMLFormElement)
    let text = todoFormData.get('todo-text')
    if ( !text ) {
        todoForm.reset()
        showModalForm('new-todo-modal', false) // closes dialog
    }
    projectsManager.addToDo(project.id, new ToDo(text as string))
    renderToDoList(project)
    todoForm.reset()
    showModalForm('new-todo-modal', false) // closes dialog
    renderToDoStatusColor(project)
}


function renderToDoList(project: Project) {
    /*
    this function clears the HTML inside of the todo-body HTML and updates the HTML inside of the todo-body
    with the given project object todo list. then after it adds the todo HTML, it will run the renderToDoStatusColor
    function in order to get the todo HTML to the correct color and status

    * @param {Project} project - the project object to use for rendering the todos. The project passed in will be
                        the data values for the HTML rendered
    * @returns {none}
    */
    if ( !todoBody ) return
    todoBody.innerHTML = ""
    project.todoList.forEach(todo => {
        const htmlToDo = 
                        `<div class="todo" data-id="${todo.id}">
                            <span class="material-icons-round">construction</span>
                            <p class="todo-text">${todo.text}</p>
                            <div class="todo-status-date">
                                <select name="todo-status" id="" class="todo-status">
                                    <option value="open">Open</option>
                                    <option value="in-progress">In-progress</option>
                                    <option value="complete">Complete</option>
                                </select>
                                <p class="todo-date">Created on: ${todo.dateCreated}</p>
                            </div>
                        </div>`
        todoBody.insertAdjacentHTML('afterbegin', htmlToDo)
    })
    renderToDoStatusColor(project)
}


function renderToDoStatusColor(project: Project) {
    /*
    this function will iterate through the given project objects todos and find the todo HTML from the given
    todo object, then it will assign the todo HTML status to the todo objects status (this will update the
    dropdown selector) and then it will update the todo HTML background color based on the todo objects status value

    * @param {Project} project - the project object to use for updating the todo HTML - whatever project passed
                        in, that will be the todo html that is updated because the project objects todo objects id
                        will be used to find the todo HTML (by id)
    * @returns {none}
    */
    project.todoList.forEach(todo => {
        const todoHTMLElement = document.querySelector(`[data-id="${todo.id}"]`)
        const todoStatus = todoHTMLElement?.querySelector('.todo-status')
        todoStatus.value = todo.status
        if ( !todoHTMLElement || !todoStatus ) return
        if ( todo.status === 'open' ) todoHTMLElement.style.background = "red"
        if ( todo.status === 'in-progress' ) todoHTMLElement.style.background = "blue"
        if ( todo.status === 'complete' ) todoHTMLElement.style.background = "green"
    })

}

function updateProjectToDoStatus(elementIdFind: string, status: string) {
    /*
    this function will get the current active project object (Project) and find the 
    todo object from its todoList from the elementIdFind passed in and update the todo objects
    status attribute with the status passed into arg

    * @param {string} elementIdFind - the id of the todo object to find in the project objects todoList list
    * @param {string} status - the current status of the todo object
    * @returns {none}
    */
    const project = getActiveProject()
    const projectToDo = project?.todoList.find(todo => todo.id === elementIdFind)
    if ( !projectToDo ) return
    projectToDo.status = status
}


function todoStatusChangeEventHandler(event: Event) {
    /*
    this function will update the color of the todo background when the status is changed

    * @param {Event} event - the event object from the addeventlistener method
    * @returns {none}
    */
    event.preventDefault()
    const selectElement = event.target
    const todoHTMLElement = (event.target as HTMLElement).closest('.todo')
    if ( !todoHTMLElement || !selectElement ) return
    updateProjectToDoStatus(todoHTMLElement.dataset.id, selectElement.value)
    renderToDoStatusColor(getActiveProject() as Project)
}



// --------------------------- EVENT HANDLER ---------------------------- //


// new project button is clicked, will open dialog
if ( newProjectBtn ) {
    newProjectBtn.addEventListener('click', () => showModalForm('new-project-modal', true))
}


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
        event.preventDefault()
        // projectsManager.importJSONReader = undefined
        // projectsManager.reader.removeEventListener('load', projectsManager.importJSONLoadReader)
        // console.log(projectsManager.importJSONReader)
    })
}

// ** FOR TESTING ONLY ** //


// for closing the warnModal that opens in the new project dialog if project names are the same
document.getElementById('warn-form')?.addEventListener('click', (event) => {
    const warnModal = document.getElementById('warning-dialog')
    if ( warnModal && warnModal instanceof HTMLDialogElement ) warnModal.close()
})

const exportJSONBtn = document.getElementById('export-json')
if (exportJSONBtn) {
    exportJSONBtn.addEventListener('click', () => projectsManager.exportProjectDataJSON())
}

const importJSONBtn = document.getElementById('import-json')
if (importJSONBtn) {
    importJSONBtn.addEventListener("click", (event) => projectsManager.importProjectDataJSON(event))
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

const editProjectDetails =  document.getElementById('info-header-edit')
if ( editProjectDetails ) {
    editProjectDetails.addEventListener('click', (event) => editProjectCard(event))
}


// if add todo button is clicked will open dialog
const addToDo = document.getElementById('add-todo')
if ( addToDo ) {
    addToDo.addEventListener('click', (event) => showModalForm('new-todo-modal', true))
}

// ------------------------ todo Event Listeners ------------------------------ #

if ( todoForm ) {
    todoForm.addEventListener('submit', (event) => addToDoHandler(event))
}

// this closes the todo form dialog if cancel is clicked
if ( todoForm ) {
    todoForm.addEventListener('click', (event) => {
        if ( event.target.classList.contains('form-cancel-btn') ) {
            todoForm.reset()
            showModalForm('new-todo-modal', false) // closes dialog
        }
    })
}

if ( todoBody ) {
    todoBody.addEventListener('change', (event) => todoStatusChangeEventHandler(event))
}


// ------------------------------ THREE D VIEWER ------------------------------- //


// const threeDViewer = new ThreeDViewer('viewer', 0.4, 5)
// threeDViewer.resize()

// TODO: when move a little bit the viewer div is greatly increasing in width and height on resize
// 



// NOTE: everything in THREE js is a class, so we will be creating instances of classes for many things

// creating the scene for threeD viewer
const scene = new THREE.Scene()

// things to shoot the scene (camara)

// VIEWER
const viewer = document.getElementById('viewer') as HTMLElement
const viewerRect = viewer.getBoundingClientRect()
console.log(viewerRect.height, viewerRect.width)
const aspectRatio = viewerRect.width / viewerRect.height

// RENDERER
// camera man to start recording "THREE.WebGL1Renderer"
const renderer = new THREE.WebGL1Renderer()
console.log(renderer)
// append renderer domElement to the viewer html so it knows what to view
viewer.append(renderer.domElement)
// we want the rendered domElement we are appending above to be set to the same size
// as the viewer, so we can do the following
renderer.setSize(viewerRect.width, viewerRect.height)

// CAMERA
// this class PerspectiveCamera takes in some args into constructor
const camera = new THREE.PerspectiveCamera(75, aspectRatio)

// MESH
/*

need to create a mesh for all geometry in the scene

mesh is a series of trianglations with vertex points

in computer graphics, the objects we put in a threeD space is called "meshes"

all meshes are composed of geometry and materials, the geometry of a mesh is always a collection 
of trianlges where each trinalge has the 3 space coordinates (vertexes) that compose that triangle

shaders are little programs that run per triangle and trinagle vertex to calculate its color
the more complex the geomtry, the more triangles you will have and the more cpu your computer will need to process

since bigger models require much more resources there is some optimization techniques used - 
- Instancing (reusing geometry)
- indexing (grouping vertex)
- Normal Mapping (faking details)

*/

const geometry = new THREE.BoxGeometry() // creating geometry to see in viewer
const material = new THREE.MeshStandardMaterial() // create material using threejs for mesh below
const mesh = new THREE.Mesh(geometry, material)

// need to add light to the scene
const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
// set light intensity for better shadowing
ambientLight.intensity = 0.4

// add mesh and light to the scene object
scene.add(mesh, directionalLight, ambientLight)

// everything added to our virtual scene world is at 0,0,0 in the scene virtual world so the camera
// is inside the mesh so we need to move the camera or the mesh so they are not inside of eachother! (see below)

// camera is a object instrance of class and then the posistion is again another object which is attribute for
// camera object that also has attributes "z"
camera.position.z = 5 // moving camera 5 units in virtual world


// NEED TO ADD FUNCTIONALITY TO MOVE CAMERA AROUND
const cameraControls = new OrbitControls(camera, viewer)

function renderScene() {
    // FINAL SETUP (this code needs to be at the end!!!) this takes frames (fps) frames (pictures) per second
    // so in order to capture all threeD viewer changes or additions, we need this at the end
    // need to tell the renderer the camera and the scene to use
    renderer.render(scene, camera)
    // this will allow to run a function the next time the browser creates or renders a "frame" (fps)
    window.requestAnimationFrame(renderScene)
 
}

renderScene() // turn camera recording on


window.addEventListener("resize", () => {
    const viewerRect = viewer.getBoundingClientRect()
    renderer.setSize(viewerRect.width, viewerRect.height)
    const aspectRatio = viewerRect.width / viewerRect.height
    camera.aspect = aspectRatio
    console.log(viewerRect.width)
})


// ------------------------------ TODO LIST ------------------------------- //



/*

// TODO: when importing projects the color between the project page and the actual proejct card detail
// page when click on card - the project image color is different between the two, make sure
// background color is same everywhere

// TODO: when import projects need it so if more then  one project with same name will confirm to override
// each proejct that is same.. right now even if there is two with same name it will only prompt the one

// TODO: update override project dialog to look nicer

// TODO: add confirmation for when delete is clicked on projectcard

// TODO: fix scrolling of todos - when add too many todos it makes page height bigger, should add scroll bar

// TODO: should have input for cost and estimated progress ??

// TODO: add delete button for todos??

// TODO: add date to todo html

// TODO: update error handler in projectsmanager class in that module in the importjson method

*/
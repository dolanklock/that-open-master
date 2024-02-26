import { showWarnModalForm, showModalForm, dateFormat, showWarnModalFormImportJson,
       updateProjectDetailsContent, updateProjectCardContent } from "./ProjectFunctions"

export function editTodoHandler(event: Event) {
    // this function is for when edit todo is clicked and this function will find the existing
    // todo html element and update the opened form with the existing todo text
    // event.preventDefault()
    const clickedElement = event.target as HTMLElement
    // console.log('CLICKED ELEMENT', clickedElement)
    if ( !clickedElement || clickedElement.nodeName !== "SPAN" ) return
    showModalForm('new-todo-modal', true)
    console.log('CHECK HEREEE', clickedElement, clickedElement.nodeName)
    const todo = clickedElement.closest('.todo')
    // console.log('TODO ELEMENT', todo)
    const todoText = todo?.querySelector('.todo-text')?.textContent
    console.log(todoText)
    const newProjectFormProjectName = document.getElementById('new-project-form-project-name') as HTMLInputElement
    if ( !newProjectFormProjectName || !todoText ) return
    console.log('RUNS FIRST', newProjectFormProjectName)
    newProjectFormProjectName.value = todoText
    console.log('RUNS THIRD', newProjectFormProjectName.value)
    // TODO: form is not updating with todo text for some reason, the input is not getting
    // todo text...
}











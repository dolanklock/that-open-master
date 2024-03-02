import { showWarnModalForm, showModalForm, dateFormat, showWarnModalFormImportJson,
       updateProjectDetailsContent, updateProjectCardContent } from "./ProjectFunctions"

/** 
* this function is for when edit todo is clicked and this function will find the existing
todo html element and update the opened form with the existing todo text event.preventDefault()
* @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
* @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
*/
export function editTodoHandler(event: Event, clickedEditToDo: HTMLSpanElement) {
    // const clickedElement = event.target as HTMLElement
    // if ( !clickedElement || clickedElement.nodeName !== "SPAN" ) return
    showModalForm('new-todo-modal', true)
    const todo = clickedEditToDo.closest('.todo')
    const todoText = todo?.querySelector('.todo-text')?.textContent
    console.log(todoText)
    const newProjectFormProjectName = document.getElementById('new-project-form-project-name') as HTMLInputElement
    if ( !newProjectFormProjectName || !todoText ) return
    // console.log('RUNS FIRST', newProjectFormProjectName)
    newProjectFormProjectName.value = todoText
    // console.log('RUNS THIRD', newProjectFormProjectName.value)
    // TODO: form is not updating with todo text for some reason, the input is not getting
    // todo text...
}











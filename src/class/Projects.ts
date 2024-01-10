'use strict';

// importing uuid package
import { v4 as uuidv4 } from 'uuid'

// these are similar to interface but are more for single item and not an object like interface
// we speciffy the type of an element using this syntax
export type projectRole = 'pending' | 'active' | 'finished';
export type projectStatus = 'architect' | 'engineer' | 'developer';

// here we are creating an interface object for our Project class to define the types that
// will be used in the object passed into the Project class constructor
// you will notice the data.projectName will now not error out when we add this
// 'IProject' to the type for 'data' in the constructor method "data: IProject"
export interface IProject {
    // TypeScript interfaces - used to define the datatypes for object properties
    // declaring types of the object attributes
    projectName: string
    description: string
    role: projectRole
    status: projectStatus
    finishDate: string
};

// in order to import this class into another module we need
// to add the 'export' keyword to the class
export class Project {
    // declaring types for the instance attributes
    projectName: string
    description: string
    role: projectRole
    status: projectStatus
    finishDate: string
    id: uuidv4
    iconColor: string
    todoList: [ToDo]

    // class attributes
    cost: number = 5
    progress: number = 0

    constructor(data: IProject) {
        // instance attributes
        // instead of writing each on out 'this.name = name' we can loop of data object and dynamically assign attributes
        // use 'in' instead of 'of' for looping over an object
        for ( const key in data ) {
            this[key] = data[key]
        }
        this.id = uuidv4()
        this.iconColor = this.getRandomColor()
        this.addProject();
    };

    addProject() {
        const html = `
            <div class="project-card" data-id="${this.id}">
                <div class="project-card-header">
                    <div class="card-img" style="background-color: ${this.iconColor}">
                        <h2>${this.projectName.slice(0, 2).toUpperCase()}</h2>
                    </div>
                    <div class="card-title">
                        <h2>${this.projectName}</h2>
                        <h2>${this.id}</h2>
                        <p>Community hospital located at downtown.</p>
                    </div>
                </div>
                <div class="project-card-body">
                    <div class="card-body">
                        <p>Status</p>
                        <p class="project-card-status" style="color: white;">${this.status}</p>
                    </div>
                    <div class="card-body">
                        <p>Role</p>
                        <p class="project-card-role" style="color: white;">${this.role}</p>
                    </div>
                    <div class="card-body">
                        <p>Cost</p>
                        <p style="color: white;" class="cost">$2${this.cost}</p>
                    </div>
                    <div class="card-body">
                        <p>Estimated Progress</p>
                        <p style="color: white;">${new Intl.NumberFormat(navigator.language, { style: 'currency', currency: 'CAD' }).format(this.progress)}%</p>
                    </div>
                    <button class="delete-project">Delete</button>
                </div>
            </div>`
        const projectList = document.getElementById('project-list');
        if ( projectList ) {
            projectList.insertAdjacentHTML('beforeend', html);
        };
    };

    getRandomColor() {
        // Generate random values for red, green, and blue components
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        // Construct the RGB color string
        const color = "rgb(" + red + "," + green + "," + blue + ")";
        return color;
      }

};


export class ToDo {
    id: uuidv4
    text: string
    constructor(text: string) {
        this.text = text
        this.id = uuidv4()
    }
}




























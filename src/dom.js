// for all dom related stuff
import { createProject } from "./projects";
import { createTodo } from "./todos";
import { saveProjects, loadProjects } from './storage';



let projects = [];
let currentProject = projects[0];

const setUpAddProjectButton = () => {
    const addProjectButton = document.getElementById('create-new-project-button');
    addProjectButton.removeEventListener('click', openAddProjectDialog);
    addProjectButton.addEventListener('click', openAddProjectDialog);
};

const openAddProjectDialog = () => {
    const dialog = document.getElementById('create-new-project-dialog');
    dialog.showModal();

    const form = document.getElementById('create-new-project-form');
    form.removeEventListener('submit', handleProjectFormSubmit); 
    form.addEventListener('submit', handleProjectFormSubmit);

    const closeButton = document.getElementById('create-new-project-dialog-close-button');
    closeButton.removeEventListener('click', () => dialog.close());
    closeButton.addEventListener('click', () => dialog.close());
};

const handleProjectFormSubmit = (event) => {
    event.preventDefault();
    const projectName = document.getElementById('project-name').value;
    const newProject = createProject(projectName);
    projects.push(newProject);
    saveProjects(projects);
    displayProjects();
    document.getElementById('create-new-project-dialog').close();
};

const displayProjects = () => {
    const projectSection = document.querySelector('#projects');
    clearProjectSection(projectSection);
  
    if (projects.length === 0) {
      displayNoProjectsMessage(projectSection);
    } else {
      projects.forEach((project, index) => {
        const projectDiv = createProjectDiv(project, index);
        projectSection.appendChild(projectDiv);
      });
    }
  
    setUpAddProjectButton();
};

const clearProjectSection = (projectSection) => {
    projectSection.innerHTML = '';
};

const displayNoProjectsMessage = (projectSection) => {
    const noProjectsMessage = document.createElement('p');
    noProjectsMessage.textContent = 'No active projects';
    projectSection.appendChild(noProjectsMessage);
};

const createProjectDiv = (project, index) => {
    const projectDiv = document.createElement('div');
    projectDiv.id = 'project-div';
    projectDiv.textContent = project.name;
  
    setProjectDivClickListener(projectDiv, project);
    projectDiv.appendChild(createProjectManageDiv(project, index));
  
    return projectDiv;
};

const setProjectDivClickListener = (projectDiv, project) => {
    projectDiv.addEventListener('click', () => {
      currentProject = project;
      displayTodos(project.name);
    });
};

const createProjectManageDiv = (project, index) => {
    const projectManageDiv = document.createElement('div');
  
    const projectEditButton = createEditButton(index);
    const projectDeleteButton = createDeleteButton(project, index);
  
    projectManageDiv.appendChild(projectEditButton);
    projectManageDiv.appendChild(projectDeleteButton);
  
    return projectManageDiv;
};

const createEditButton = (index) => {
    const projectEditButton = document.createElement('button');
    projectEditButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    projectEditButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the click event from bubbling up
      openEditProjectDialog(index);
    });
    return projectEditButton;
};

const createDeleteButton = (project, index) => {
    const projectDeleteButton = document.createElement('button');
    projectDeleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    projectDeleteButton.addEventListener('click', (event) => {
      event.stopPropagation(); 
      
      if (currentProject === project) {
        clearTodosDisplay();
      }

      projects.splice(index, 1);
      saveProjects(projects);
      displayProjects(); 
    });
    return projectDeleteButton;
};
  
  

  

  

  

  

  
  

export { setUpAddProjectButton };
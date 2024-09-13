// for all dom related stuff
import { createProject } from "./projects";
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
  
  

  

  

  

  

  
  

export { setUpAddProjectButton };
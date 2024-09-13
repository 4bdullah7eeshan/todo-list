// for all dom related stuff
import { createProject } from "./projects";

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

export { setUpAddProjectButton };
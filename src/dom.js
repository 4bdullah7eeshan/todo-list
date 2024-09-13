// for all dom related stuff

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
};

export { setUpAddProjectButton };
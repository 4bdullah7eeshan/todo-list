// for all dom related stuff

const setUpAddProjectButton = () => {
    const addProjectButton = document.getElementById('create-new-project-button');
    addProjectButton.removeEventListener('click', openAddProjectDialog);
    addProjectButton.addEventListener('click', openAddProjectDialog);
};

const openAddProjectDialog = () => {
    const dialog = document.getElementById('create-new-project-dialog');
    dialog.showModal();

    const form = document.getElementById('add-new-task-form');
    form.removeEventListener('submit', handleTaskFormSubmit); 
    form.addEventListener('submit', handleTaskFormSubmit);
};

export { setUpAddProjectButton };
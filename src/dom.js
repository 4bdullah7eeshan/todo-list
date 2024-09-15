// for all dom related stuff
import { createProject } from "./projects.js";
import { createTodo } from "./todos.js";
import { saveProjects, loadProjects } from './storage.js';
import taskButton from './taskButton.js';

let projects = loadProjects() || [];
let currentProject = projects[0] || null;

taskButton.hide();

const setUpAddProjectButton = () => {
    const addProjectButton = document.getElementById('create-new-project-button');
    addProjectButton.removeEventListener('click', openAddProjectDialog);
    addProjectButton.addEventListener('click', openAddProjectDialog);
};

const openAddProjectDialog = () => {
    const dialog = document.getElementById('create-new-project-dialog');
    dialog.showModal();

    const form = document.getElementById('create-new-project-form');
    form.reset();
    form.removeEventListener('submit', handleEditProjectFormSubmit);
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
    currentProject = newProject;
    displayProjects();
    displayTodos(currentProject.name);
    taskButton.show();
    document.getElementById('create-new-project-dialog').close();
};

const displayProjects = () => {
    const projectSection = document.querySelector('#projects');
    clearProjectSection(projectSection);
  
    if (projects.length === 0) {
      displayNoProjectsMessage(projectSection);
      taskButton.hide();
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
        taskButton.show();
    });
};

const createProjectManageDiv = (project, index) => {
    const projectManageDiv = document.createElement('div');
    projectManageDiv.id = "project-manager"
  
    const projectEditButton = createEditButton(index);
    const projectDeleteButton = createDeleteButton(project, index);
  
    projectManageDiv.appendChild(projectEditButton);
    projectManageDiv.appendChild(projectDeleteButton);
  
    return projectManageDiv;
};

const createEditButton = (index) => {
    const projectEditButton = document.createElement('button');
    projectEditButton.id = "project-edit-button";
    projectEditButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    projectEditButton.addEventListener('click', (event) => {
      event.stopPropagation();
      openEditProjectDialog(index);
    });
    return projectEditButton;
};

const createDeleteButton = (project, index) => {
    const projectDeleteButton = document.createElement('button');
    projectDeleteButton.id = "project-delete-button";
    projectDeleteButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    projectDeleteButton.addEventListener('click', (event) => {
      event.stopPropagation(); 
      
      if (currentProject === project) {
        clearTodosDisplay();
        taskButton.hide();
        currentProject = null;
      }

      projects.splice(index, 1);
      saveProjects(projects);
      displayProjects(); 
    });
    return projectDeleteButton;
};

const clearTodosDisplay = () => {
    const todoSection = document.querySelector('#todo-section');
    todoSection.innerHTML = ''; 
  };

let editingProjectIndex = null;

const openEditProjectDialog = (index) => {
    const dialog = document.getElementById('create-new-project-dialog');
    dialog.showModal();
  
    document.getElementById('project-name').value = projects[index].name;

    editingProjectIndex = index;
  
    const form = document.getElementById('create-new-project-form');
    form.removeEventListener('submit', handleProjectFormSubmit);
    form.removeEventListener('submit', handleEditProjectFormSubmit);
    form.addEventListener('submit', handleEditProjectFormSubmit);
  
    const closeButton = document.getElementById('create-new-project-dialog-close-button');
    closeButton.removeEventListener('click', () => dialog.close());
    closeButton.addEventListener('click', () => dialog.close());
};

const handleEditProjectFormSubmit = (event) => {
    event.preventDefault();
    const projectName = document.getElementById('project-name').value;

    if (editingProjectIndex !== null) {
        projects[editingProjectIndex].name = projectName;

        saveProjects(projects);
        displayProjects();
        if (currentProject === projects[editingProjectIndex]) {
            displayTodos(projects[editingProjectIndex].name);
        }

        editingProjectIndex = null;
    }
    
    document.getElementById('create-new-project-dialog').close();
    
};

const displayProjectHeading = (projectName) => {
    const todoSection = document.querySelector('#todo-section');
    todoSection.innerHTML = '';
    const projectHeading = document.createElement('h2');
    projectHeading.textContent = projectName;
    todoSection.appendChild(projectHeading);
};

const displayNoTodosMessage = (todoSection) => {
    const noTodos = document.createElement('p');
    noTodos.textContent = "No tasks";
    todoSection.appendChild(noTodos);
};

const createTodoItem = (todo, index) => {
    const todoDiv = document.createElement('div');
    todoDiv.id = "todo-div";
    todoDiv.classList.add('todo-item');

    const todoCheckbox = createTodoCheckbox(todo, todoDiv);
    const todoDetails = createTodoDetails(todo, index);

    todoDiv.appendChild(todoCheckbox);
    todoDiv.appendChild(todoDetails);

    if (todo.completed) {
        todoDiv.classList.add('completed');
    }

    return todoDiv;
};

const createTodoCheckbox = (todo, todoDiv) => {
    const todoCheckbox = document.createElement('input');
    todoCheckbox.type = 'checkbox';
    todoCheckbox.checked = todo.completed || false;

    todoCheckbox.addEventListener('change', () => {
        todoDiv.classList.toggle('completed');
        todo.completed = todoCheckbox.checked;
        saveProjects(projects);
    });

    return todoCheckbox;
};

const createTodoDetails = (todo, index) => {
    const todoDetails = document.createElement('div');
    todoDetails.id = "to-do-details";

    const todoHeader = createTodoHeader(todo, index);
    const todoDescription = document.createElement('p');
    todoDescription.textContent = todo.description || '';

    const todoDueDate = document.createElement('p');
    todoDueDate.textContent = todo.dueDate || '';

    const todoPriority = createTodoPriorityElement(todo.priority);

    todoDetails.appendChild(todoHeader);
    todoDetails.appendChild(todoDescription);
    todoDetails.appendChild(todoDueDate);
    todoDetails.appendChild(todoPriority);

    return todoDetails;
};

const createTodoHeader = (todo, index) => {
    const todoHeader = document.createElement('div');
    todoHeader.id = "to-do-header";

    const todoTitle = document.createElement('h3');
    todoTitle.textContent = todo.title;

    const todoManageButtons = createManageButtons(todo, index);

    todoHeader.appendChild(todoTitle);
    todoHeader.appendChild(todoManageButtons);

    return todoHeader;
};

const createManageButtons = (todo, index) => {
    const todoManageButtons = document.createElement('div');

    const todoEditButton = document.createElement('button');
    todoEditButton.id = "todo-edit-button";
    todoEditButton.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    todoEditButton.addEventListener('click', () => openEditTaskDialog(todo, index));

    const todoDeleteButton = document.createElement('button');
    todoDeleteButton.id = "todo-delete-button";
    todoDeleteButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    todoDeleteButton.addEventListener('click', () => {
        currentProject.todos.splice(index, 1);
        displayTodos(currentProject.name);
    });

    todoManageButtons.appendChild(todoEditButton);
    todoManageButtons.appendChild(todoDeleteButton);

    return todoManageButtons;
};

const createTodoPriorityElement = (priority) => {
    const todoPriority = document.createElement('p');
    const priorityText = priority ? priority : '';

    todoPriority.textContent = priorityText.toUpperCase();
    if (priorityText === 'low') {
        todoPriority.classList.add('low-priority');
    } else if (priorityText === 'medium') {
        todoPriority.classList.add('medium-priority');
    } else if (priorityText === 'high') {
        todoPriority.classList.add('high-priority');
    }

    return todoPriority;
};

const displayTodos = (projectName) => {
    const todoSection = document.querySelector('#todo-section');
    displayProjectHeading(projectName);

    if (currentProject.todos.length === 0) {
        displayNoTodosMessage(todoSection);
    } else {
        currentProject.todos.forEach((todo, index) => {
            const todoDiv = createTodoItem(todo, index);
            todoSection.appendChild(todoDiv);
        });
    }

    const addTodoButton = document.getElementById('add-new-task-button');
    addTodoButton.removeEventListener('click', openAddTaskDialog);
    addTodoButton.addEventListener('click', openAddTaskDialog);
};

let editingIndex = null;
  
const openEditTaskDialog = (todo, index) => {
    const dialog = document.getElementById('add-new-task-dialog');
    document.getElementById('task-name').value = todo.title;
    document.getElementById('task-description').value = todo.description;
    document.getElementById('task-due-date').value = todo.dueDate;
    
    const priorityRadio = document.querySelector(`input[name="priority"][value="${todo.priority}"]`);
    if (priorityRadio) priorityRadio.checked = true;
  
    editingIndex = index; 
    dialog.showModal();
};
  
const getCheckedPriority = () => {
    const checkedRadio = document.querySelector('input[name="priority"]:checked');
    if (checkedRadio) {
        console.log(`Selected priority: ${checkedRadio.value}`);
        return checkedRadio.value;
    } else {
        return null;
    }
};

const openAddTaskDialog = () => {
    const dialog = document.getElementById('add-new-task-dialog');
    dialog.showModal();

    const form = document.getElementById('add-new-task-form');
    form.removeEventListener('submit', handleTaskFormSubmit); 
    form.addEventListener('submit', handleTaskFormSubmit);

    const closeButton = document.getElementById('add-new-task-dialog-close-button');
    closeButton.removeEventListener('click', () => dialog.close());
    closeButton.addEventListener('click', () => dialog.close());
};
  
const handleTaskFormSubmit = (event) => {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = getCheckedPriority();
  
    if (editingIndex !== null) {
      currentProject.todos[editingIndex].title = taskName;
      currentProject.todos[editingIndex].description = taskDescription;
      currentProject.todos[editingIndex].dueDate = dueDate;
      currentProject.todos[editingIndex].priority = priority;
      editingIndex = null;
    } else {
      const newTodo = createTodo(taskName, taskDescription, dueDate, priority);
      currentProject.addTodo(newTodo);
    }
  
    saveProjects(projects);
    displayTodos(currentProject.name);
    document.getElementById('add-new-task-dialog').close();
  };

export { displayProjects };
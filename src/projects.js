export const createProject = (name) => {
    const todos = [];
    
    const addTodo = (todo) => {
      todos.push(todo);
    };
  
    const removeTodo = (index) => {
      todos.splice(index, 1);
    };
  
    return { name, todos, addTodo, removeTodo };
};
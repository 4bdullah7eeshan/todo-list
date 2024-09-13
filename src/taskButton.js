const taskButton = (() => {
    const addTaskButton = document.getElementById('add-new-task-button');

    const show = () => {
        addTaskButton.style.display = 'block';
    };

    const hide = () => {
        addTaskButton.style.display = 'none';
    };

    return {
        show,
        hide,
    };
})();

export default taskButton;

document.addEventListener('DOMContentLoaded', function() {
    
    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';
    
    const title = document.createElement('h1');
    title.textContent = 'To-Do List';
    title.className = 'app-title';
    
    const form = document.createElement('form');
    form.className = 'todo-form';
    
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'Введите задачу...';
    taskInput.className = 'task-input';
    taskInput.required = true;
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'date-input';
    dateInput.required = true;
    
    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Добавить';
    addButton.className = 'add-button';
    
    form.append(taskInput, dateInput, addButton);
    
    const controlPanel = document.createElement('div');
    controlPanel.className = 'control-panel';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск задач...';
    searchInput.className = 'search-input';
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    
    const filterAll = document.createElement('button');
    filterAll.textContent = 'Все';
    filterAll.className = 'filter-btn active';
    filterAll.dataset.filter = 'all';
    
    const filterActive = document.createElement('button');
    filterActive.textContent = 'Активные';
    filterActive.className = 'filter-btn';
    filterActive.dataset.filter = 'active';
    
    const filterCompleted = document.createElement('button');
    filterCompleted.textContent = 'Выполненные';
    filterCompleted.className = 'filter-btn';
    filterCompleted.dataset.filter = 'completed';
    
    filterContainer.append(filterAll, filterActive, filterCompleted);
    
    const sortButton = document.createElement('button');
    sortButton.textContent = 'Сортировать по дате';
    sortButton.className = 'sort-btn';
    
    controlPanel.append(searchInput, filterContainer, sortButton);
    
    const todoList = document.createElement('ul');
    todoList.className = 'todo-list';
    
    appContainer.append(title, form, controlPanel, todoList);
    
    document.body.append(appContainer);
    
    console.log('Структура страницы создана!');

    function createTodoItem(text, date, isCompleted) {
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        if (isCompleted) {
            todoItem.classList.add('completed');
        }
        
        const todoContent = document.createElement('div');
        todoContent.className = 'todo-content';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = isCompleted;
        
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = text;
        
        const todoDate = document.createElement('span');
        todoDate.className = 'todo-date';
        todoDate.textContent = date;
        
        todoContent.append(checkbox, todoText, todoDate);
        
        const todoActions = document.createElement('div');
        todoActions.className = 'todo-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Редактировать';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        
        todoActions.append(editBtn, deleteBtn);
        
        todoItem.append(todoContent, todoActions);
        
        return todoItem;
    }
    
    todoList.append(createTodoItem('Купить продукты в магазине', '15.10.2025', false));
    todoList.append(createTodoItem('Написать отчет по проекту', '14.10.2025', false));
    todoList.append(createTodoItem('Позвонить врачу', '13.10.2025', true));
    todoList.append(createTodoItem('Подготовиться к презентации', '16.10.2025', false));
    todoList.append(createTodoItem('Сделать домашнее задание', '12.10.2025', true));
    
    console.log('Тестовые задачи добавлены!');
});

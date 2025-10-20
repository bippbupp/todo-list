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

    let todos = [];
    
    function createTodoElement(todo) {
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        todoItem.dataset.id = todo.id;
        todoItem.draggable = true;
        
        if (todo.completed) {
            todoItem.classList.add('completed');
        }
        
        const todoContent = document.createElement('div');
        todoContent.className = 'todo-content';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;
        
        const todoDate = document.createElement('span');
        todoDate.className = 'todo-date';
        todoDate.textContent = todo.date;
        
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
    
    function renderTodos() {
        todoList.textContent = '';
        
        todos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoList.append(todoElement);
        });
        
        console.log('Список задач отрендерен. Всего задач:', todos.length);
    }
    
    todos = [
        { id: 1, text: 'Купить продукты в магазине', date: '15.10.2025', completed: false },
        { id: 2, text: 'Написать отчет по проекту', date: '14.10.2025', completed: false },
        { id: 3, text: 'Позвонить врачу', date: '13.10.2025', completed: true },
        { id: 4, text: 'Подготовиться к презентации', date: '16.10.2025', completed: false },
        { id: 5, text: 'Сделать домашнее задание', date: '12.10.2025', completed: true }
    ];

    let nextId = 6;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;
        
        if (taskText === '' || taskDate === '') {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        const newTodo = {
            id: nextId++,
            text: taskText,
            date: taskDate.split('-').reverse().join('.'),
            completed: false
        };
        
        todos.push(newTodo);
        
        taskInput.value = '';
        dateInput.value = '';
        
        renderTodos();
        
        console.log('Добавлена новая задача:', newTodo);
        console.log('Всего задач:', todos.length);
    });
    
    function deleteTodo(todoId) {
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        
        if (todoIndex !== -1) {
            const deletedTodo = todos.splice(todoIndex, 1)[0];
            
            console.log('Удалена задача:', deletedTodo);
            console.log('Осталось задач:', todos.length);
            
            renderTodos();
        }
    }
    
    todoList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const todoItem = event.target.closest('.todo-item');
            
            const todoId = parseInt(todoItem.dataset.id);
            
            deleteTodo(todoId);
        }
    });
        
    renderTodos();
    
});
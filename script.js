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
    
    // console.log('Структура страницы создана!');

    let todos = [];
    let editingTodoId = null;
    let isSorted = false;
    let currentFilter = 'all';
    let searchQuery = '';
    let nextId = 1;
    let draggedTodoId = null;
    
    function saveTodosToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('nextId', nextId.toString());
        // console.log('Задачи сохранены в localStorage');
    }
    
    function loadTodosFromLocalStorage() {
        const savedTodos = localStorage.getItem('todos');
        const savedNextId = localStorage.getItem('nextId');
        
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
            // console.log('Задачи загружены из localStorage:', todos.length);
        } else {
            todos = [
                { id: 1, text: 'Купить продукты в магазине', date: '15.10.2025', completed: false },
                { id: 2, text: 'Написать отчет по проекту', date: '14.10.2025', completed: false },
                { id: 3, text: 'Позвонить врачу', date: '13.10.2025', completed: true },
                { id: 4, text: 'Подготовиться к презентации', date: '16.10.2025', completed: false },
                { id: 5, text: 'Сделать домашнее задание', date: '12.10.2025', completed: true }
            ];
            nextId = 6;
            // console.log('Загружены тестовые данные');
        }
        
        if (savedNextId) {
            nextId = parseInt(savedNextId);
        }
    }

    function reorderTodos(draggedId, targetId) {
        const draggedIndex = todos.findIndex(todo => todo.id === draggedId);
        const targetIndex = todos.findIndex(todo => todo.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        const draggedTodo = todos.splice(draggedIndex, 1)[0];
        todos.splice(targetIndex, 0, draggedTodo);
        
        // console.log('Порядок задач изменен');
        saveTodosToLocalStorage();
        renderTodos();
    }
    
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
        
        let displayTodos = [...todos];
        
        if (currentFilter === 'active') {
            displayTodos = displayTodos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            displayTodos = displayTodos.filter(todo => todo.completed);
        }

        if (searchQuery) {
            displayTodos = displayTodos.filter(todo => 
                todo.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (isSorted) {
            displayTodos.sort((a, b) => {
                const dateA = a.date.split('.').reverse().join('-');
                const dateB = b.date.split('.').reverse().join('-');
                return new Date(dateA) - new Date(dateB);
            });
        }
        
        displayTodos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoList.append(todoElement);
        });
        
        // console.log('Список задач отрендерен. Всего задач:', displayTodos.length);
    }
    
    loadTodosFromLocalStorage();

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
        
        saveTodosToLocalStorage();
        renderTodos();
        
        // console.log('Добавлена новая задача:', newTodo);
        // console.log('Всего задач:', todos.length);
    });
    
    function deleteTodo(todoId) {
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        
        if (todoIndex !== -1) {
            const deletedTodo = todos.splice(todoIndex, 1)[0];
            
            // console.log('Удалена задача:', deletedTodo);
            // console.log('Осталось задач:', todos.length);
            saveTodosToLocalStorage();

            renderTodos();
        }
    }

    function toggleTodoComplete(todoId) {
        const todo = todos.find(todo => todo.id === todoId);
        
        if (todo) {
            todo.completed = !todo.completed;
            // console.log('Статус задачи изменен:', todo);
            saveTodosToLocalStorage();
            renderTodos();
        }
    }

    function startEditTodo(todoId) {
        if (editingTodoId !== null) {
            return;
        }
        
        editingTodoId = todoId;
        const todo = todos.find(todo => todo.id === todoId);
        const todoItem = document.querySelector(`[data-id="${todoId}"]`);
        
        if (!todo || !todoItem) return;
        
        const todoText = todoItem.querySelector('.todo-text');
        const todoDate = todoItem.querySelector('.todo-date');
        const editBtn = todoItem.querySelector('.edit-btn');
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'todo-text edit-input';
        textInput.value = todo.text;
        
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'todo-date edit-input';
        dateInput.value = todo.date.split('.').reverse().join('-');
        
        todoText.replaceWith(textInput);
        todoDate.replaceWith(dateInput);
        editBtn.textContent = 'Сохранить';
        
        textInput.focus();
    }
    
    function saveEditTodo(todoId) {
        const todo = todos.find(todo => todo.id === todoId);
        const todoItem = document.querySelector(`[data-id="${todoId}"]`);
        
        if (!todo || !todoItem) return;
        
        const textInput = todoItem.querySelector('input[type="text"].edit-input');
        const dateInput = todoItem.querySelector('input[type="date"].edit-input');
        
        const newText = textInput.value.trim();
        const newDate = dateInput.value;
        
        if (newText === '' || newDate === '') {
            alert('Текст и дата не могут быть пустыми!');
            return;
        }
        
        todo.text = newText;
        todo.date = newDate.split('-').reverse().join('.');
        
        editingTodoId = null;
        
        // console.log('Задача отредактирована:', todo);
        saveTodosToLocalStorage();
        renderTodos();
    }
    
    todoList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const todoItem = event.target.closest('.todo-item');
            const todoId = parseInt(todoItem.dataset.id);
            deleteTodo(todoId);
        }

        if (event.target.classList.contains('todo-checkbox')) {
            const todoItem = event.target.closest('.todo-item');
            const todoId = parseInt(todoItem.dataset.id);
            toggleTodoComplete(todoId);
        }

        if (event.target.classList.contains('edit-btn')) {
            const todoItem = event.target.closest('.todo-item');
            const todoId = parseInt(todoItem.dataset.id);
            
            if (editingTodoId === todoId) {
                saveEditTodo(todoId);
            } else {
                startEditTodo(todoId);
            }
        }
    });

    sortButton.addEventListener('click', function() {
        isSorted = !isSorted;
        
        if (isSorted) {
            sortButton.textContent = 'Отменить сортировку';
            // console.log('Задачи отсортированы по дате');
        } else {
            sortButton.textContent = 'Сортировать по дате';
            // console.log('Сортировка отменена');
        }
        
        renderTodos();
    });
    
    filterContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('filter-btn')) {
            currentFilter = event.target.dataset.filter;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            event.target.classList.add('active');
            
            // console.log('Фильтр изменен:', currentFilter);
            renderTodos();
        }
    });
    
    searchInput.addEventListener('input', function(event) {
        searchQuery = event.target.value.trim();
        // console.log('Поисковый запрос:', searchQuery);
        renderTodos();
    });

    todoList.addEventListener('dragstart', function(event) {
        if (event.target.classList.contains('todo-item')) {
            draggedTodoId = parseInt(event.target.dataset.id);
            event.target.classList.add('dragging');
            // console.log('Начато перетаскивание задачи:', draggedTodoId);
        }
    });
    
    todoList.addEventListener('dragend', function(event) {
        if (event.target.classList.contains('todo-item')) {
            event.target.classList.remove('dragging');
            draggedTodoId = null;
            // console.log('Перетаскивание завершено');
        }
    });
    
    todoList.addEventListener('dragover', function(event) {
        event.preventDefault();
        
        const afterElement = getDragAfterElement(todoList, event.clientY);
        const draggingElement = document.querySelector('.dragging');
        
        if (afterElement == null) {
            todoList.appendChild(draggingElement);
        } else {
            todoList.insertBefore(draggingElement, afterElement);
        }
    });
    
    todoList.addEventListener('drop', function(event) {
        event.preventDefault();
        
        if (draggedTodoId === null) return;
        
        const dropTarget = event.target.closest('.todo-item');
        
        if (dropTarget && dropTarget.dataset.id) {
            const targetId = parseInt(dropTarget.dataset.id);
            
            if (draggedTodoId !== targetId) {
                reorderTodos(draggedTodoId, targetId);
            }
        }
    });
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    renderTodos();
    
});
// ITCS333 A3 starter — implement the to-do app per README.
// You may wrap everything in a DOMContentLoaded handler or an IIFE.
// Requirements: add / toggle-complete / delete / filter / counter,
// using event delegation on #todo-list.

// TODO: your code here
document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const errorMsg = document.getElementById('error-msg');
    const counter = document.getElementById('counter');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();

        if (text === '') {
            errorMsg.classList.remove('hidden');
            errorMsg.style.display = 'block';
            return;
        }

        errorMsg.classList.add('hidden');
        errorMsg.style.display = 'none';

        const li = document.createElement('li');
        li.innerHTML = `
            <span class="item-text">${text}</span>
            <button class="delete-btn">Delete</button>
        `;

        todoList.appendChild(li);
        todoInput.value = '';
        
        updateCounter();
        applyFilter();
    });

    // استخدام الـ Event Delegation المباشر على #todo-list فقط
    todoList.addEventListener('click', (e) => {
        const target = e.target;

        if (target.classList.contains('delete-btn')) {
            const li = target.closest('li');
            if (li) {
                li.remove();
                updateCounter();
            }
        } else {
            const li = target.closest('li');
            if (li) {
                li.classList.toggle('completed');
                updateCounter();
                applyFilter();
            }
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (button.id === 'filter-all') currentFilter = 'all';
            if (button.id === 'filter-active') currentFilter = 'active';
            if (button.id === 'filter-done') currentFilter = 'done';

            applyFilter();
        });
    });

    function applyFilter() {
        const items = todoList.querySelectorAll('li');
        items.forEach(item => {
            const isCompleted = item.classList.contains('completed');
            if (currentFilter === 'all') {
                item.style.display = '';
            } else if (currentFilter === 'active') {
                item.style.display = isCompleted ? 'none' : '';
            } else if (currentFilter === 'done') {
                item.style.display = isCompleted ? '' : 'none';
            }
        });
    }

    function updateCounter() {
        const items = todoList.querySelectorAll('li');
        let activeCount = 0;
        items.forEach(item => {
            if (!item.classList.contains('completed')) {
                activeCount++;
            }
        });
        counter.textContent = `${activeCount} item(s) left`;
    }

    updateCounter();
});
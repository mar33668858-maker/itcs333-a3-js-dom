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

    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterDone = document.getElementById('filter-done');

    let currentFilter = 'all';

    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = todoInput.value.trim();

        if (text === '') {
            errorMsg.classList.remove('hidden');
            return;
        }

        errorMsg.classList.add('hidden');

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

    // استخدام closest لتجنب مشاكل النقر على العقد النصية داخل العناصر
    todoList.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.delete-btn');
        const itemText = e.target.closest('.item-text');
        const li = e.target.closest('li');

        if (!li) return;

        if (deleteBtn) {
            li.remove();
        } else if (itemText || e.target.tagName === 'LI') {
            li.classList.toggle('completed');
        }
        
        updateCounter();
        applyFilter();
    });

    function setActiveButton(activeBtn) {
        filterAll.classList.remove('active');
        filterActive.classList.remove('active');
        filterDone.classList.remove('active');
        activeBtn.classList.add('active');
    }

    filterAll.addEventListener('click', () => {
        setActiveButton(filterAll);
        currentFilter = 'all';
        applyFilter();
    });

    filterActive.addEventListener('click', () => {
        setActiveButton(filterActive);
        currentFilter = 'active';
        applyFilter();
    });

    filterDone.addEventListener('click', () => {
        setActiveButton(filterDone);
        currentFilter = 'done';
        applyFilter();
    });

    function applyFilter() {
        const items = todoList.querySelectorAll('li');
        items.forEach(item => {
            const isCompleted = item.classList.contains('completed');
            if (currentFilter === 'all') {
                item.style.display = 'flex';
            } else if (currentFilter === 'active') {
                item.style.display = isCompleted ? 'none' : 'flex';
            } else if (currentFilter === 'done') {
                item.style.display = isCompleted ? 'flex' : 'none';
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
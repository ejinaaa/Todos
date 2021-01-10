/* eslint-disable max-len */
// Nodes
const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completedAllCheckbox = document.querySelector('.complete-all > .checkbox');
const $completedAll = document.querySelector('.complete-all');
const $completedCounter = document.querySelector('.clear-completed .completed-todos');
const $uncompletedCounter = document.querySelector('.clear-completed .active-todos');
const $completedCounterBtn = document.querySelector('.clear-completed > .btn');
const $nav = document.querySelector('.nav');
const $allTodosBtn = document.getElementById('all');
const $activeTodosBtn = document.getElementById('active');
const $completedTodosBtn = document.getElementById('completed');

let todos = [];

const render = (() => {
  const innerHtml = (id, content, completed) => `<li id="${id}" class="todo-item">
<input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
<label for="ck-${id}" style="color: ${completed ? 'lightgrey' : ''}; 
text-decoration: ${completed ? 'line-through' : ''}">${content}</label>
<i class="remove-todo far fa-times-circle"></i></li>`;

  return () => {
    if ($activeTodosBtn.className === 'active') {
      $todos.innerHTML = todos.filter(({ completed }) => completed === false)
        .map(({ id, content, completed }) => innerHtml(id, content, completed)).join('');

      $completedCounter.textContent = 0;
      $uncompletedCounter.textContent = $todos.children.length;
    } else if ($completedTodosBtn.className === 'active') {
      $todos.innerHTML = todos.filter(({ completed }) => completed === true)
        .map(({ id, content, completed }) => innerHtml(id, content, completed)).join('');

      $completedCounter.textContent = $todos.children.length;
      $uncompletedCounter.textContent = 0;
    } else {
      $todos.innerHTML = todos.map(({ id, content, completed }) => innerHtml(id, content, completed)).join('');

      $completedCounter.textContent = todos.filter(({ completed }) => completed).length;
      $uncompletedCounter.textContent = todos.filter(({ completed }) => !completed).length;
    }
  };
})();

const fetchTodo = () => {
  todos = [
    { id: 1, content: 'HTML', completed: true },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'JavaScript', completed: false }
  ];

  todos.sort((todo1, todo2) => (todo1.id < todo2.id ? 1 : (todo1.id > todo2.id ? -1 : 0)));
  render();
};

const addTodo = (() => {
  const generateId = () => Math.max(...todos.map(({ id }) => id), 0) + 1;

  return () => {
    todos = [{ id: generateId(), content: $inputTodo.value, completed: false }, ...todos];
    render();
  };
})();

const removeTodo = targetId => {
  todos = todos.filter(({ id }) => id !== +targetId);
  if (todos.length === todos.filter(({ completed }) => completed).length) $completedAllCheckbox.checked = true;
  render();
};

const checkCompleteAll = () => {
  $completedAllCheckbox.checked = true;
};
const uncheckCompleteAll = () => {
  $completedAllCheckbox.checked = false;
};

const toggleTodo = target => {
  todos = todos.map(({ id, content, completed }) => ({
    id,
    content,
    completed: +target.parentNode.id === id ? !completed : completed
  }));
  render();
};

const toggleCompletedAll = () => {
  todos = todos.map(({ id, content }) => ({
    id,
    content,
    completed: !!$completedAllCheckbox.checked
  }));
  render();
};

const removeCompletedTodos = () => {
  todos = todos.filter(({ completed }) => !completed);
  render();
};

// Events
document.addEventListener('DOMContentLoaded', fetchTodo);

$inputTodo.addEventListener('keyup', e => {
  if (!$inputTodo.value) return;
  if (e.key !== 'Enter') return;
  addTodo();
  $inputTodo.value = '';
  uncheckCompleteAll();
});

$todos.addEventListener('click', e => {
  if (!e.target.matches('.remove-todo')) return;
  removeTodo(e.target.parentNode.id);
});

$todos.addEventListener('change', e => {
  toggleTodo(e.target);
  if (todos.filter(({ completed }) => completed).length === todos.length) checkCompleteAll();
  else uncheckCompleteAll();
});

$completedAll.addEventListener('change', () => {
  toggleCompletedAll();
});

$completedCounterBtn.addEventListener('click', () => {
  removeCompletedTodos();
  uncheckCompleteAll();
});

$nav.addEventListener('click', e => {
  [...e.currentTarget.children].forEach(childNode => {
    childNode.classList.remove('active');
  });
  e.target.classList.add('active');

  render();
});

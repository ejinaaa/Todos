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

// Functions
const countCompletedTodos = () => {
  $completedCounter.textContent = todos.filter(({ completed }) => completed).length;
  $uncompletedCounter.textContent = todos.filter(({ completed }) => !completed).length;
};

const renderAll = () => {
  $todos.innerHTML = todos.map(({ id, content, completed }) => `<li id="${id}" class="todo-item">
  <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
  <label for="ck-${id}" style="color: ${completed ? 'lightgrey' : ''}; 
  text-decoration: ${completed ? 'line-through' : ''}">${content}</label>
  <i class="remove-todo far fa-times-circle"></i></li>`).join('');

  countCompletedTodos();
};

const renderActive = () => {
  $todos.innerHTML = todos.filter(({ completed }) => completed === false)
    .map(({ id, content, completed }) => `<li id="${id}" class="todo-item">
  <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
  <label for="ck-${id}" style="color: ${completed ? 'lightgrey' : ''}; 
  text-decoration: ${completed ? 'line-through' : ''}">${content}</label>
  <i class="remove-todo far fa-times-circle"></i></li>`).join('');

  $completedCounter.textContent = 0;
  $uncompletedCounter.textContent = $todos.children.length;
};

const renderCompleted = () => {
  $todos.innerHTML = todos.filter(({ completed }) => completed === true)
    .map(({id, content, completed }) => `<li id="${id}" class="todo-item">
  <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
  <label for="ck-${id}" style="color: ${completed ? 'lightgrey' : ''}; 
  text-decoration: ${completed ? 'line-through' : ''}">${content}</label>
  <i class="remove-todo far fa-times-circle"></i></li>`).join('');

  $completedCounter.textContent = $todos.children.length;
  $uncompletedCounter.textContent = 0;
};

const render = () => {
  if ($activeTodosBtn.className !== 'active'
    && $completedTodosBtn.className !== 'active') renderAll();
  else if ($activeTodosBtn.className === 'active') renderActive();
  else if ($completedTodosBtn.className === 'active') renderCompleted();
};

const fetchTodo = () => {
  todos = [
    { id: 1, content: 'HTML', completed: true },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'JavaScript', completed: false }
  ];

  todos.sort((todo1, todo2) => (todo1.id < todo2.id ? 1 : (todo1.id > todo2.id ? -1 : 0)));
  renderAll();
};

const generateId = () => Math.max(...todos.map(({ id }) => id), 0) + 1;

const addTodo = () => {
  todos = [{ id: generateId(), content: $inputTodo.value, completed: false }, ...todos];
  render();
};

const removeTodo = targetId => {
  todos = todos.filter(({id}) => id !== +targetId);
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
  if (e.target === $allTodosBtn) {
    renderAll();
  } else if (e.target === $activeTodosBtn) {
    renderActive();
  } else if (e.target === $completedTodosBtn) {
    renderCompleted();
  }

  [...e.currentTarget.children].forEach(childNode => {
    childNode.classList.remove('active');
  });
  e.target.classList.add('active');
});

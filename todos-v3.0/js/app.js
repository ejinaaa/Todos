// Nodes
const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completeAllCheckbox = document.querySelector('.complete-all > .checkbox');
const $completedTodosCounter = document.querySelector('.completed-todos');
const $incompletedTodosCounter = document.querySelector('.active-todos');
const $removeCompleteTodosBtn = document.querySelector('.clear-completed > .btn');
const $nav = document.querySelector('.nav');
const $allBtn = document.querySelector('.nav > #all');
const $activeBtn = document.querySelector('.nav > #active');
const $completedBtn = document.querySelector('.nav > #completed');

let todos = [];

// Functions
const generateId = () => Math.max(...todos.map(({ id }) => id), 1) + 1;

const filterCompletedTodos = () => todos.filter(({ completed }) => completed === true);

const filterIncompletedTodos = () => todos.filter(({ completed }) => completed === false);

const countCompleteTodo = () => {
  $completedTodosCounter.textContent = filterCompletedTodos().length;
  $incompletedTodosCounter.textContent = filterIncompletedTodos().length;
};

const render = (() => {
  const innerHtml = (id, content, completed) => `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
    <label for="ck-${id}" style="color: ${completed ? 'lightgrey' : ''}; 
      text-decoration: ${completed ? 'line-through' : ''};">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>`;

  return () => {
    if ($completedBtn.className === 'active') {
      $todos.innerHTML = filterCompletedTodos()
        .map(({ id, content, completed }) => innerHtml(id, content, completed)).join('');
    } else if ($activeBtn.className === 'active') {
      $todos.innerHTML = filterIncompletedTodos()
        .map(({ id, content, completed }) => innerHtml(id, content, completed)).join('');
    } else if ($allBtn.className === 'active' || $inputTodo.key === 'Enter') {
      $todos.innerHTML = todos
        .map(({ id, content, completed }) => innerHtml(id, content, completed)).join('');
    }
    countCompleteTodo();
  };
})();

const fetchTodo = () => {
  todos = [
    { id: 1, content: 'HTML', completed: true },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'JavaScript', completed: false }
  ];

  todos.sort((todo1, todo2) => (todo1.id < todo2.id ? 1 : todo1.id > todo2.id ? -1 : 0));
  render();
};

const addTodo = value => {
  todos = [{ id: generateId(), content: value, completed: false }, ...todos];
};

const removeTodo = targetId => {
  todos = todos.filter(({ id }) => +targetId !== id);
};

const removeCompleteTodos = () => {
  todos = filterIncompletedTodos();
};

const toggleTodo = targetId => {
  todos = todos.map(todo => ({ ...todo, completed: todo.id === +targetId ? !todo.completed : todo.completed}));
};

const toggleCompleteAll = checked => {
  todos = todos.map(({ id, content }) => ({ id, content, completed: !!checked }));
};

const checkCompleteAll = () => {
  $completeAllCheckbox.checked = (todos.filter(({ completed }) => completed).length !== todos.length || todos.length === 0) ? false : true;
};

const changeActiveBtn = e => {
  [...e.currentTarget.children].forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
};

// Events
document.addEventListener('DOMContentLoaded', fetchTodo);

$inputTodo.addEventListener('keyup', e => {
  if (e.target.value === '' || e.key !== 'Enter') return;
  if ($completedBtn.className === 'active') {
    $completedBtn.classList.remove('active');
    $allBtn.classList.add('active');
  }
  addTodo(e.target.value);
  render();

  e.target.value = '';
  $completeAllCheckbox.checked = false;
});

$todos.addEventListener('click', e => {
  if (!e.target.matches('.remove-todo')) return;
  removeTodo(e.target.parentNode.id);
  render();
  checkCompleteAll();
});

$todos.addEventListener('change', e => {
  toggleTodo(e.target.parentNode.id);
  render();
  checkCompleteAll();
});

$completeAllCheckbox.addEventListener('change', e => {
  toggleCompleteAll(e.currentTarget.checked);
  render();
});

$removeCompleteTodosBtn.addEventListener('click', () => {
  removeCompleteTodos();
  render();
  checkCompleteAll();
});

$nav.addEventListener('click', e => {
  changeActiveBtn(e);
  render();
});
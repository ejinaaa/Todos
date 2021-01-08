const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completeAll = document.querySelector('.complete-all');
const $completeAllCheckbox = document.querySelector('.complete-all > .checkbox');
const $completeTodosNumber = document.querySelector('.completed-todos');
const $uncompleteTodosNumber = document.querySelector('.active-todos');
const $removeCompletedTodosBtn = document.querySelector('.clear-completed > .btn')

let todos = [];

// Functions
const countTodos = () => {
  $completeTodosNumber.textContent = todos.filter(({ completed }) => completed).length;
  $uncompleteTodosNumber.textContent = todos.filter(({ completed }) => !completed).length;
};

const changeCompleteAllCheckbox = () => {
  $completeAllCheckbox.checked = todos.filter(todo => todo.completed === true).length === todos.length ? true : false;
};

const render = () => {
  $todos.innerHTML = todos.map(({ id, content, completed }) => `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
    <label for="ck-${id}">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>`).join('');

  countTodos();
  changeCompleteAllCheckbox();
};

const fetchTodo = () => {
  todos = [
    { id: 1, content: 'HTML', completed: true },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'JavaScript', completed: false },
  ];

  todos = [...todos].sort((todo1, todo2) => todo1.id < todo2.id ? 1 : todo1.id > todo2.id ? -1 : 0);
  render();
};

const addTodo = (() => {
  const generateId = () => {
    return Math.max(...todos.map(({ id }) => id), 0);
  };
  
  return () => {
    if (!$inputTodo.value) return;
    todos = [{ id: generateId() + 1, content: $inputTodo.value, completed: false }, ...todos];
    render();
  }
})();

const removeTodo = id => {
  todos = todos.filter((todo) => !(todo.id === +id));
  render();
};

const toggleTodo = targetId => {
  todos = todos.map(({ id, content, completed }) => ({id, content, completed: (id === +targetId ? !completed : completed)}));
  render();
};

const checkCompleteAll = () => {
  todos = todos.map(({ id, content, completed }) => ({ id, content, completed: $completeAllCheckbox.checked ? true : false}));
  render();
};

const removeCompletedTodos = () => {
  todos = todos.filter(({ completed }) => !completed);
  render();
};

// Events
document.addEventListener('DOMContentLoaded', fetchTodo);

$inputTodo.addEventListener('keyup', e => {
  if (!(e.key === 'Enter')) return;
  addTodo();
  $inputTodo.value = '';
});

$todos.addEventListener('click', e => {
  if (!e.target.matches('.remove-todo')) return;
  removeTodo(e.target.parentNode.id);
});

$todos.addEventListener('change', e => {
  toggleTodo(e.target.parentNode.id);
});

$completeAll.addEventListener('change', () => {
  checkCompleteAll();
});

$removeCompletedTodosBtn.addEventListener('click', () => {
  removeCompletedTodos();
  $completeAllCheckbox.checked = false;
});
const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completeAll = document.querySelector('.complete-all');
const $completeAllCheckbox = document.getElementById('ck-complete-all');
const $removeCompletedBtn = document.querySelector('.clear-completed > .btn');
const $completedCount = document.querySelector('.completed-todos');
const $activeCount = document.querySelector('.active-todos');

let todos = [];

const render = () => {
  $todos.innerHTML = todos.map(({ id, content, completed }) => `<li id="${id}" class="todo-item">
      <input id="ch-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
      <label for="ck-${id}" style="color: ${completed ? 'lightgrey' : ''}; text-decoration: ${completed ? 'line-through' : ''}">${content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>`).join('');
  
  if (todos.length === todos.filter(({ completed }) => completed).length) {
    $completeAllCheckbox.checked = true;
  }
  if (todos.length !== todos.filter(({ completed }) => completed).length) {
    $completeAllCheckbox.checked = false;
  }

  $completedCount.textContent = todos.filter(({ completed }) => completed).length;
  $activeCount.textContent = todos.filter(({ completed }) => !completed).length;
};

const fetchTodo = () => {
  todos = [
    { id: 1, content: 'HTML', completed: true },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'JavaScript', completed: false }
  ];
  todos.sort((todo1, todo2) => (todo1.id > todo2.id ? -1 : (todo1.id < todo2.id ? 1 : 0)));

  render();
};

const addTodo = (() => {
  const newId = () => Math.max(...todos.map(({ id }) => id), 0);
  return e => {
  todos = [{ id: newId() + 1, content: e.target.value, completed: false }, ...todos];
  render();
  };
})();

const removeTodo = targetId => {
  todos = todos.filter(todo => +targetId !== todo.id);
  render();
};

const toggleTodo = targetId => {
  todos = todos.map(({ id, content, completed}) => ({ id,
    content,
    completed: +targetId === id ? !completed : completed }));
  render();
};

const checkCompleteAll = () => {
  if (!$completeAllCheckbox.checked) {
    todos = todos.map(({ id, content }) => ({ id, content, completed: false }));
  } else {
    todos = todos.map(({ id, content }) => ({ id, content, completed: true }));
  }
  render();
}

const removeCompletedTodo = () => {
  todos = todos.filter(({ completed }) => !completed);
  render();
}

document.addEventListener('DOMContentLoaded', fetchTodo);

$inputTodo.addEventListener('keyup', e => {
  if (e.key !== 'Enter') return;
  if (!$inputTodo.value) return;

  addTodo(e);
  $inputTodo.value = '';
});

$todos.addEventListener('click', e => {
  const targetId = e.target.parentNode.id;
  if (e.target.matches('.todo-item > .remove-todo')) removeTodo(targetId);
  if (e.target.matches('.todo-item > label')) toggleTodo(targetId);
});

$completeAll.addEventListener('click', () => {
  checkCompleteAll();
});

$removeCompletedBtn.addEventListener('click', () => {
  removeCompletedTodo();
});

// 2021-01-02 23:30 ~ 2021-01-03 02:20 완성
const $form = document.querySelector('form');
const $textBox = document.querySelector('.textBox');
const $label = document.querySelector('label');
const $todos = document.querySelector('.todos');

const moveLabel = () => {
  $label.style.transform = 'translate(0, -34px)';
  $label.style.transition = '0.3s';
};

const addTodo = () => {
  const $li = document.createElement('li');
  const $checkbox = document.createElement('input');
  const $todoText = document.createElement('span');
  const $removeBtn = document.createElement('button');

  $checkbox.setAttribute('type', 'checkbox');
  $todoText.textContent = $textBox.value;
  $removeBtn.textContent = 'X';

  $checkbox.className = 'checkbox';
  $todoText.className = 'todoText';
  $removeBtn.className = 'removeBtn';

  $li.appendChild($checkbox);
  $li.appendChild($todoText);
  $li.appendChild($removeBtn);
  $todos.appendChild($li);

  $textBox.value = '';
  $textBox.focus();

  $checkbox.onclick = () => {
    if ($checkbox.checked) $todoText.classList.add('checked');
    else if (!$checkbox.checked) $todoText.classList.remove('checked');
  };

  $removeBtn.onclick = () => {
    $li.remove();
  };
};

if ($textBox.autofocus) {
  moveLabel();
}
$textBox.oninput = () => {
  moveLabel();
};
$textBox.onblur = () => {
  if ($textBox.value) return;
  $label.style.transform = 'translate(0, 0)';
};

$form.onsubmit = e => {
  e.preventDefault();
  if (!$textBox.value) return;
  addTodo();
};
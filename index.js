// import {TodoItem} from '/todo-item.js';
// import {Todo2Item} from '/todo2-item.js';
// import {TodoInput} from '/todo-input.js';
import { v4 as uuidv4 } from './node_modules/uuid/dist/esm-browser/index.js';

// ui components
// https://github.com/material-components/material-web/tree/master/docs/components
// index.js
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/elevated-button.js';
import '@material/web/icon/icon.js';
import '@material/web/navigationdrawer/navigation-drawer.js';

import { MDCList } from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;

const todoList = document.querySelector('#todo-list');
const todoInput = document.querySelector('todo-input');
const todos = [];

// setup close drawer button
const closeDrawerButton = document.querySelector('#close-drawer');
closeDrawerButton.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#drawer').opened = false;
});
// setup open drawer button
const openDrawerButton = document.querySelector('#open-drawer');
openDrawerButton.addEventListener('click', (e) => {
  e.preventDefault();
  let isOpened = document.querySelector('#drawer').opened;
  document.querySelector('#drawer').opened = !isOpened;
});

// listen for drawer events
// document.addEventListener('navigation-drawer-changed', (e) => {
document.addEventListener('navigation-drawer-changed', (e) => {
  // if (e.detail.opened) {
  //   openDrawerButton.style['visibility'] = "hidden";
  //   closeDrawerButton.style['visibility'] = "visible";
  // } else {
  //   openDrawerButton.style['visibility'] = "visible";
  //   closeDrawerButton.style['visibility'] = "hidden";
  // }
  const drawer = document.querySelector('#drawer');
  if (e.detail.opened) {
    drawer.style['display'] = "block";
  } else {
    drawer.style['display'] = "none";
  }
});

// setup add button listener
const addButton = document.querySelector('#add-todo');
addButton.addEventListener('click', (e) => {
  e.preventDefault();

  let title = document.querySelector('#todo-title').value;
  let description = document.querySelector('#todo-description').value;
  const todo = {
    id: uuidv4(),
    title: title,
    description: description,
    completed: false,
  };

  // send 'add' event
  const event = new CustomEvent('add-todo-item', {
    bubbles: true,
    composed: true,
    detail: todo,
  });
  document.dispatchEvent(event);

  // clear input fields
  document.querySelector('#todo-title').value = '';
  document.querySelector('#todo-description').value = '';

  // focus on title input
  document.querySelector('#todo-title').focus();
});

// listen for "enter" keypress on input
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' &&
    (e.target.id === 'todo-title' || e.target.id === 'todo-description'
    )) {
    e.preventDefault();
    addButton.click();
  }
});

function initTodos() {
  todos.push({
    id: '12345',
    title: 'A Real Todo',
    description: 'A real description',
    completed: false,
  })
  todos.push({
    id: '12346',
    title: 'Another Real Todo',
    description: 'Another real description',
    completed: true,
  })
  todos.push({
    id: '12347',
    title: 'Yet Another Real Todo',
    description: 'Yet another real description',
    completed: false,
  })

  document.dispatchEvent(new CustomEvent('set-todos', {
    bubbles: true,
    composed: true,
    detail: todos
  }));
}

initTodos();
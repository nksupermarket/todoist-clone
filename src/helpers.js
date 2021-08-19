import { listOfPjs, listOfTodos } from './projects.js';

const helpers = {
  saveToLS(list) {
    const iceBlock = JSON.stringify(list);
    switch (list) {
      case listOfTodos: {
        localStorage.setItem('listOfTodos', iceBlock);
        break;
      }
      case listOfPjs: {
        localStorage.setItem('listOfPjs', iceBlock);
        break;
      }
    }
  },
  pushTo(list, obj) {
    list.push(obj);
  },
  show(el) {
    el.classList.remove('inactive');
  },
  hide(el) {
    el.classList.add('inactive');
  },
  findItem(list, id) {
    return list.find((item) => item.id.toString() === id.toString());
  },
  findTodoFrom(btn, list) {
    const hyphen = btn.dataset.id.search('-');
    const todoId = btn.dataset.id.slice(hyphen + 1);
    const todo = helpers.findItem(list, todoId);
    return todo;
  },
  createIconBtn(iconName, className) {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'icon-btn', className);

    const icon = document.createElement('i');
    icon.classList.add('flaticon', iconName);
    btn.prepend(icon);

    return btn;
  },
  createPJEditor(className) {
    const ctn = document.createElement('div');
    ctn.classList.add('inactive', 'pj-editor');

    const titleInput = document.createElement('input');
    titleInput.classList.add('title-input', className);
    ctn.appendChild(titleInput);

    const editorActions = document.createElement('div');
    editorActions.classList.add('editor-actions');
    ctn.appendChild(editorActions);

    const saveBtn = document.createElement('button');
    saveBtn.classList.add('btn', 'act-btn', 'save-btn');
    saveBtn.setAttribute('type', 'button');
    saveBtn.textContent = 'Save';
    editorActions.appendChild(saveBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('btn', 'act-btn', 'cancel-btn');
    cancelBtn.setAttribute('type', 'button');
    cancelBtn.textContent = 'Cancel';
    editorActions.appendChild(cancelBtn);

    return {
      ctn,
      titleInput,
      editorActions,
      saveBtn,
      cancelBtn,
    };
  },
};

export default helpers;

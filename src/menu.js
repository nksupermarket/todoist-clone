import helpers from './helpers.js';

const menu = {
  ctn: document.getElementById('menu'),
  today: document.querySelector('#today-menu'),
  upcoming: document.querySelector('#upcoming-menu'),
  pjList: document.querySelector('#pj-list'),
  form: document.querySelector('#new-pj-form'),
  titleInput: document.querySelector('input[name=pj-title]'),
  newBtn: document.querySelector('#new-pj-btn'),
  addBtn: document.querySelector('#add-pj-btn'),
  cancelBtn: document.querySelector('#cancel-pj-btn'),
  editor: helpers.createPJEditor('menu-title-input'),
  hidePjForm() {
    helpers.hide(this.form);
    this.formInput.value = '';
  },
};

export { menu };

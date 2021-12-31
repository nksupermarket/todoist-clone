import helpers from './helpers.js';
import { menu } from './menu.js';

const listOfPjs = [];
const listOfTodos = [];

function PjFactory() {
  this.id = 1; // need this so each project has a different ID
}
PjFactory.prototype.createProject = function (title) {
  const todoList = [];

  const create = {
    menuListItem() {
      const pjLink = document.createElement('li');
      pjLink.classList.add('pj-list-item', 'btn');
      pjLink.dataset.project = this.id;
      return pjLink;
    },
    menuContent() {
      const div = document.createElement('div');
      div.classList.add('pj-list-content');

      const fragment = new DocumentFragment();
      const span = document.createElement('span');
      span.textContent = title;

      const actionsBtn = helpers.createIconBtn('flaticon-more-1', 'more-btn');
      actionsBtn.dataset.id = `actions-btn-${this.id}`;

      fragment.appendChild(span);
      fragment.appendChild(actionsBtn);

      div.appendChild(fragment);

      return div;
    },
  };

  return {
    title,
    todoList,
    notes: {
      text: [],
      date: [],
    },
    menuItem: create.menuListItem.call(this),
    menuContent: create.menuContent.call(this),
    id: this.id++, // needs to be below menuItem and menuContent because their function call requires the correct id
    appendContent() {
      this.menuItem.appendChild(this.menuContent);
    },
    addToMenu() {
      this.menuItem.appendChild(this.menuContent);
      menu.pjList.appendChild(this.menuItem);
      return this;
    },
    pushToList() {
      listOfPjs.push(this);
      return this;
    },
    addToForm(input) {
      const pjOption = document.createElement('option');
      pjOption.textContent = this.title;
      pjOption.value = this.id;

      input.appendChild(pjOption);
      return this;
    },
    del() {
      const copy = [...this.todoList]; // deleting off original causes issues with forEach loop
      copy.forEach((todo) => todo.del());
      this.menuItem.remove();
      const index = listOfPjs.findIndex((pj) => pj.id === this.id);
      listOfPjs.splice(index, 1);
    },
    editTitle(str) {
      this.title = str;
      return this;
    },
  };
};
const pjFact = new PjFactory();

function TodoFactory() {
  this.id = 1; // need this so every TODO has a different ID
}
TodoFactory.prototype.createTodo = function (
  project,
  title,
  day,
  priority,
  notes
) {
  function getTodo(id) {
    return helpers.findItem(listOfTodos, id);
  }

  const create = {
    ctn() {
      const todoItem = document.createElement('li');
      todoItem.dataset.todo = this.id;
      todoItem.classList.add('todo-ctn');

      return todoItem;
    },
    completedCheckbox() {
      const checkboxCtn = document.createElement('button');
      checkboxCtn.setAttribute('type', 'button');
      const checkboxInput = document.createElement('input');
      checkboxInput.setAttribute('type', 'checkbox');

      const checkbox = document.createElement('span');

      switch (priority) {
        case '1':
          checkbox.setAttribute('class', 'priority-1 checkbox');
          checkbox.style.borderColor = 'rgb(209, 69, 59)';
          break;
        case '2':
          checkbox.setAttribute('class', 'priority-2 checkbox');
          checkbox.style.borderColor = 'rgb(235, 137, 9)';
          break;
        case '3':
          checkbox.setAttribute('class', 'priority-3 checkbox');
          checkbox.style.borderColor = 'rgb(36, 111, 224)';
          break;
        case '4':
          checkbox.setAttribute('class', 'priority-4 checkbox');
          checkbox.style.border = '1px solid rgba(32,32,32,0.6)';
          break;
        case '5':
          checkbox.setAttribute('class', 'priority-5 checkbox');
          checkbox.style.borderColor = '#058527';
          break;
      }
      checkbox.classList.add('checkbox');
      checkboxCtn.classList.add('todo-checkbox', 'btn');
      checkboxCtn.appendChild(checkboxInput);
      checkboxCtn.appendChild(checkbox);
      return [checkboxCtn, checkbox];
    },
    titleCtn() {
      const titleCtn = document.createElement('p');
      titleCtn.classList.add('todo-title');
      titleCtn.textContent = title;
      return titleCtn;
    },
    btn(name, todoID) {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.classList.add('btn', `${name}-btn`);
      btn.dataset.id = `${name}-${todoID}`;
      return btn;
    },
    dayBtn(todoID) {
      const dayInput = document.createElement('input');
      const dayBtn = create.btn('day', todoID);
      dayInput.setAttribute('type', 'date');
      dayInput.setAttribute('required', 'required');
      dayInput.value = day;
      dayBtn.appendChild(dayInput);

      return [dayBtn, dayInput];
    },
    commentBtn() {
      const commentsBtn = create.btn('notes');
      const commentsCount = document.createElement('span');
      commentsBtn.classList.add('icon-btn');
      if (!notes.text[0]) commentsBtn.classList.add('inactive');
      const commentsIcon = document.createElement('i');
      commentsIcon.classList.add('flaticon', 'flaticon-comment');
      commentsCount.textContent = 1;
      commentsCount.classList.add('notes-btn-count');
      commentsBtn.appendChild(commentsIcon);
      commentsBtn.appendChild(commentsCount);

      return [commentsBtn, commentsCount];
    },
    rhActionBtns(todoID) {
      const todoActions = document.createElement('div');
      todoActions.classList.add('todo-actions');
      const editBtn = createIconBtn('flaticon-pen', 'edit-btn');
      const commentBtn = createIconBtn('flaticon-comment', 'notes-btn');
      const deleteBtn = createIconBtn('flaticon-trash', 'delete-btn');

      return [todoActions, editBtn, commentBtn, deleteBtn];

      function createIconBtn(iconName, className) {
        const btn = helpers.createIconBtn(iconName, className);
        btn.dataset.todo = todoID;
        btn.dataset.id = `${className}-${todoID}`;

        todoActions.appendChild(btn);
        return btn;
      }
    },
  };
  return {
    project,
    title,
    day,
    priority,
    notes,
    ctn: create.ctn.call(this),
    content: function createContent() {
      const todoID = this.id;
      const content = document.createElement('div');
      content.classList.add('todo-content');
      content.dataset.todo = this.id;

      const [checkboxCtn, checkbox] = create.completedCheckbox();

      const rhCtn = document.createElement('div');
      rhCtn.classList.add('todo-rh-ctn');

      const titleCtn = create.titleCtn();
      rhCtn.appendChild(titleCtn);

      const details = document.createElement('div');
      details.classList.add('todo-details');
      rhCtn.appendChild(details);

      const [dayBtn, dayInput] = create.dayBtn(todoID);
      details.appendChild(dayBtn);

      const [commentsBtn, commentsCount] = create.commentBtn(todoID);
      details.appendChild(commentsBtn);

      const [todoActions, editBtn, commentBtn, deleteBtn] =
        create.rhActionBtns(todoID);
      rhCtn.appendChild(todoActions);

      content.appendChild(checkboxCtn);
      content.appendChild(rhCtn);

      return {
        dayBtn,
        commentsBtn,
        editBtn,
        commentBtn,
        deleteBtn,
        checkbox,
        main: content,
        refresh() {
          const todo = getTodo(todoID);
          titleCtn.textContent = todo.title;
          dayInput.value = todo.day;
          switch (todo.priority) {
            case '1':
              checkbox.setAttribute('class', 'priority-1 checkbox');
              checkbox.style.borderColor = 'rgb(209, 69, 59)';
              break;
            case '2':
              checkbox.setAttribute('class', 'priority-2 checkbox');
              checkbox.style.borderColor = 'rgb(235, 137, 9)';
              break;
            case '3':
              checkbox.setAttribute('class', 'priority-3 checkbox');
              checkbox.style.borderColor = 'rgb(36, 111, 224)';
              break;
            case '4':
              checkbox.setAttribute('class', 'priority-4 checkbox');
              checkbox.style.border = '1px solid rgba(32,32,32,0.6)';
              break;
            case '5':
              checkbox.setAttribute('class', 'priority-5 checkbox');
              checkbox.style.borderColor = '#058527';
              break;
          }
        },
        updateCommentCounter() {
          const count = notes.text.length;
          if (count === 0) return helpers.hide(commentsBtn);
          commentsCount.textContent = count;
          helpers.show(commentsBtn);
        },
      };
    }.call(this),
    id: this.id++,
    appendContent() {
      this.ctn.appendChild(this.content.main);
      return this;
    },
    appendEditor(editor) {
      this.content.main.remove();
      this.ctn.appendChild(editor.ctn);
      return this;
    },
    pushToList() {
      listOfTodos.push(this);
      return this;
    },
    pushToProject() {
      const project = helpers.findItem(listOfPjs, this.project);
      project.todoList.push(this);
      return this;
    },
    del() {
      this.ctn.remove();
      const index = listOfTodos.findIndex((todo) => todo.id === this.id);
      listOfTodos.splice(index, 1);

      const pj = helpers.findItem(listOfPjs, this.project);
      if (pj === undefined) return;
      const pjIndex = pj.todoList.findIndex((todo) => todo.id === this.id);
      pj.todoList.splice(pjIndex, 1);
    },
    markComplete() {
      this.priority = '5';
      this.content.refresh();
      this.ctn.classList.add('complete');
      this.content.dayBtn.classList.remove('overdue');
    },
    markIncomplete() {
      this.priority = '4';
      this.content.refresh();
      this.ctn.classList.remove('complete');
      this.checkOverdue();
    },
    editTitle(str) {
      this.title = str;
      return this;
    },
    editNotes(str) {
      this.notes = this.notes.concat(str);
      return this;
    },
    editDay(date) {
      this.day = date;
      this.checkOverdue();
      return this;
    },
    editPriority(level) {
      this.priority = level;
      return this;
    },
    editProject(id) {
      this.project = id;
      return this;
    },
    saveEdits(editor, prioritySelected) {
      this.editTitle(editor.titleInput.value)
        .editDay(editor.dateInput.value)
        .editProject(editor.pjInput.value)
        .editPriority(prioritySelected.dataset.value);
    },
    checkOverdue() {
      if (this.priority === '5') return;
      const dateObj = new Date(this.day + ' 00:00');
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      dateObj < todayDate
        ? this.content.dayBtn.classList.add('overdue')
        : this.content.dayBtn.classList.remove('overdue');
      return this;
    },
    checkComplete() {
      if (this.priority === '5') this.ctn.classList.add('complete');
      return this;
    },
  };
};
const todoFact = new TodoFactory();

export { pjFact, todoFact, listOfPjs, listOfTodos };

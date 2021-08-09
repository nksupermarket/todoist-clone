export { pjFact, todoFact, listOfPjs, listOfTodos };
import { helpers } from './helpers.js';

let listOfPjs = [];
let listOfTodos = [];

function pjFactory() {
  this.id = 1;
}
pjFactory.prototype.createProject = function (title) {
  let todoList = [];

  return {
    title,
    todoList,
    notes: {
      text: [],
      date: [],
    },
    menuItem: function () {
      const pjLink = document.createElement('li');
      pjLink.classList.add('pj-list-item', 'btn');
      pjLink.dataset.project = this.id;
      return pjLink;
    }.call(this),
    menuContent: function () {
      const div = document.createElement('div');
      div.classList.add('pj-list-content');

      const span = document.createElement('span');
      span.textContent = title;

      const actionsBtn = helpers.createIconBtn('flaticon-more-1', 'more-btn');
      actionsBtn.dataset.id = `actions-btn-${this.id}`;

      div.appendChild(span);
      div.appendChild(actionsBtn);

      return div;
    }.call(this),
    appendContent() {
      this.menuItem.appendChild(this.menuContent);
    },
    addToMenu() {
      this.menuItem.appendChild(this.menuContent);
      const pjMenu = document.querySelector('#pj-list');
      pjMenu.appendChild(this.menuItem);
      return this;
    },
    pushToList() {
      listOfPjs.push(this);
      return this;
    },
    addToForm(input) {
      var pjOption = document.createElement('option');
      pjOption.textContent = this.title;
      pjOption.value = this.id;

      input.appendChild(pjOption);
      return this;
    },
    del() {
      const copy = [...this.todoList];
      copy.forEach((todo) => todo.del());
      this.menuItem.remove();
      const index = listOfPjs.findIndex((pj) => pj.id === this.id);
      listOfPjs.splice(index, 1);
    },
    editTitle(str) {
      this.title = str;
      return this;
    },
    id: this.id++,
  };
};
const pjFact = new pjFactory();

function todoFactory() {
  this.id = 1;
}
todoFactory.prototype.createTodo = function (
  project,
  title,
  day,
  priority,
  notes
) {
  function getTodo(id) {
    var todo = helpers.findItem(listOfTodos, id);
    return todo;
  }

  return {
    project,
    title,
    day,
    priority,
    notes,
    ctn: function createCtn() {
      const todoItem = document.createElement('li');
      todoItem.dataset.todo = this.id;
      todoItem.classList.add('todo-ctn');

      return todoItem;
    }.call(this),
    content: function createContent() {
      const todoId = this.id;
      const content = document.createElement('div');
      content.classList.add('todo-content');
      content.dataset.todo = this.id;

      const checkbox = document.createElement('span');
      const checkboxCtn = (function createFinishedCheckbox() {
        var checkboxCtn = document.createElement('button');
        checkboxCtn.setAttribute('type', 'button');
        var checkboxInput = document.createElement('input');
        checkboxInput.setAttribute('type', 'checkbox');
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
        content.appendChild(checkboxCtn);
        return checkboxCtn;
      })();

      const rhCtn = document.createElement('div');
      rhCtn.classList.add('todo-rh-ctn');

      const titleCtn = document.createElement('p');
      (function createTitle() {
        titleCtn.classList.add('todo-title');
        titleCtn.textContent = title;
        rhCtn.appendChild(titleCtn);
      })();

      const details = document.createElement('div');
      details.classList.add('todo-details');
      rhCtn.appendChild(details);

      function createBtn(name) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.classList.add('btn', `${name}-btn`);
        btn.dataset.id = `${name}-${todoId}`;
        return btn;
      }
      let dayBtn;
      const dayInput = document.createElement('input');
      (function createDayBtn() {
        dayBtn = createBtn('day');
        dayInput.setAttribute('type', 'date');
        dayInput.setAttribute('required', 'required');
        dayInput.value = day;
        dayBtn.appendChild(dayInput);
        details.appendChild(dayBtn);
      })();

      const commentsBtn = createBtn('notes');
      const commentsCount = document.createElement('span');
      (function createCommentsBtn() {
        commentsBtn.classList.add('icon-btn');
        if (!notes.text[0]) commentsBtn.classList.add('inactive');
        var commentsIcon = document.createElement('i');
        commentsIcon.classList.add('flaticon', 'flaticon-comment');
        commentsCount.textContent = 1;
        commentsCount.classList.add('notes-btn-count');
        commentsBtn.appendChild(commentsIcon);
        commentsBtn.appendChild(commentsCount);
        details.appendChild(commentsBtn);
      })();

      let editBtn;
      let commentBtn;
      let deleteBtn;
      (function createActions() {
        var todoActions = document.createElement('div');
        todoActions.classList.add('todo-actions');
        editBtn = createIconBtn('flaticon-pen', 'edit-btn');
        commentBtn = createIconBtn('flaticon-comment', 'notes-btn');
        deleteBtn = createIconBtn('flaticon-trash', 'delete-btn');

        function createIconBtn(iconName, className) {
          const btn = helpers.createIconBtn(iconName, className);
          btn.dataset.todo = todoId;
          btn.dataset.id = `${className}-${todoId}`;

          todoActions.appendChild(btn);
          return btn;
        }
        rhCtn.appendChild(todoActions);
      })();

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
          const todo = getTodo(todoId);
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
      var project = helpers.findItem(listOfPjs, this.project);
      project.todoList.push(this);
      return this;
    },
    del() {
      this.ctn.remove();
      const index = listOfTodos.findIndex((todo) => todo.id === this.id);
      listOfTodos.splice(index, 1);
      const pj = helpers.findItem(listOfPjs, this.project);
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
const todoFact = new todoFactory();

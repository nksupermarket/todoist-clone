export { pjFact, todoFact, listOfPjs, listOfTodos };
import { helpers } from "./helpers.js";

let listOfPjs = [];
let listOfTodos = [];

function pjFactory() {
  this.id = 1;
}
pjFactory.prototype.createProject = function (title) {
  let todoList = [];

  return {
    id: this.id++,
    title,
    todoList,
    menuItem: function () {
      var pjLink = document.createElement("li");
      pjLink.classList.add("pj-list-item", "btn");
      pjLink.textContent = title;
      pjLink.dataset.project = this.id - 1;
      var pjMenu = document.querySelector("#pj-list");
      pjMenu.appendChild(pjLink);
      return pjLink;
    }.call(this),
    pushToList() {
      listOfPjs.push(this);
    },
    addToForm(input) {
      var pjOption = document.createElement("option");
      pjOption.textContent = this.title;
      pjOption.value = this.id;

      input.appendChild(pjOption);
    },
    del() {
      this.menuItem.remove();
      const index = listOfPjs.findIndex((pj) => pj.id === this.id);
      listOfPjs.splice(index, 1);
    },
    editTitle(str) {
      this.title = str;
    },
  };
};
var pjFact = new pjFactory();

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
      var todoItem = document.createElement("li");
      todoItem.dataset.todo = this.id;
      todoItem.classList.add("todo-ctn");

      return todoItem;
    }.call(this),
    content: function createContent() {
      var todoId = this.id;
      var content = document.createElement("div");
      content.classList.add("todo-content");
      content.dataset.todo = this.id;

      var checkbox = document.createElement("span");
      var checkboxCtn = (function createFinishedCheckbox() {
        var checkboxCtn = document.createElement("button");
        checkboxCtn.setAttribute("type", "button");
        var checkboxInput = document.createElement("input");
        checkboxInput.setAttribute("type", "checkbox");
        switch (priority) {
          case "1":
            checkbox.setAttribute("class", "priority-1 checkbox");
            checkbox.style.borderColor = "rgb(209, 69, 59)";
            break;
          case "2":
            checkbox.setAttribute("class", "priority-2 checkbox");
            checkbox.style.borderColor = "rgb(235, 137, 9)";
            break;
          case "3":
            checkbox.setAttribute("class", "priority-3 checkbox");
            checkbox.style.borderColor = "rgb(36, 111, 224)";
            break;
          case "4":
            checkbox.setAttribute("class", "priority-4 checkbox");
            checkbox.style.border = "1px solid rgba(32,32,32,0.6)";
            break;
        }
        checkbox.classList.add("checkbox");
        checkboxCtn.classList.add("todo-checkbox", "btn");
        checkboxCtn.appendChild(checkboxInput);
        checkboxCtn.appendChild(checkbox);
        content.appendChild(checkboxCtn);
        return checkboxCtn;
      })();

      var rhCtn = document.createElement("div");
      rhCtn.classList.add("todo-rh-ctn");

      var titleCtn = document.createElement("p");
      (function createTitle() {
        titleCtn.classList.add("todo-title");
        titleCtn.textContent = title;
        rhCtn.appendChild(titleCtn);
      })();

      var details = document.createElement("div");
      details.classList.add("todo-details");
      rhCtn.appendChild(details);

      function createBtn(name) {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("btn", `${name}-btn`);
        btn.dataset.id = `${name}-${todoId}`;
        return btn;
      }
      var dayInput = document.createElement("input");
      (function createDayBtn() {
        var dayBtn = createBtn("day");
        dayInput.setAttribute("type", "date");
        dayInput.setAttribute("required", "required");
        dayInput.value = day;
        dayBtn.appendChild(dayInput);
        details.appendChild(dayBtn);
      })();

      var commentsBtn = createBtn("notes");
      var commentsCount = document.createElement("span");
      (function createCommentsBtn() {
        commentsBtn.classList.add("icon-btn");
        if (!notes.text[0]) commentsBtn.classList.add("inactive");
        var commentsIcon = document.createElement("i");
        commentsIcon.classList.add("flaticon", "flaticon-comment");
        commentsCount.textContent = 1;
        commentsCount.classList.add("notes-btn-count");
        commentsBtn.appendChild(commentsIcon);
        commentsBtn.appendChild(commentsCount);
        details.appendChild(commentsBtn);
      })();

      (function createActions() {
        var todoActions = document.createElement("div");
        todoActions.classList.add("todo-actions");
        createIconBtn("edit", "pen");
        createIconBtn("notes", "comment");
        createIconBtn("more", "more-1");
        function createIconBtn(name, icon) {
          var btn = document.createElement("button");
          btn.setAttribute("type", "button");
          btn.dataset.todo = todoId;
          btn.dataset.id = `${name}-${todoId}`;
          btn.classList.add(`${name}-btn`, "btn", "icon-btn");
          var btnIcon = document.createElement("i");
          btnIcon.classList.add("flaticon", `flaticon-${icon}`);
          btn.appendChild(btnIcon);
          todoActions.appendChild(btn);
          return btn;
        }
        rhCtn.appendChild(todoActions);
      })();

      content.appendChild(checkboxCtn);
      content.appendChild(rhCtn);
      return {
        main: content,
        refresh() {
          var todo = getTodo(todoId);
          titleCtn.textContent = todo.title;
          dayInput.value = todo.day;
          switch (todo.priority) {
            case "1":
              checkbox.classList.add("priority-1");
              checkbox.style.borderColor = "rgb(209, 69, 59)";
              break;
            case "2":
              checkbox.classList.add("priority-2");
              checkbox.style.borderColor = "rgb(235, 137, 9)";
              break;
            case "3":
              checkbox.classList.add("priority-3");
              checkbox.style.borderColor = "rgb(36, 111, 224)";
              break;
            case "4":
              checkbox.classList.add("priority-4");
              checkbox.style.border = "1px solid rgba(32,32,32,0.6)";
              break;
          }
        },
        updateCommentCounter() {
          var count = notes.text.length;
          todoCommentsCount.textContent = count;
          helpers.show(todoComments);
        },
      };
    }.call(this),
    id: this.id++,
    appendContent() {
      this.ctn.appendChild(this.content.main);
    },
    appendEditor(editor) {
      this.content.main.remove();
      this.ctn.appendChild(editor.ctn);
      editor.titleInput.value = this.title;
      editor.dateInput.value = this.day;
      this.priority === "4"
        ? editor.priorityIcon.setAttribute("class", "flaticon flaticon-flag")
        : editor.priorityIcon.setAttribute("class", "flaticon flaticon-flag-1");
      switch (this.priority) {
        case "1":
          editor.priorityIcon.style.color = "rgb(209, 69, 59)";
          break;
        case "2":
          editor.priorityIcon.style.color = "rgb(235, 137, 9)";
          break;
        case "3":
          editor.priorityIcon.style.color = "rgb(36, 111, 224)";
          break;
      }
    },
    pushToList() {
      listOfTodos.push(this);
    },
    pushToProject() {
      var project = helpers.findItem(listOfPjs, this.project);
      project.todoList.push(this);
    },
    del() {
      this.ctn.remove();
      const index = listOfTodos.findIndex((todo) => todo.id === this.id);
      listOfTodos.splice(index, 1);
      const pjIndex = this.project.todoList.findIndex(
        (todo) => todo.id === this.id
      );
      this.project.todoList.splice(pjIndex, 1);
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
  };
};
var todoFact = new todoFactory();

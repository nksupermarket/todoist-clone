export { pjFact, todoFact, listOfPjs, listOfTodos };
import { helpers } from "./helpers.js";
import { popups } from "./popups.js";

let listOfPjs = [];
let listOfTodos = [];

function pjFactory() {
  this.id = 1;
}
pjFactory.prototype.createProject = function (title) {
  var todoList = [];
  return {
    id: this.id++,
    title,
    todoList,
    pushToList() {
      listOfPjs.push(this);
    },
    addToForm(input) {
      var pjOption = document.createElement("option");
      pjOption.textContent = this.title;
      pjOption.value = this.id;

      input.appendChild(pjOption);
    },
    addToMenu() {
      var pjLink = document.createElement("li");
      pjLink.classList.add("pj-list-item", "btn");
      pjLink.textContent = title;
      pjLink.dataset.project = this.id;
      var pjMenu = document.querySelector("#pj-list");
      pjMenu.appendChild(pjLink);
      return pjLink;
    },
    del() {},
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
  var todoId = this.id;
  function getTodo(id) {
    var todo = helpers.findItem(listOfTodos, id);
    return todo;
  }

  function appendContent() {
    this.editor.main.remove();
    this.ctn.appendChild(this.content.main);
  }

  function appendEditor() {
    this.content.main.remove();
    this.ctn.appendChild(this.editor.main);
  }

  return {
    ctn: function createCtn() {
      var todoItem = document.createElement("li");
      todoItem.dataset.todo = this.id;
      todoItem.classList.add("todo-ctn");

      return todoItem;
    }.call(this),
    project,
    title,
    day,
    priority,
    notes,
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
    editor: function createEditor() {
      var todoId = this.id;

      var editor = document.createElement("form");
      editor.classList.add("todo-editor");
      editor.dataset.todo = this.id;

      var editorArea = document.createElement("div");
      editorArea.classList.add("editor-area");

      var titleInput = document.createElement("input");
      titleInput.setAttribute("type", "text");
      titleInput.value = title;

      var extraDetails = document.createElement("div");
      extraDetails.classList.add("editor-extra-details");

      var lhCtn = document.createElement("div");
      lhCtn.classList.add("lh-ctn");

      var dayInput = document.createElement("input");
      (function createDayBtn() {
        var dayBtn = document.createElement("button");
        dayBtn.setAttribute("type", "button");
        dayBtn.classList.add("day-btn", "btn");
        dayInput.setAttribute("type", "date");
        dayInput.value = day;
        dayBtn.appendChild(dayInput);
        lhCtn.appendChild(dayBtn);
      })();

      var pjInput = document.createElement("select");
      (function createPjBtn() {
        var pjBtn = document.createElement("button");
        pjBtn.setAttribute("type", "button");
        pjBtn.classList.add("btn", "editor-pj-btn");

        var icon = document.createElement("i");
        icon.classList.add("flaticon", "flaticon-folder");

        var noneOption = document.createElement("option");
        noneOption.value = "None";
        noneOption.textContent = "None";
        pjInput.appendChild(noneOption);

        pjBtn.appendChild(icon);
        pjBtn.appendChild(pjInput);
        lhCtn.appendChild(pjBtn);
      })();

      var rhCtn = document.createElement("div");
      rhCtn.classList.add("rh-ctn");

      var priorityBtn = document.createElement("button");

      (function createPriorityBtn() {
        priorityBtn.dataset.id = `priority-${todoId}`;
        priorityBtn.setAttribute("type", "button");
        priorityBtn.classList.add("btn", "icon-btn", "priority-btn");
        var icon = document.createElement("i");
        priority === "4"
          ? icon.classList.add("flaticon", "flaticon-flag")
          : icon.classList.add("flaticon", "flaticon-flag-1");
        var priorityLevel;
        switch (priority) {
          case "1":
            priorityLevel = "rgb(209, 69, 59)";
            break;
          case "2":
            priorityLevel = "rgb(235, 137, 9)";
            break;
          case "3":
            priorityLevel = "rgb(36, 111, 224)";
            break;
        }
        icon.style.color = priorityLevel;
        priorityBtn.appendChild(icon);

        rhCtn.appendChild(priorityBtn);
      })();

      var editorActions = document.createElement("div");
      editorActions.classList.add("editor-actions");

      (function createSaveBtn() {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("btn", "act-btn", "save-btn");
        btn.dataset.todo = todoId;
        btn.textContent = "Save";

        editorActions.appendChild(btn);
      })();
      (function createCancelBtn() {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("btn", "act-btn", "cancel-btn");
        btn.dataset.todo = todoId;
        btn.textContent = "Cancel";

        editorActions.appendChild(btn);
      })();

      extraDetails.appendChild(lhCtn);
      extraDetails.appendChild(rhCtn);

      editorArea.appendChild(titleInput);
      editorArea.appendChild(extraDetails);

      editor.appendChild(editorArea);
      editor.appendChild(editorActions);

      return {
        main: editor,
        titleInput: titleInput,
        dayInput: dayInput,
        pjInput: pjInput,
        priorityInput: () => {
          return popups.priority.ctn.querySelector(".active");
        },
      };
    }.call(this),
    id: this.id++,
    appendContent,
    appendEditor,
    pushToList() {
      listOfTodos.push(this);
    },
    pushToProject() {
      var project = helpers.findItem(listOfPjs, this.project);
      project.todoList.push(this);
    },
    del() {
      var index = helpers.findItem(listOfTodos, this.id);
      listOfTodos.splice(index, 1);
      var pjIndex = helpers.findItem(this.project.todoList, this.id);
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
    editPriorirty(level) {
      this.priority = level;
      return this;
    },
    editProject(id) {
      this.project = id;
      return this;
    },
    saveEdits() {
      this.editTitle(this.editor.titleInput.value)
        .editDay(this.editor.dayInput.value)
        .editProject(this.editor.pjInput.value)
        .editPriorirty(this.editor.priorityInput().dataset.value)
        .appendContent();
    },
  };
};
var todoFact = new todoFactory();

export { pjFact, todoFact, listOfPjs, listOfTodos };
import { helpers } from "./helpers.js";
import { commentModal } from "./comments.js";
import { todoForm } from "./todoForm.js";
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
  function onComment() {
    helpers.show(commentModal.modal);
    var pj = helpers.findItem(listOfPjs, project);
    commentModal.attachTodoId(todoId);
    commentModal.changePjTitle(pj.title);
    commentModal.changeTodoTitle(title);
    if (!notes) return;
    for (var i = 0; i < notes.text.length; i++) {
      commentModal.fillCommentList(notes.text[i], notes.date[i]);
    }
  }
  function onEdit() {
    closeOtherEditors();
    var todo = getTodo(this.dataset.todo);
    (function addPjOptions() {
      var select = todo.editor.main.querySelector("select");
      listOfPjs.forEach((pj) => pj.addToForm(select));
    })();
    (function setDefaultOption() {
      var options = todo.editor.main.querySelectorAll("option");
      var defaultOption = Array.from(options).find((option) => {
        return option.value.toString() === todo.project.toString();
      });
      defaultOption.setAttribute("selected", "selected");
    })();
    todo.appendEditor();

    function closeOtherEditors() {
      var openEditor = document.querySelector(".todo-editor");
      if (!openEditor) return;
      var openTodo = helpers.findItem(listOfTodos, openEditor.dataset.todo);
      console.log(openEditor);
      console.log(openTodo);

      openTodo.saveEdits();
      openTodo.content.refresh();
      openTodo.appendContent();
    }
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
      var todoContent = document.createElement("div");
      todoContent.classList.add("todo-content");
      todoContent.dataset.todo = this.id;

      var todoCheckbox = document.createElement("span");
      var todoCheckboxCtn = (function createFinishedCheckbox() {
        var todoCheckboxCtn = document.createElement("button");
        todoCheckboxCtn.setAttribute("type", "button");
        var todoCheckboxInput = document.createElement("input");
        todoCheckboxInput.setAttribute("type", "checkbox");
        switch (priority) {
          case "1":
            todoCheckbox.classList.add("priority-1");
            todoCheckbox.style.borderColor = "rgb(209, 69, 59)";
            break;
          case "2":
            todoCheckbox.classList.add("priority-2");
            todoCheckbox.style.borderColor = "rgb(235, 137, 9)";
            break;
          case "3":
            todoCheckbox.classList.add("priority-3");
            todoCheckbox.style.borderColor = "rgb(36, 111, 224)";
            break;
          case "4":
            todoCheckbox.classList.add("priority-4");
            todoCheckbox.style.border = "1px solid rgba(32,32,32,0.6)";
            break;
        }
        todoCheckbox.classList.add("checkbox");
        todoCheckboxCtn.classList.add("todo-checkbox", "btn");
        todoCheckboxCtn.appendChild(todoCheckboxInput);
        todoCheckboxCtn.appendChild(todoCheckbox);
        todoContent.appendChild(todoCheckboxCtn);
        return todoCheckboxCtn;
      })();

      var todoRhCtn = document.createElement("div");
      todoRhCtn.classList.add("todo-rh-ctn");

      var todoTitle = document.createElement("p");
      (function createTitle() {
        todoTitle.classList.add("todo-title");
        todoTitle.textContent = title;
        todoRhCtn.appendChild(todoTitle);
      })();

      var details = document.createElement("div");
      details.classList.add("todo-details");
      rhCtn.appendChild(todoDetails);

      var dayInput = document.createElement("input");
      (function createDayBtn() {
        var dayBtn = document.createElement("button");
        dayBtn.setAttribute("type", "button");
        dayBtn.classList.add("todo-day", "btn");
        dayInput.setAttribute("type", "date");
        dayInput.setAttribute("required", "required");
        dayBtn.dataset.todo = todoId;
        dayInput.value = day;
        dayBtn.appendChild(dayInput);
        details.appendChild(dayBtn);
      })();
      // dayInput.addEventListener("change", changeTodoDay);
      // function changeTodoDay() {
      //   var todo = getTodo(todoDayInput.dataset.todo);
      //   todo.day = todoDayInput.value;
      // }

      var comments = document.createElement("button");
      var commentsCount = document.createElement("span");
      (function createCommentsBtn() {
        comments.setAttribute("type", "button");
        comments.classList.add("btn", "notes-btn", "icon-btn");
        if (!notes.text[0]) comments.classList.add("inactive");
        var commentsIcon = document.createElement("i");
        commentsIcon.classList.add("flaticon", "flaticon-comment");
        commentsCount.textContent = 1;
        commentsCount.classList.add("notes-btn-count");
        comments.appendChild(commentsIcon);
        comments.appendChild(commentsCount);
        details.appendChild(comments);
        comments.addEventListener("click", onComment);
      })();

      (function createActions() {
        var todoActions = document.createElement("div");
        todoActions.classList.add("todo-actions");
        var editBtn = createBtn.apply(this, ["edit", "pen"]);
        var notesBtn = createBtn.apply(this, ["notes", "comment"]);
        var moreBtn = createBtn.apply(this, ["more", "more-1"]);
        function createBtn(name, icon) {
          var btn = document.createElement("button");
          btn.setAttribute("type", "button");
          btn.dataset.todo = this.id;
          btn.dataset.id = `${name}-${todoId}`;
          btn.classList.add(`${name}-btn`, "btn", "icon-btn");
          var btnIcon = document.createElement("i");
          btnIcon.classList.add("flaticon", `flaticon-${icon}`);
          btn.appendChild(btnIcon);
          todoActions.appendChild(btn);
          return btn;
        }
        todoRhCtn.appendChild(todoActions);

        (function addEventListeners() {
          editBtn.addEventListener("click", onEdit);
          notesBtn.addEventListener("click", onComment);
        })();
      }.call(this));

      todoContent.appendChild(todoCheckboxCtn);
      todoContent.appendChild(todoRhCtn);
      return {
        main: todoContent,
        refresh() {
          var todo = getTodo(todoId);
          todoTitle.textContent = todo.title;
          todoDayInput.value = todo.day;
          switch (todo.priority) {
            case "1":
              todoCheckbox.classList.add("priority-1");
              todoCheckbox.style.borderColor = "rgb(209, 69, 59)";
              break;
            case "2":
              todoCheckbox.classList.add("priority-2");
              todoCheckbox.style.borderColor = "rgb(235, 137, 9)";
              break;
            case "3":
              todoCheckbox.classList.add("priority-3");
              todoCheckbox.style.borderColor = "rgb(36, 111, 224)";
              break;
            case "4":
              todoCheckbox.classList.add("priority-4");
              todoCheckbox.style.border = "1px solid rgba(32,32,32,0.6)";
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
        dayBtn.classList.add("todo-day", "btn");
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
      // const priorityDropdown = (() => {
      //   var modal = todoForm.popupModal.cloneNode(true);
      //   modal.removeAttribute("id");
      //   modal.querySelector("#comment-popup").remove();
      //   var dropdown = modal.querySelector(".popup-popup");
      //   dropdown.dataset.btn = `editor-${this.id}`;
      //   dropdown.classList.add("priority-popup");
      //   dropdown.removeAttribute("id");
      //   var listItems = dropdown.querySelectorAll("li");

      //   function onSelectPriority(e) {
      //     removeActive();
      //     var btn = e.target.closest(".btn");
      //     btn.dataset.selected = "true";
      //     btn.classList.add("active");
      //     changeBtnColor();

      //     function removeActive() {
      //       listItems.forEach((btn) => {
      //         if (btn.classList.contains("active")) {
      //           btn.classList.remove("active");
      //           btn.dataset.selected = "false";
      //         }
      //       });
      //     }

      //     function changeBtnColor() {
      //       var priorityFlag = btn.querySelector(".flaticon");
      //       var flagColor = priorityFlag.style.color;
      //       var flagIcon = priorityBtn.querySelector("i");
      //       btn.dataset.value != 4
      //         ? flagIcon.classList.add("flaticon-flag-1")
      //         : flagIcon.classList.remove("flaticon-flag-1");
      //       flagIcon.style.color = flagColor;
      //     }
      //   }

      //   modal.addEventListener("click", () => {
      //     dropdown.classList.remove("active");
      //     helpers.hide(modal);
      //   });
      //   dropdown.addEventListener("click", (e) => {
      //     e.stopPropagation();
      //   });
      //   listItems.forEach((item) =>
      //     item.addEventListener("click", (e) => onSelectPriority(e))
      //   );

      //   return {
      //     modal,
      //     dropdown,
      //     listItems,
      //     show() {
      //       helpers.show(modal);
      //       helpers.show(dropdown);
      //       dropdown.classList.add("active");
      //     },
      //   };
      // }).call(this);

      (function createPriorityBtn() {
        priorityBtn.dataset.id = `priority-${this.id}`;
        priorityBtn.setAttribute("type", "button");
        priorityBtn.classList.add("btn", "icon-btn");
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

        function onPriorityBtn() {
          popups.priority.show();
          popups.priority.setDataBtn(`priority-${todoId}`);
          popups.position(popups.priority.ctn, priorityBtn);
          (function setDefaultPriority() {
            popups.priority.setActive(priority);
          })();
        }

        priorityBtn.addEventListener("click", onPriorityBtn);
        rhCtn.appendChild(priorityBtn);
      }.call(this));

      var editorActions = document.createElement("div");
      editorActions.classList.add("editor-actions");

      (function createSaveBtn() {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("btn", "act-btn", "save-btn");
        var thisTodo = this.id;
        btn.dataset.todo = thisTodo;
        btn.textContent = "Save";

        btn.addEventListener("click", () => {
          var todo = getTodo(thisTodo);
          todo.saveEdits();
          todo.content.refresh();
        });

        editorActions.appendChild(btn);
      }.call(this));
      (function createCancelBtn() {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("btn", "act-btn", "cancel-btn");
        var thisTodo = this.id;
        btn.dataset.todo = thisTodo;
        btn.textContent = "Cancel";

        function cancelEdit() {
          var todo = getTodo(thisTodo);
          todo.appendContent();
        }

        btn.addEventListener("click", cancelEdit);
        editorActions.appendChild(btn);
      }.call(this));

      extraDetails.appendChild(lhCtn);
      extraDetails.appendChild(rhCtn);

      editorArea.appendChild(titleInput);
      editorArea.appendChild(extraDetails);

      editor.appendChild(editorArea);
      editor.appendChild(editorActions);
      // editor.appendChild(priorityDropdown.modal);

      return {
        main: editor,
        titleInput: titleInput,
        dayInput: dayInput,
        pjInput: pjInput,
        priorityInput: () => {
          return priorityDropdown.dropdown.querySelector(".active");
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
    // placePopup(btn, active) {
    //   var btnPos = btn.getBoundingClientRect();

    //   var btnCenter = findBtnCenter();
    //   var btnBottom = btn.getBoundingClientRect().bottom;
    //   var popupCenter = findPopupCenter();
    //   active.style.left = `${btnCenter - popupCenter}px`;
    //   active.style.top = `${btnBottom + 8}px`;
    //   removePopupOverflow(active);

    //   function removePopupOverflow(active) {
    //     var browserWidth = document.documentElement.clientWidth;
    //     var popupCtn = active.querySelector(".popup-ctn");
    //     var newPos = active.getBoundingClientRect();
    //     if (newPos.right > browserWidth) {
    //       popupCtn.style.right = `${newPos.right - browserWidth}px`;
    //     }
    //     var posAfter = popupCtn.getBoundingClientRect();
    //   }

    //   function findBtnCenter() {
    //     var btnWidth = btn.offsetWidth;
    //     var center = btnPos.left + btnWidth / 2;
    //     return center;
    //   }

    //   function findPopupCenter() {
    //     var popupWidth = active.offsetWidth;
    //     var center = popupWidth / 2;
    //     return center;
    //   }
    // }
  };
};
var todoFact = new todoFactory();

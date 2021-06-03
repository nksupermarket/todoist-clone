import { helpers } from "./helpers.js";
import { listOfPjs, pjFact, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
import { commentModal } from "./comments.js";
import { menu } from "./menu.js";
import { content } from "./content.js";
import { todoForm } from "./todoForm.js";
import { samples } from "./samples.js";
import { popups } from "./popups.js";

var pjWork = pjFact.createProject("Work");
var pjHome = pjFact.createProject("Home");
var pjCode = pjFact.createProject("Code");

var fdlkaTodo = todoFact.createTodo(pjWork.id, "fdlka", "2021-06-01", "4", {
  text: [],
  date: [],
});
pjWork.pushToList();
pjHome.pushToList();
pjCode.pushToList();

const init = (() => {
  samples.generate(30);
  listOfTodos.forEach((todo) => addTodoCtnEvents(todo));
  (function displayPjs() {
    listOfPjs.forEach((pj) => {
      pj.addToMenu().addEventListener("click", (e) => showPj(e));
    });
  })();
})();

menu.today.addEventListener("click", showToday);
menu.upcoming.addEventListener("click", showUpcoming);
menu.newBtn.addEventListener("click", showPjForm);
menu.addBtn.addEventListener("click", onAddPj);
menu.cancelBtn.addEventListener("click", hidePjForm);

function showPjForm() {
  helpers.show(menu.form);
}
function hidePjForm() {
  helpers.hide(menu.form);
  menu.form.reset();
}
function onAddPj() {
  if (!menu.titleInput.value) return helpers.inputError("empty");
  var newPj = pjFact.createProject(menu.titleInput.value);
  newPj.pushToList();
  newPj.addToMenu().addEventListener("click", (e) => showPj(e));
  hidePjForm();
}
function showToday() {
  content.displayToday();
}
function showUpcoming() {
  content.displayUpcoming();
}
function showPj(e) {
  var pjId = e.target.dataset.project;
  content.display(pjId);
}

commentModal.form.addEventListener("click", (e) => {
  e.stopPropagation();
});
commentModal.modal.addEventListener("click", commentModal.close);
commentModal.closeBtn.addEventListener("click", commentModal.close);

todoForm.newTodoBtns.forEach((btn) =>
  btn.addEventListener("click", showTodoForm)
);
todoForm.addBtn.addEventListener("click", () => {
  onAddTodo();
  content.refresh();
});
todoForm.form.addEventListener("click", function (e) {
  e.stopPropagation();
});
popups.modal.addEventListener("click", popups.hide);
popups.priority.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
popups.comment.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
todoForm.modal.addEventListener("click", () => {
  todoForm.hide();
  popups.hide();
  popups.comment.reset();
});
todoForm.cancelBtn.addEventListener("click", todoForm.hide);
todoForm.commentBtn.addEventListener("click", () =>
  onFormIconBtn(popups.comment, todoForm.commentBtn)
);
todoForm.priorityBtn.addEventListener("click", () =>
  onFormIconBtn(popups.priority, todoForm.priorityBtn)
);
popups.comment.textarea.oninput = () => {
  popups.comment.textarea.value
    ? todoForm.changeCommentBtn("not empty")
    : todoForm.changeCommentBtn("empty");
};
popups.comment.closeBtn.addEventListener("click", popups.hide);
window.onresize = function movePopups() {
  var activePopup = findActivePopup();
  if (!activePopup) return;
  var btn = document.querySelector(
    `[data-id = "${activePopup.ctn.dataset.btn}"]`
  );
  activePopup.position(btn);

  function findActivePopup() {
    var ctn = document.querySelector(".active.popup-popup");
    var activePopup = Object.keys(popups).find(
      (key) => popups[key].ctn === ctn
    );
    return popups[activePopup];
  }
};
popups.priority.btns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    popups.priority.onSelect(e);
  })
);
todoForm.titleInput.oninput = todoForm.activateAddBtn;
content.pjCtn.sortBtn.addEventListener("click", function showSortPopup() {
  popups.sort.setDataBtn(content.pjCtn.sortBtn.dataset.id);
  popups.sort.show();
  popups.sort.position(content.pjCtn.sortBtn);
});
popups.sort.dateBtn.addEventListener("click", () => onSort("date"));
popups.sort.priorityBtn.addEventListener("click", () => onSort("priority"));
popups.sort.alphabetBtn.addEventListener("click", () => onSort("alphabet"));
content.pjCtn.sortedBtn.addEventListener("click", () => onSort("reverse"));
function onSort(method) {
  var activeCtn = content.findActiveCtn();
  helpers.show(activeCtn.sortedBtn);

  switch (method) {
    case "date":
      activeCtn.sortedBtnText.textContent = "Sorted by due date";
      activeCtn.sortedBtnIcon.setAttribute(
        "class",
        "flaticon flaticon-down-arrow-1"
      );
      activeCtn.sortDate();
      break;
    case "priority":
      activeCtn.sortedBtnText.textContent = "Sorted by priority";
      activeCtn.sortedBtnIcon.setAttribute(
        "class",
        "flaticon flaticon-down-arrow-1"
      );
      activeCtn.sortPriority();
      break;
    case "alphabet":
      activeCtn.sortedBtnText.textContent = "Sorted alphabetically";
      activeCtn.sortedBtnIcon.setAttribute(
        "class",
        "flaticon flaticon-down-arrow-1"
      );
      activeCtn.sortAlphabetically();
      break;
    case "reverse":
      activeCtn.sortedBtnIcon.classList.contains("flaticon-up-arrow")
        ? activeCtn.sortedBtnIcon.setAttribute(
            "class",
            "flaticon flaticon-down-arrow-1"
          )
        : activeCtn.sortedBtnIcon.setAttribute(
            "class",
            "flaticon flaticon-up-arrow"
          );
      activeCtn.sortReverse();
  }
  activeCtn.refresh();
}

function showTodoForm() {
  helpers.show(todoForm.modal);
  popups.priority.reset();
  (function removeOptions() {
    var options = todoForm.pjInput.querySelectorAll("option");
    options.forEach((option) => {
      if ((option.textContent = "None")) return;
      option.remove();
    });
  })();
  listOfPjs.forEach((pj) => pj.addToForm(todoForm.pjInput));
  todoForm.setDefaultDate();
}

function onFormIconBtn(popup, btn) {
  popup.setDataBtn(btn.dataset.id);
  popup.show();
  popup.position(btn);
}

function onAddTodo() {
  var priority = popups.priority.ctn.querySelector(".active").dataset.value;
  var notes = { text: [], date: [] };
  (function addNotes() {
    if (!popups.comment.textarea.value) return;
    notes.text[0] = popups.comment.textarea.value;
    notes.date[0] = today.getToday();
  })();
  var newTodo = todoFact.createTodo(
    todoForm.pjInput.value,
    todoForm.titleInput.value,
    todoForm.dateInput.value,
    priority,
    notes
  );
  addTodoCtnEvents(newTodo);
  newTodo.pushToList();
  newTodo.appendContent();
  if (pjInput.value != "None") newTodo.pushToProject();

  todoForm.hide();
}
function onSelectPriorityLevel(e) {
  this.removeActive();
  var btn = e.target.closest(".btn");
  var icon = btn.querySelector(".flaticon");
  btn.dataset.selected = "true";
  btn.classList.add("active");
  if (todoForm.formModal.classList.contains("inactive")) return;
  todoForm.changeFlagIcon(icon.style.color, btn.dataset.value);
}
function addTodoCtnEvents(todo) {
  var dayInput = todo.content.main.querySelector(".day-btn");
  dayInput.addEventListener("change", changeTodoDay);
  function changeTodoDay() {
    todo.day = dayInput.value;
  }

  var commentsBtn = todo.content.main.querySelectorAll(".notes-btn");
  commentsBtn.forEach((btn) => btn.addEventListener("click", showCommentForm));
  function showCommentForm() {
    helpers.show(commentModal.modal);
    var pj = helpers.findItem(listOfPjs, todo.project);
    commentModal.attachTodoId(todo.id);
    commentModal.changePjTitle(pj.title);
    commentModal.changeTodoTitle(todo.title);
    if (!todo.notes) return;
    for (var i = 0; i < todo.notes.text.length; i++) {
      commentModal.fillCommentList(todo.notes.text[i], todo.notes.date[i]);
    }
  }

  var editBtn = todo.content.main.querySelector(".edit-btn");
  editBtn.addEventListener("click", showEditor);
  function showEditor() {
    closeOtherEditors();
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

      openTodo.saveEdits();
      openTodo.content.refresh();
      openTodo.appendContent();
    }
  }

  var priorityBtn = todo.editor.main.querySelector(".priority-btn");
  priorityBtn.addEventListener("click", showPriorityPopup);
  function showPriorityPopup() {
    popups.priority.show();
    popups.priority.setDataBtn(`priority-${todo.id}`);
    popups.priority.position(priorityBtn);
    (function setDefaultPriority() {
      popups.priority.setActive(todo.priority);
    })();
  }

  var saveBtn = todo.editor.main.querySelector(".save-btn");
  saveBtn.addEventListener("click", () => {
    todo.saveEdits();
    todo.content.refresh();
  });

  var cancelBtn = todo.editor.main.querySelector(".cancel-btn");
  cancelBtn.addEventListener("click", () => todo.appendContent());
}

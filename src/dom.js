import { helpers } from "./helpers.js";
import { listOfPjs, pjFact, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
import { commentModal } from "./comments.js";
import { menu, content } from "./menu.js";
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
  (function displayPjs() {
    listOfPjs.forEach((pj) => {
      pj.addToMenu().addEventListener("click", (e) => menu.onPjItem(e));
    });
  })();
})();

menu.today.addEventListener("click", menu.onToday);
menu.upcoming.addEventListener("click", menu.onUpcoming);
menu.newBtn.addEventListener("click", menu.onNewPj);
menu.addBtn.addEventListener("click", menu.onAddPj);
menu.cancelBtn.addEventListener("click", menu.hideForm);

commentModal.form.addEventListener("click", (e) => {
  e.stopPropagation();
});
commentModal.modal.addEventListener("click", commentModal.close);
commentModal.closeBtn.addEventListener("click", commentModal.close);

// window.onload = todoForm.displayPjOptions;
todoForm.newTodoBtns.forEach((btn) =>
  btn.addEventListener("click", todoForm.onShowForm)
);
todoForm.addBtn.addEventListener("click", () => {
  todoForm.onAddTodo();
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
todoForm.formModal.addEventListener("click", todoForm.hide);
todoForm.cancelBtn.addEventListener("click", todoForm.hide);
todoForm.commentBtn.addEventListener("click", () =>
  todoForm.onIconBtn(popups.comment, todoForm.commentBtn)
);
todoForm.priorityBtn.addEventListener("click", () =>
  todoForm.onIconBtn(popups.priority, todoForm.priorityBtn)
);
popups.comment.textarea.oninput = todoForm.changeCommentBtn;
popups.comment.closeBtn.addEventListener("click", popups.hide);
window.onresize = function movePopups() {
  var activePopup = findActivePopup();
  if (!activePopup) return;
  var btn = document.querySelector(
    `[data-id = "${activePopup.ctn.dataset.btn}"]`
  );
  activePopup.position(btn);
  // btn.dataset.id.includes("editor")
  //   ? helpers.findTodoFrom(btn, listOfTodos).placePopup(btn, active)
  //   : todoForm.placePopup(active, btn);
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
content.pjCtn.sortBtn.addEventListener("click", function onSort() {
  popups.sort.setDataBtn(content.pjCtn.sortBtn.dataset.id);
  popups.sort.show();
  popups.position(popups.sort.ctn, content.pjCtn.sortBtn);
});

function onSelectPriorityLevel(e) {
  this.removeActive();
  var btn = e.target.closest(".btn");
  var icon = btn.querySelector(".flaticon");
  btn.dataset.selected = "true";
  btn.classList.add("active");
  if (todoForm.formModal.classList.contains("inactive")) return;
  todoForm.changeFlagIcon(icon.style.color, btn.dataset.value);
}

function addTodoCtnEvents(ctn) {
  var dayInput = ctn.querySelector(".todo-day");
  dayInput.addEventListener("change", changeTodoDay);
  function changeTodoDay() {
    var todo = helpers.findItem(listOfTodos, dayInput.dataset.todo);
    todo.day = dayInput.value;
  }

  var commentsBtn = ctn.querySelectorAll(".notes-btn");
  commentsBtn.addEventListener("click", showCommentForm);
  function showCommentForm() {
    helpers.show(commentModal.modal);
    var todo = helpers.findItem(listOfTodos, ctn.dataset.todo);
    var pj = helpers.findItem(listOfPjs, todo.project);
    commentModal.attachTodoId(todo.id);
    commentModal.changePjTitle(pj.title);
    commentModal.changeTodoTitle(todo.title);
    if (!todo.notes) return;
    for (var i = 0; i < todo.notes.text.length; i++) {
      commentModal.fillCommentList(todo.notes.text[i], todo.notes.date[i]);
    }
  }

  var editBtn = ctn.querySelector(".edit-btn");
  editBtn.querySelector("click", showEditor);
  function showEditor() {
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
}

import { helpers } from "./helpers.js";
import { listOfPjs, pjFact, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
import { commentModal } from "./comments.js";
import { menu, content } from "./menu.js";
import { todoForm } from "./todoForm.js";
import { samples } from "./samples.js";

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
todoForm.popupModal.addEventListener("click", todoForm.hidePopups);
todoForm.priorityPopup.addEventListener("click", function (e) {
  e.stopPropagation();
});
todoForm.commentPopup.addEventListener("click", function (e) {
  e.stopPropagation();
});
todoForm.formModal.addEventListener("click", todoForm.hideForm);
todoForm.cancelBtn.addEventListener("click", todoForm.hideForm);
todoForm.commentBtn.addEventListener("click", () =>
  todoForm.onIconBtn(todoForm.commentPopup, todoForm.commentBtn)
);
todoForm.priorityBtn.addEventListener("click", () =>
  todoForm.onIconBtn(todoForm.priorityPopup, todoForm.priorityBtn)
);
todoForm.commentTextarea.oninput = todoForm.changeCommentBtn;
todoForm.commentCloseBtn.addEventListener("click", todoForm.hidePopups);
window.onresize = function movePopups() {
  var active = findActivePopup();
  if (!active) return;
  var btn = document.querySelector(`[data-id = "${active.dataset.btn}"]`);
  btn.dataset.id.includes("editor")
    ? helpers.findTodoFrom(btn, listOfTodos).placePopup(btn, active)
    : todoForm.placePopup(active, btn);
  function findActivePopup() {
    return document.querySelector(".active .popup-popup");
  }
};
todoForm.prioritySelectorBtns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    todoForm.onSelectPriority(e);
  })
);
todoForm.titleInput.oninput = todoForm.activateAddBtn;

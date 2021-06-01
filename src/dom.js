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
  var btn = document.querySelector(`[data-id = "${activePopup.dataset.btn}"]`);
  popups.position(activePopup, btn);
  // btn.dataset.id.includes("editor")
  //   ? helpers.findTodoFrom(btn, listOfTodos).placePopup(btn, active)
  //   : todoForm.placePopup(active, btn);
  function findActivePopup() {
    return document.querySelector(".active.popup-popup");
  }
};
popups.priority.btns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    popups.priority.onSelect(e);
  })
);
todoForm.titleInput.oninput = todoForm.activateAddBtn;

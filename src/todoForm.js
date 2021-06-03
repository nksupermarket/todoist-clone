import { helpers } from "./helpers.js";
import { today } from "./today.js";
export { todoForm };

const todoForm = (() => {
  var newTodoBtns = document.querySelectorAll(".new-todo-btn");
  var form = document.getElementById("new-todo-form");
  var modal = form.closest(".modal");
  var addBtn = form.querySelector("#add-todo-btn");
  var cancelBtn = form.querySelector(".close-btn");

  var commentBtn = form.querySelector(".comment-btn");
  var commentIcon = commentBtn.querySelector(".flaticon");
  var priorityBtn = form.querySelector(".priority-btn");
  var flagIcon = priorityBtn.querySelector(".flaticon");

  var titleInput = form.querySelector("input[name=todo-title");
  var dateInput = form.querySelector("input[type=date");
  var pjInput = form.querySelector("select[name=todo-pj");

  function resetPriorityIcon() {
    flagIcon.classList.remove("flaticon-flag-1");
    flagIcon.style.color = "var(--main-text)";
  }

  return {
    newTodoBtns,
    form,
    modal,
    titleInput,
    pjInput,
    dateInput,
    addBtn,
    cancelBtn,
    commentBtn,
    priorityBtn,
    hide() {
      helpers.hide(modal);
      resetPriorityIcon();
      commentIcon.classList.remove("flaticon-comment-1");
      form.reset();
    },
    setDefaultDate() {
      var todayDate = today.getToday();
      dateInput.value = todayDate;
    },
    changeCommentBtn(status) {
      status === "empty"
        ? commentIcon.classList.remove("flaticon-comment-1")
        : commentIcon.classList.add("flaticon-comment-1");
    },
    activateAddBtn() {
      titleInput.value
        ? addBtn.classList.remove("deactive")
        : addBtn.classList.add("deactive");
    },
    changeFlagIcon(color, level) {
      level != "4"
        ? flagIcon.classList.add("flaticon-flag-1")
        : flagIcon.classList.remove("flaticon-flag-1");
      flagIcon.style.color = color;
    },
  };
})();

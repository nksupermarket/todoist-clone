import { helpers } from "./helpers.js";
import { listOfPjs, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
import { popups } from "./popups.js";
export { todoForm };

const todoForm = (() => {
  var newTodoBtns = document.querySelectorAll(".new-todo-btn");
  var form = document.getElementById("new-todo-form");
  var formModal = form.closest(".modal");
  var addBtn = form.querySelector("#add-todo-btn");
  var cancelBtn = form.querySelector(".close-btn");
  function hide() {
    helpers.hide(formModal);
    popups.hide();
    resetPriorityIcon;
    popups.comment.reset();
    commentIcon.classList.remove("flaticon-comment-1");
    form.reset();
  }
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

  // function placePopup(active, btn) {
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

  function setDefaultDate() {
    var todayDate = today.getToday();
    dateInput.value = todayDate;
  }

  return {
    newTodoBtns,
    form,
    formModal,
    titleInput,
    addBtn,
    cancelBtn,
    commentBtn,
    priorityBtn,
    onShowForm() {
      helpers.show(formModal);
      popups.priority.reset();
      (function removeOptions() {
        var options = pjInput.querySelectorAll("option");
        options.forEach((option) => {
          if ((option.textContent = "None")) return;
          option.remove();
        });
      })();
      listOfPjs.forEach((pj) => pj.addToForm(pjInput));
      setDefaultDate();
    },
    onAddTodo() {
      var priority =
        popups.priority.popup.querySelector(".active").dataset.value;
      var notes = { text: [], date: [] };
      (function addNotes() {
        if (!popups.comment.textarea.value) return;
        notes.text[0] = commentTextarea.value;
        notes.date[0] = today.getToday();
      })();
      var newTodo = todoFact.createTodo(
        pjInput.value,
        titleInput.value,
        dateInput.value,
        priority,
        notes
      );
      newTodo.pushToList();
      newTodo.appendContent();
      if (pjInput.value != "None") newTodo.pushToProject();

      hide();
    },
    hide,
    onIconBtn(popup, btn) {
      popup.setDataBtn(btn.dataset.id);
      popup.show();
      popups.position(popup.ctn, btn);
    },
    changeCommentBtn() {
      popups.comment.textarea.value
        ? commentIcon.classList.add("flaticon-comment-1")
        : commentIcon.classList.remove("flaticon-comment-1");
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

import { helpers } from "./helpers.js";
import { listOfPjs, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
export { todoForm };

const todoForm = (() => {
  var newTodoBtns = document.querySelectorAll(".new-todo-btn");
  var form = document.getElementById("new-todo-form");
  var formModal = form.closest(".modal");
  var addBtn = form.querySelector("#add-todo-btn");
  var cancelBtn = form.querySelector(".close-btn");
  function hideForm() {
    helpers.hide(formModal);
    hidePopups();
    commentTextarea.value = "";
    commentIcon.classList.remove("flaticon-comment-1");
    resetPriority();
    form.reset();
  }
  var commentBtn = form.querySelector(".comment-btn");
  var commentIcon = commentBtn.querySelector(".flaticon");
  var priorityBtn = form.querySelector(".priority-btn");
  var flagIcon = priorityBtn.querySelector(".flaticon");

  var popupModal = document.getElementById("popup-modal");
  var commentPopup = popupModal.querySelector("#comment-popup");
  var commentTextarea = commentPopup.querySelector("textarea");
  var commentCloseBtn = commentPopup.querySelector(".close-btn");
  var priorityPopup = popupModal.querySelector("#priority-popup");
  var prioritySelectorBtns = priorityPopup.querySelectorAll("li");

  var titleInput = form.querySelector("input[name=todo-title");
  var dateInput = form.querySelector("input[type=date");
  var pjInput = form.querySelector("select[name=todo-pj");

  function hidePopups() {
    helpers.hide(popupModal);
    var popups = popupModal.querySelectorAll(".popup-popup");
    popups.forEach((popup) => {
      popup.classList.remove("active");
      helpers.hide(popup);
    });
  }

  function placePopup(active, btn) {
    var btnPos = btn.getBoundingClientRect();

    var btnCenter = findBtnCenter();
    var btnBottom = btn.getBoundingClientRect().bottom;
    var popupCenter = findPopupCenter();
    active.style.left = `${btnCenter - popupCenter}px`;
    active.style.top = `${btnBottom + 8}px`;
    removePopupOverflow(active);

    function removePopupOverflow(active) {
      var browserWidth = document.documentElement.clientWidth;
      var popupCtn = active.querySelector(".popup-ctn");
      var newPos = active.getBoundingClientRect();
      if (newPos.right > browserWidth) {
        popupCtn.style.right = `${newPos.right - browserWidth}px`;
      }
    }

    function findBtnCenter() {
      var btnWidth = btn.offsetWidth;
      var center = btnPos.left + btnWidth / 2;
      return center;
    }

    function findPopupCenter() {
      var popupWidth = active.offsetWidth;
      var center = popupWidth / 2;
      return center;
    }
  }

  function setDefaultDate() {
    var todayDate = today.getToday();
    dateInput.value = todayDate;
  }

  function resetPriority() {
    flagIcon.classList.remove("flaticon-flag-1");
    flagIcon.style.color = "var(--main-text)";

    (function setDefeault() {
      prioritySelectorBtns.forEach((btn) => btn.classList.remove("active"));
      var priority4 = priorityPopup.querySelector(`[data-value="4"]`);
      priority4.classList.add("active");
    })();
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
    popupModal,
    commentPopup,
    commentTextarea,
    commentCloseBtn,
    priorityPopup,
    prioritySelectorBtns,
    onShowForm() {
      helpers.show(formModal);
      resetPriority();
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
      var priority = priorityPopup.querySelector(".active").dataset.value;
      var notes = { text: [], date: [] };
      (function addNotes() {
        if (!commentTextarea.value) return;
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

      hideForm();
    },
    hideForm,
    onIconBtn(popup, btn) {
      popup.dataset.btn = btn.dataset.id;
      show(popup);
      placePopup(popup, btn);
      function show(popup) {
        hidePopups();
        helpers.show(popupModal);
        helpers.show(popup);
        popup.classList.add("active");
      }
    },
    hidePopups,
    placePopup,
    changeCommentBtn() {
      commentTextarea.value
        ? commentIcon.classList.add("flaticon-comment-1")
        : commentIcon.classList.remove("flaticon-comment-1");
    },
    onSelectPriority(e) {
      removeActive();
      var btn = e.target.closest(".btn");
      btn.dataset.selected = "true";
      btn.classList.add("active");
      changeBtnColor();

      function removeActive() {
        prioritySelectorBtns.forEach((btn) => {
          if (btn.classList.contains("active")) {
            btn.classList.remove("active");
            btn.dataset.selected = "false";
          }
        });
      }

      function changeBtnColor() {
        var priorityFlag = btn.querySelector(".flaticon");
        var flagColor = priorityFlag.style.color;
        btn.dataset.value != 4
          ? flagIcon.classList.add("flaticon-flag-1")
          : flagIcon.classList.remove("flaticon-flag-1");
        flagIcon.style.color = flagColor;
      }
    },
    activateAddBtn() {
      titleInput.value
        ? addBtn.classList.remove("deactive")
        : addBtn.classList.add("deactive");
    },
  };
})();

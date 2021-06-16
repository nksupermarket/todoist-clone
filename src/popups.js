export { popups };

import { helpers } from "./helpers.js";

const popups = (() => {
  const modal = document.getElementById("popup-modal");
  let list = [];

  const popupMethods = {
    show() {
      popups.hide();
      helpers.show(modal);
      helpers.show(this.ctn);
    },
    setDataBtn(value) {
      this.ctn.dataset.btn = value;
    },
    position(btn) {
      var btnPos = btn.getBoundingClientRect();

      var btnCenter = findBtnCenter();
      var btnBottom = btn.getBoundingClientRect().bottom;
      var popupCenter = findPopupCenter.call(this);
      this.ctn.style.left = `${btnCenter - popupCenter}px`;
      this.ctn.style.top = `${btnBottom + 8}px`;
      removePopupOverflow.call(this);

      function removePopupOverflow() {
        var browserWidth = document.documentElement.clientWidth;
        var popupCtn = this.ctn.querySelector(".popup-ctn");
        var newPos = this.ctn.getBoundingClientRect();
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
        var popupWidth = this.ctn.offsetWidth;
        var center = popupWidth / 2;
        return center;
      }
    },
  };

  function createPopup(name) {
    var popup = Object.create(popupMethods);
    popup.ctn = modal.querySelector(`#${name}-popup`);
    list.push(popup);

    return popup;
  }

  const priority = createPopup("priority");
  priority.btns = priority.ctn.querySelectorAll("li");
  priority.removeActive = function () {
    this.btns.forEach((btn) => {
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        btn.dataset.selected = "false";
      }
    });
  };
  priority.setActive = function (priorityLevel) {
    this.removeActive();
    var btn = this.ctn.querySelector(`[data-value="${priorityLevel}"]`);
    btn.classList.add("active");
  };
  priority.removeActive = function () {
    var active = this.ctn.querySelector(".active");
    active.classList.remove("active");
  };
  priority.reset = function () {
    this.btns.forEach((btn) => btn.classList.remove("active"));
    var priority4 = this.ctn.querySelector(`[data-value="4"]`);
    priority4.classList.add("active");
  };

  const comment = createPopup("comment");
  comment.textarea = comment.ctn.querySelector("textarea");
  comment.closeBtn = comment.ctn.querySelector(".close-btn");
  comment.reset = function () {
    this.textarea.value = "";
  };

  const sort = createPopup("sort");
  sort.dateBtn = sort.ctn.querySelector("#sort-date-btn");
  sort.priorityBtn = sort.ctn.querySelector("#sort-priority-btn");
  sort.alphabetBtn = sort.ctn.querySelector("#sort-alphabet-btn");

  const del = createPopup("delete");
  del.text = del.ctn.querySelector(".delete-popup-text");
  del.deleteBtn = del.ctn.querySelector(".delete-act-btn");
  del.cancelBtn = del.ctn.querySelector(".cancel-act-btn");
  del.updateText = function (str) {
    this.text.textContent = `Are you sure you want to delete ${str}?`;
  };
  del.setDataItemType = function (str) {
    this.ctn.dataset.itemType = str;
  };
  del.setDataItemID = function (str) {
    this.ctn.dataset.itemId = str;
  };

  const editPj = createPopup("editPj");
  editPj.listHolder = editPj.ctn.querySelector("ul");
  editPj.editBtn = createEditPjListItem("flaticon-pen", "edit-pj-btn", "Edit");
  editPj.deleteBtn = createEditPjListItem(
    "flaticon-trash",
    "delete-pj-btn",
    "Delete Project"
  );
  editPj.listHolder.appendChild(editPj.editBtn);
  editPj.listHolder.appendChild(editPj.deleteBtn);

  function createEditPjListItem(iconName, className, str) {
    const listItem = document.createElement("li");
    listItem.classList.add("btn", "editPj-list-btn", className);

    const icon = document.createElement("i");
    icon.classList.add("flaticon", iconName);

    listItem.textContent = str;

    listItem.prepend(icon);

    return listItem;
  }

  return {
    modal,
    priority,
    comment,
    sort,
    del,
    editPj,
    hide() {
      helpers.hide(modal);
      list.forEach((popup) => {
        helpers.hide(popup.ctn);
      });
      this.modal.classList.remove("modal-full");
    },
    findActivePopup() {
      return list.find((popup) => !popup.ctn.classList.contains("inactive"));
    },
    toggleModalFull() {
      this.modal.classList.toggle("modal-full");
    },
  };
})();

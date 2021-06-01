export { popups };

import { helpers } from "./helpers.js";
import { todoForm } from "./todoForm.js";

const popups = (() => {
  var modal = document.getElementById("popup-modal");
  var priority = (() => {
    var ctn = modal.querySelector("#priority-popup");
    var btns = ctn.querySelectorAll("li");
    return {
      ctn,
      btns,
      show() {
        popups.hide();
        helpers.show(modal);
        helpers.show(ctn);
        ctn.classList.add("active");
      },
      removeActive() {
        btns.forEach((btn) => {
          if (btn.classList.contains("active")) {
            btn.classList.remove("active");
            btn.dataset.selected = "false";
          }
        });
      },
      setDataBtn(value) {
        ctn.dataset.btn = value;
      },
      setActive(priorityLevel) {
        this.removeActive();
        var btn = ctn.querySelector(`[data-value="${priorityLevel}"]`);
        btn.classList.add("active");
      },
      reset() {
        btns.forEach((btn) => btn.classList.remove("active"));
        var priority4 = ctn.querySelector(`[data-value="4"]`);
        priority4.classList.add("active");
      },
      onSelect(e) {
        this.removeActive();
        var btn = e.target.closest(".btn");
        var icon = btn.querySelector(".flaticon");
        btn.dataset.selected = "true";
        btn.classList.add("active");
        if (todoForm.formModal.classList.contains("inactive")) return;
        todoForm.changeFlagIcon(icon.style.color, btn.dataset.value);
      },
    };
  })();
  var comment = (() => {
    var ctn = modal.querySelector("#comment-popup");
    var textarea = ctn.querySelector("textarea");
    var closeBtn = ctn.querySelector(".close-btn");
    return {
      ctn,
      closeBtn,
      textarea,
      show() {
        popups.hide();
        helpers.show(modal);
        helpers.show(ctn);
        ctn.classList.add("active");
      },
      reset() {
        console.log("hi");
        console.log(textarea);
        textarea.value = "";
        console.log(textarea.textContent);
      },
      setDataBtn(value) {
        ctn.dataset.btn = value;
      },
    };
  })();

  return {
    modal,
    priority,
    comment,
    position(activePopup, btn) {
      var btnPos = btn.getBoundingClientRect();

      var btnCenter = findBtnCenter();
      var btnBottom = btn.getBoundingClientRect().bottom;
      var popupCenter = findPopupCenter();
      activePopup.style.left = `${btnCenter - popupCenter}px`;
      activePopup.style.top = `${btnBottom + 8}px`;
      removePopupOverflow(activePopup);

      function removePopupOverflow(activePopup) {
        var browserWidth = document.documentElement.clientWidth;
        var popupCtn = activePopup.querySelector(".popup-ctn");
        var newPos = activePopup.getBoundingClientRect();
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
        var popupWidth = activePopup.offsetWidth;
        var center = popupWidth / 2;
        return center;
      }
    },
    hide() {
      helpers.hide(modal);
      var popups = modal.querySelectorAll(".popup-popup");
      popups.forEach((popup) => {
        popup.classList.remove("active");
        helpers.hide(popup);
      });
    },
  };
})();

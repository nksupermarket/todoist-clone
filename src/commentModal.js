import { helpers } from "./helpers.js";

export { commentModal };

const commentModal = (() => {
  const modal = document.querySelector(".comment-modal");
  const form = modal.querySelector("#add-comment");
  const commentList = modal.querySelector(".comment-list");
  const closeBtn = modal.querySelector(".close-btn");
  const pjTitle = modal.querySelector(".project-title");
  const todoTitle = modal.querySelector(".todo-title");
  const addBtn = modal.querySelector(".add-comment-btn");
  const textarea = form.querySelector("textarea");

  return {
    modal,
    form,
    closeBtn,
    addBtn,
    pjTitle,
    todoTitle,
    textarea,
    setDataItemType(str) {
      this.form.dataset.itemType = str;
    },
    setDataItemID(id) {
      this.form.dataset.itemId = id;
    },
    changePjTitle(str) {
      this.pjTitle.textContent = str;
    },
    changeTodoTitle(str) {
      this.todoTitle.textContent = str;
    },
    attachNote(note, date) {
      const myLineBreak = note.replace(/\r\n|\r|\n/g, "</br>");
      const dateText = document.createElement("p");
      dateText.textContent = date;
      const noteText = document.createElement("p");
      noteText.innerHTML = myLineBreak;
      commentList.appendChild(dateText);
      commentList.appendChild(noteText);
    },
    close() {
      helpers.hide(modal);
      form.removeAttribute("data-todo");
      commentList.textContent = "";
      textarea.value = "";
    },
  };
})();

import { helpers } from "./helpers.js";
import { listOfPjs, listOfTodos } from "./projects.js";
import { today } from "./today.js";

export { commentModal };

const commentModal = (() => {
  var modal = document.querySelector(".comment-modal");
  var form = modal.querySelector("#add-comment");
  var commentList = modal.querySelector(".comment-list");
  var editor = modal.querySelector(".comment-editor");
  var closeBtn = modal.querySelector(".close-btn");

  var pjTitle = modal.querySelector(".project-title");
  var todoTitle = modal.querySelector(".todo-title");

  var addBtn = modal.querySelector(".add-comment-btn");
  addBtn.addEventListener("click", onAddComment);

  var textarea = form.querySelector("textarea");

  function close() {
    helpers.hide(modal);
    form.removeAttribute("data-todo");
    commentList.textContent = "";
    textarea.value = "";
  }

  function onAddComment() {
    var todoId = form.dataset.todo;
    var todo = helpers.findItem(listOfTodos, todoId);

    var note = textarea.value;
    var date = today.getToday();

    todo.notes.text[todo.notes.text.length] = note;
    todo.notes.date[todo.notes.date.length] = date;

    fillCommentList(note, date);
    todo.content.updateCommentCounter();

    textarea.value = "";
  }

  function fillCommentList(note, date) {
    var myLineBreak = note.replace(/\r\n|\r|\n/g, "</br>");
    var dateText = document.createElement("p");
    dateText.textContent = date;
    var noteText = document.createElement("p");
    noteText.innerHTML = myLineBreak;
    commentList.appendChild(dateText);
    commentList.appendChild(noteText);
    console.log(noteText);
  }

  return {
    modal,
    form,
    closeBtn,
    addBtn,
    attachTodoId(id) {
      form.dataset.todo = id;
    },
    changePjTitle(str) {
      pjTitle.textContent = str;
    },
    changeTodoTitle(str) {
      todoTitle.textContent = str;
    },
    fillCommentList,
    close,
  };
})();

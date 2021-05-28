import { listOfPjs, listOfTodos, pjFact } from "./projects.js";
import { today } from "./today.js";
import { helpers } from "./helpers.js";

export { menu, content };

const content = (() => {
  var content = document.getElementById("content");
  var contentTitle = content.querySelector(".content-title");
  var todoList = content.querySelector("#todo-list");

  function removeTodos() {
    var visibleTodos = todoList.querySelectorAll(".todo-ctn");
    visibleTodos.forEach((ctn) => ctn.remove());
  }

  return {
    contentTitle,
    todoList,
    display(pjId) {
      removeTodos();
      var pj = helpers.findItem(listOfPjs, pjId);
      todoList.dataset.project = pjId;
      contentTitle.textContent = pj.title;
      pj.todoList.forEach((todo) => {
        helpers.show(todo.ctn);
        todoList.appendChild(todo.ctn);
      });
    },
    displayToday() {
      removeTodos();
      contentTitle.textContent = "Today";
      var todoList = today.getTodayTodos(listOfTodos);
      todoList.forEach((todo) => {
        helpers.show(todo.ctn);
        this.todoList.appendChild(todo.ctn);
      });
    },
    refresh() {
      var pjId = todoList.dataset.project;
      this.display(pjId);
    },
  };
})();

const menu = (() => {
  var menu = document.getElementById("menu");
  var today = menu.querySelector("#today-menu");
  var upcoming = menu.querySelector("#upcoming-menu");
  var form = menu.querySelector("#new-pj-form");
  var newBtn = menu.querySelector("#new-pj-btn");
  var addBtn = menu.querySelector("#add-pj-btn");
  var cancelBtn = menu.querySelector("#cancel-pj-btn");

  var titleInput = document.querySelector("#new-pj-form input[name=pj-title]");

  function onPjItem(e) {
    var pjId = e.target.dataset.project;
    content.display(pjId);
  }

  function hideForm() {
    helpers.hide(form);
    form.reset();
  }

  var pjListItems = menu.querySelectorAll(".pj-list-item");

  return {
    today,
    upcoming,
    form,
    newBtn,
    addBtn,
    cancelBtn,
    pjListItems,
    onToday() {
      content.displayToday();
    },
    onUpcoming() {},
    onNewPj() {
      helpers.show(form);
    },
    onAddPj() {
      if (!titleInput.value) return helpers.inputError("empty");
      var newPj = pjFact.createProject(titleInput.value);
      newPj.pushToList();
      newPj.addToMenu().addEventListener("click", (e) => onPjItem(e));
      hideForm();
    },
    hideForm,
    onPjItem,
  };
})();

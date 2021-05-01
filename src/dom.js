import { pjFactory, todoFactory } from "./projects.js";

let listOfPjs = [];
let listOfTodos = [];

var pjFact = new pjFactory();
var todoFact = new todoFactory();

const helpers = (() => ({
  pushTo(list, obj) {
    list.push(obj);
  },
  show(el) {
    el.classList.remove("inactive");
  },
  hide(el) {
    el.classList.add("inactive");
  },
  findPj(id) {
    return listOfPjs.find((pj) => pj.id.toString() === id.toString());
  },
}))();

var pj = pjFact.createProject("fd;lkeaj;f");
var fdlkaTodo = todoFact.createTodo(pj.id, "fdlka", "2021-06-01", "urgent", "");
fdlkaTodo.pushToProject(pj);

helpers.pushTo(listOfPjs, pj);
helpers.pushTo(listOfTodos, fdlkaTodo);

const init = (() => {
  (function displayPjs() {
    listOfPjs.forEach((pj) => pj.addToMenu());
  })();
  (function displayPjOptions() {
    listOfPjs.forEach((pj) => pj.addToForm());
  })();
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
    var pjId = e.target.id;
    var pj = helpers.findPj(pjId);
    content.display(pj);
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
    onToday() {},
    onUpcoming() {},
    onNewPj() {
      helpers.show(form);
    },
    onAddPj() {
      if (!titleInput.value) return helpers.inputError("empty");
      var newPj = pjFact.createProject(titleInput.value);
      helpers.pushTo(listOfPjs, newPj);
      newPj.addToMenu().addEventListener("click", (e) => onPjItem(e));
      newPj.addToForm();
      hideForm();
    },
    hideForm,
    onPjItem,
  };
})();

menu.today.addEventListener("click", menu.onToday);
menu.upcoming.addEventListener("click", menu.onUpcoming);
menu.newBtn.addEventListener("click", menu.onNewPj);
menu.addBtn.addEventListener("click", menu.onAddPj);
menu.cancelBtn.addEventListener("click", menu.hideForm);
menu.pjListItems.forEach((item) =>
  item.addEventListener("click", (e) => menu.onPjItem(e))
);

const content = (() => {
  var content = document.getElementById("content");
  var contentTitle = content.querySelector(".content-title");
  var todoList = content.querySelector("#todo-list");
  var editBtns = content.querySelectorAll(".edit-btn");
  var notesBtns = content.querySelectorAll(".notes-btn");
  var moreBtns = content.querySelectorAll(".more-btn");

  return {
    contentTitle,
    todoList,
    editBtns,
    notesBtns,
    moreBtns,
    display(pj) {
      contentTitle.textContent = pj.title;
      var visibleTodos = todoList.querySelectorAll(".todo-ctn");
      visibleTodos.forEach((ctn) => helpers.hide(ctn));
      pj.todoList.forEach((todo) => {
        todo.ctn.classList.remove("inactive");
      });
    },
    onMoreBtn() {},
  };
})();

// content.editBtns.forEach((btn) => btn.addEventListener("click"));
// content.notesBtns.forEach((btn) => btn.addEventListener("click"));
// content.moreBtns.forEach((btn) => btn.addEventListener("click", onMoreBtn));

const todo = (() => {
  var newTodoBtns = document.querySelectorAll(".new-todo-btn");
  var form = document.getElementById("new-todo-form");
  var addBtn = form.querySelector("#add-todo-btn");
  var cancelBtn = form.querySelector("#cancel-todo-btn");
  function hideForm() {
    helpers.hide(form);
    form.reset();
  }
  return {
    newTodoBtns,
    form,
    addBtn,
    cancelBtn,
    onAddTodo() {
      var projectInput = form.querySelector("select");
      var titleInput = form.querySelector("input[name=todo-title]");
      var notesInput = form.querySelector("input[name=todo-notes]");
      var dayInput = form.querySelector("input[name=todo-day]");
      var priorityInput = form.querySelector("input[name=todo-priority]");

      var newTodo = todoFact.createTodo(
        projectInput.value,
        titleInput.value,
        dayInput.value,
        priorityInput.value,
        notesInput.value
      );

      var pj = helpers.findPj(projectInput.value);
      newTodo.pushToProject(pj);

      helpers.pushTo(listOfTodos, newTodo);
      content.display(pj);
      hideForm();
    },
    hideForm,
  };
})();

// window.onload = todo.displayPjOptions;
todo.newTodoBtns.forEach((btn) =>
  btn.addEventListener("click", () => helpers.show(todo.form))
);
todo.addBtn.addEventListener("click", todo.onAddTodo);
todo.cancelBtn.addEventListener("click", () => helpers.hide(todo.form));

const today = () => {
  var today = new Date();
  var thisMonth = today.getMonth;
  var thisDay = today.getDate;
  var todayStr = `${thisMonth}/${thisDay}`;
  function getTodaytodos() {
    listOftodos.filter((todo) => {
      return todo.day === todayStr;
    });
  }
};

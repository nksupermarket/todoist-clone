import { createProject, createTodo } from "./projects.js";

let listOfPjs = [];
let listOfTasks = [];

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
  findPj(title) {
    return listOfPjs.find((pj) => pj.title === title);
  },
}))();

const menu = (() => {
  var menu = document.getElementById("menu");
  var today = menu.querySelector("#today-menu");
  var upcoming = menu.querySelector("#upcoming-menu");
  var newPjForm = menu.querySelector("#new-pj-form");
  var newPjBtn = menu.querySelector("#new-pj-btn");
  var addPjBtn = menu.querySelector("#add-pj-btn");
  var cancelPjBtn = menu.querySelector("#cancel-pj-btn");

  var titleInput = document.querySelector("#new-pj-form input[name=pj-title]");

  function hidePjForm() {
    helpers.hide(newPjForm);
    titleInput.value = "";
  }

  return {
    today,
    upcoming,
    newPjForm,
    newPjBtn,
    addPjBtn,
    cancelPjBtn,
    displayPjs() {
      listOfPjs.forEach((pj) => pj.addToMenu());
    },
    onToday() {},
    onUpcoming() {},
    onPjItem(e) {
      var pjTitle = e.target.textContent;
      var pj = helpers.findPj(pjTitle);
      content.display(pj);
    },
    onNewPj() {
      helpers.show(newPjForm);
    },
    onAddPj() {
      if (!titleInput.value) return helpers.inputError("empty");
      if (helpers.findPj(titleInput.value))
        return helpers.inputError("duplicate");
      var newPj = createProject(titleInput.value);
      helpers.pushTo(listOfPjs, newPj);
      newPj.addToMenu();
      console.log(hidePjForm);
      hidePjForm();
    },
    hidePjForm,
  };
})();

window.onload = menu.displayPjs;
menu.today.addEventListener("click", menu.onToday);
menu.upcoming.addEventListener("click", menu.onUpcoming);
menu.newPjBtn.addEventListener("click", menu.onNewPj);
menu.addPjBtn.addEventListener("click", menu.onAddPj);
menu.cancelPjBtn.addEventListener("click", menu.hidePjForm);

const content = (() => {
  var content = document.getElementById("content");
  var contentTitle = content.querySelector(".content-title");
  var taskList = content.querySelector("#task-list");

  function createSection(task) {
    var taskSection = document.createElement("section");
    taskSection.classList.add("task-ctn");
    var taskTitle = document.createElement("p");
    taskTitle.classList.add("task-title");
    var taskDay = document.createElement("p");
    taskDay.classList.add("task-day");

    var taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");
    var editBtn = createBtn("edit", "pen");
    var notesBtn = createBtn("notes", "comment");
    var moreBtn = createBtn("more", "more-1");
    function createBtn(name, icon) {
      var btn = document.createElement("button");
      btn.innerHTML = `<i class="flaticon flaticon-${icon}></i>"`;
      btn.classList.add(`${name - btn}`, "btn");
      taskActions.appendChild(btn);
      return btn;
    }

    taskSection.appendChild(taskTitle);
    taskSection.appendChild(taskDay);
    taskSection.appendChild(taskActions);

    taskList.appendChild(taskSection);
  }

  var editBtns = content.querySelectorAll(".edit-btn");
  var notesBtns = content.querySelectorAll(".notes-btn");
  var moreBtns = content.querySelectorAll(".more-btn");

  return {
    contentTitle,
    taskList,
    editBtns,
    notesBtns,
    moreBtns,
    display(pj) {
      contentTitle.textContent = pj.title;
      pj.taskList.forEach((task) => createSection(task));
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
  var addTodoBtn = form.querySelector("#add-todo-btn");
  return {
    newTodoBtns,
    form,
    addTodoBtn,
    onAddTodo() {
      var projectInput = form.querySelector("#todo-project-input");
      var titleInput = form.querySelector("input[name=todo-title]");
      var descInput = form.querySelector("input[name=todo-notes]");
      var dayInput = form.querySelector("#input[name=todo-day]");
      var priorityInput = form.querySelector("input[name=todo-priority]");

      var newTodo = createTodo(
        projectInput.value,
        titleInput.value,
        descInput.value,
        dayInput.value,
        priorityInput.value
      );

      helpers.pushTo(listOfTasks, newTodo);
    },
  };
})();

todo.newTodoBtns.forEach((btn) =>
  btn.addEventListener("click", () => helpers.show(todo.form))
);
todo.addTodoBtn.addEventListener("click", todo.onAddTodo);

const today = () => {
  var today = new Date();
  var thisMonth = today.getMonth;
  var thisDay = today.getDate;
  var todayStr = `${thisMonth}/${thisDay}`;
  function getTodayTasks() {
    listOfTasks.filter((task) => {
      return task.day === todayStr;
    });
  }
};

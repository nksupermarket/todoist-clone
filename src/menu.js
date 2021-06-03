import { listOfPjs, listOfTodos, pjFact } from "./projects.js";
import { today } from "./today.js";
import { helpers } from "./helpers.js";

export { menu, content };

const content = (() => {
  var main = document.getElementById("content");

  const ctnMethods = {
    createHeader() {
      var header = document.createElement("header");
      header.classList.add("view-header", "view-content");
      return header;
    },
    createHeaderContent(titleTag) {
      var ctn = document.createElement("div");
      ctn.classList.add("view-header-content");

      var title = document.createElement(titleTag);
      title.classList.add("content-title");

      ctn.appendChild(title);
      return {
        ctn: ctn,
        title: title,
      };
    },
    createNewTodoBtn() {
      var btn = document.createElement("button");
      btn.classList.add("btn", "new-todo-btn");

      var icon = document.createElement("i");
      icon.classList.add("flaticon", "flaticon-plus");

      var text = document.createElement("span");
      text.classList.add("add-todo-btn-text");
      text.textContent = "Add todo";

      btn.appendChild(icon);
      btn.appendChild(text);

      return btn;
    },
    createActionCtn() {
      var ctn = document.createElement("div");
      ctn.classList.add("pj-icon-ctn");
      return ctn;
    },
    createIconBtn(iconName, className, str) {
      var btn = document.createElement("button");
      btn.classList.add("btn", "icon-btn", className);

      var icon = document.createElement("i");
      icon.classList.add("flaticon", iconName);
      btn.prepend(icon);

      var text = document.createElement("span");
      text.classList.add("btn-text");
      text.textContent = str;
      btn.appendChild(text);

      return btn;
    },
    createTodoList() {
      var todoList = document.createElement("ul");
      todoList.classList.add("todo-list", "view-content");
      return todoList;
    },
  };

  // var sortBtn = createBtn("flaticon-sort", "sort-btn", "Sort");
  // var commentBtn = createBtn("flaticon-comment", "comment-btn", "Comments");
  // var deleteBtn = createBtn("flaticon-trash", "delete-btn", "Delete");

  // ctn.appendChild(sortBtn);
  // ctn.appendChild(commentBtn);
  // ctn.appendChild(deleteBtn);

  function createCtn(name) {
    var ctn = Object.create(ctnMethods);
    ctn.main = document.createElement("div");
    ctn.main.id = `${name}-ctn`;

    ctn.header = ctn.createHeader();
    ctn.headerContent = ctn.createHeaderContent("h1");
    ctn.header.appendChild(ctn.headerContent.ctn);
    ctn.title = ctn.headerContent.title;

    ctn.main.appendChild(ctn.header);

    return ctn;
  }

  const todayCtn = createCtn("today");
  var todayStr = new Date().toString().slice(0, 10);
  todayCtn.title.innerHTML = `<span>Today</span><small>${todayStr}</small>`;
  var btn = todayCtn.createNewTodoBtn();
  todayCtn.todoList = todayCtn.createTodoList();
  todayCtn.todoList.appendChild(btn);
  todayCtn.main.appendChild(todayCtn.todoList);

  const upcomingCtn = createCtn("upcoming");
  upcomingCtn.title.textContent = "Upcoming";
  upcomingCtn.listHolder = document.createElement("div");
  upcomingCtn.sections = [];
  upcomingCtn.generateSections = (number) => {
    for (var i = 1; i < number; i++) {
      var section = document.createElement("section");

      var header = upcomingCtn.createHeader();
      var headerContent = upcomingCtn.createHeaderContent("h2");
      headerContent.ctn.classList.add("section-header");

      var title = headerContent.title;

      header.appendChild(headerContent.ctn);

      var todoList = document.createElement("ul");
      todoList.classList.add("todo-list");

      var todoBtn = upcomingCtn.createNewTodoBtn();
      todoList.appendChild(todoBtn);

      section.appendChild(header);
      section.appendChild(todoList);

      upcomingCtn.listHolder.appendChild(section);

      upcomingCtn.sections.push({ section, title, todoList });
    }
  };
  upcomingCtn.generateSections(8);
  upcomingCtn.main.appendChild(header);
  upcomingCtn.main.appendChild(upcomingCtn.listHolder);

  const pjCtn = (() => {
    var ctn = document.createElement("div");
    ctn.id = "pj-ctn";
    var header = createCtnHeader();
    var headerContent = createHeaderContent("h1");
    header.appendChild(headerContent.ctn);
    var title = headerContent.title;
    var actionCtn = createActionCtn();
    headerContent.ctn.appendChild(actionCtn.ctn);
    var sortBtn = actionCtn.sortBtn;
    var commentBtn = actionCtn.commentBtn;
    var deleteBtn = actionCtn.deleteBtn;
    var todoList = document.createElement("ul");
    todoList.classList.add("todo-list");

    var todoBtn = createNewTodoBtn();
    todoList.appendChild(todoBtn);

    actionCtn.sortBtn.addEventListener("click", function () {
      var pjId = actionCtn.sortBtn.dataset.project;
      var pjTodoList = helpers.findItem(listOfPjs, pjId).todoList;
      actionCtn.sort("", pjTodoList);
      pjTodoList.forEach((todo) => todo.ctn.remove());
      pjTodoList.forEach((todo) => todoList.appendChild(todo.ctn));
      todoBtn.remove();
      todoList.appendChild(todoBtn);
    });

    ctn.appendChild(header);
    ctn.appendChild(todoList);

    return {
      ctn,
      header,
      sortBtn,
      commentBtn,
      deleteBtn,
      title,
      todoList,
    };
  })();

  function removeCtns() {
    todayCtn.ctn.remove();
    upcomingCtn.ctn.remove();
    pjCtn.ctn.remove();
  }
  function removeTodos(ctn) {
    var todoCtns = ctn.querySelectorAll(".todo-ctn");
    if (!todoCtns[0]) return;
    todoCtns.forEach((todo) => todo.remove());
  }
  return {
    pjCtn,
    todayCtn,
    upcomingCtn,
    display(pjId) {
      removeTodos(pjCtn.todoList);
      removeCtns();
      var pj = helpers.findItem(listOfPjs, pjId);
      pjCtn.todoList.dataset.project = pjId;
      var pjCtnBtns = pjCtn.header.querySelectorAll("button");
      pjCtnBtns.forEach((btn) => (btn.dataset.project = pjId));
      pjCtn.title.textContent = pj.title;
      pj.todoList.forEach((todo) => {
        helpers.show(todo.ctn);
        pjCtn.todoList.prepend(todo.ctn);
      });
      main.appendChild(pjCtn.ctn);
    },
    displayToday() {
      removeCtns();
      removeTodos(todayCtn.ctn);
      var todayList = today.getTodayTodos(listOfTodos);
      var todoList = todayCtn.todoList;
      todayList.forEach((todo) => {
        todoList.prepend(todo.ctn);
      });
      main.appendChild(todayCtn.ctn);
    },
    displayUpcoming() {
      removeCtns();
      removeTodos(upcomingCtn.ctn);
      fillSections();
      function fillSections() {
        var dateObj = new Date();
        for (var i = 0; i < upcomingCtn.sections.length; i++) {
          dateObj.setDate(dateObj.getDate() + i);
          setTitle(i);
          setTodoList(i);

          function setTitle(i) {
            upcomingCtn.sections[i].title.textContent = dateObj
              .toString()
              .slice(0, 10);
            console.log(i);
            if (i === 0)
              upcomingCtn.sections[i].title.textContent = "Today — ".concat(
                upcomingCtn.sections[i].title.textContent
              );
            if (i === 1)
              upcomingCtn.sections[i].title.textContent = "Tomorrow — ".concat(
                upcomingCtn.sections[i].title.textContent
              );
          }
          function setTodoList(i) {
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth() + 1;
            var day = dateObj.getDate();
            if (month.toString().length === 1)
              month = "0".concat(month.toString());
            if (day.toString().length === 1) day = "0".concat(day.toString());
            var dayStr = `${year}-${month}-${day}`;
            var todos = listOfTodos.filter((item) => item.day == dayStr);
            if (!todos[0])
              return upcomingCtn.sections[i].title.classList.add("empty");
            todos.forEach((todo) =>
              upcomingCtn.sections[i].todoList.prepend(todo.ctn)
            );
          }
        }
      }
      main.appendChild(upcomingCtn.ctn);
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
    onUpcoming() {
      content.displayUpcoming();
    },
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

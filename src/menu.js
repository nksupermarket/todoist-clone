import { listOfPjs, listOfTodos, pjFact } from "./projects.js";
import { today } from "./today.js";
import { helpers } from "./helpers.js";

export { menu, content };

const content = (() => {
  var main = document.getElementById("content");

  const todayCtn = (() => {
    var ctn = document.createElement("div");
    ctn.id = "today-ctn";

    var header = createCtnHeader();
    var headerContent = createHeaderContent();
    header.appendChild(headerContent.ctn);
    headerContent.title.textContent = "Today";

    var todoList = document.createElement("ul");
    todoList.classList.add("todo-list", "view-content");

    var btn = createNewTodoBtn();

    ctn.appendChild(header);
    ctn.appendChild(todoList);

    return {
      ctn,
      todoList,
      btn,
    };
  })();

  const upcomingCtn = (() => {
    var ctn = document.createElement("div");
    ctn.id = "upcoming-ctn";
    var header = createCtnHeader();
    var headerContent = createHeaderContent();
    header.appendChild(headerContent.ctn);
    headerContent.title.textContent = "Upcoming";

    var listHolder = document.createElement("div");

    var sections = [];
    generateSections(8);

    ctn.appendChild(header);
    ctn.appendChild(listHolder);

    function generateSections(number) {
      for (var i = 1; i < number; i++) {
        var section = document.createElement("section");

        var header = createCtnHeader();
        var headerContent = createHeaderContent();

        var title = headerContent.title;

        header.appendChild(headerContent.ctn);

        var todoList = document.createElement("ul");
        todoList.classList.add("todo-list");

        var addTodoBtn = createNewTodoBtn();

        section.appendChild(header);
        section.appendChild(todoList);
        section.appendChild(addTodoBtn);

        listHolder.appendChild(section);

        sections.push({ section, title, todoList });
      }
    }

    return {
      ctn,
      sections,
    };
  })();

  const pjCtn = (() => {
    var ctn = document.createElement("div");
    ctn.id = "pj-ctn";
    var header = createCtnHeader();
    var headerContent = createHeaderContent();
    header.appendChild(headerContent.ctn);
    var title = headerContent.title;
    var todoList = document.createElement("ul");
    todoList.classList.add("todo-list");

    ctn.appendChild(header);
    ctn.appendChild(todoList);

    return {
      ctn,
      title,
      todoList,
    };
  })();

  function createNewTodoBtn() {
    var btn = document.createElement("button");
    btn.classList.add("btn", "add-todo-btn");

    var icon = document.createElement("i");
    icon.classList.add("flaticon", "flaticon-plus");

    var text = document.createElement("span");
    text.classList.add("add-todo-btn-text");
    text.textContent = "Add todo";

    btn.appendChild(icon);
    btn.appendChild(text);

    return btn;
  }

  function createCtnHeader() {
    var header = document.createElement("header");
    header.classList.add("view-header", "view-content");
    return header;
  }
  function createHeaderContent() {
    var ctn = document.createElement("div");
    ctn.classList.add("view-header-content");

    var title = document.createElement("h2");
    title.classList.add("content-title");

    ctn.appendChild(title);
    return {
      ctn: ctn,
      title: title,
    };
  }

  function removeCtns() {
    todayCtn.ctn.remove();
    upcomingCtn.ctn.remove();
    pjCtn.ctn.remove();
  }
  function removeTodos(ctn) {
    var todoCtns = ctn.querySelectorAll("todo-ctn");
    if (!todoCtns[0]) return;
    todoCtns.forEach((todo) => todo.remove());
  }
  return {
    display(pjId) {
      removeTodos(pjCtn.ctn);
      removeCtns();
      var pj = helpers.findItem(listOfPjs, pjId);
      pjCtn.todoList.dataset.project = pjId;
      pjCtn.title.textContent = pj.title;
      pj.todoList.forEach((todo) => {
        helpers.show(todo.ctn);
        pjCtn.todoList.appendChild(todo.ctn);
      });
      main.appendChild(pjCtn.ctn);
    },
    displayToday() {
      removeCtns();
      removeTodos(todayCtn.ctn);
      var todayList = today.getTodayTodos(listOfTodos);
      var todoList = todayCtn.todoList;
      todayList.forEach((todo) => {
        todoList.appendChild(todo.ctn);
      });
      todoList.appendChild(todayCtn.btn);
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
              upcomingCtn.sections[i].title.textContent = "Today - ".concat(
                upcomingCtn.sections[i].title.textContent
              );
            if (i === 1)
              upcomingCtn.sections[i].title.textContent = "Tomorrow - ".concat(
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
            todos.forEach((todo) =>
              upcomingCtn.sections[i].todoList.appendChild(todo.ctn)
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

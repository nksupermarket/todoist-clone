export { content };
import { helpers } from "./helpers.js";
import { listOfTodos } from "./projects.js";

const content = (() => {
  const main = document.getElementById("content");
  let list = [];

  const ctnMethods = {
    removeTodos() {
      var todoCtns = this.main.querySelectorAll(".todo-ctn");
      if (todoCtns.length === 0) return this;
      todoCtns.forEach((todo) => todo.remove());
      return this;
    },
    hideSortedBtn() {
      if (!this.sortedBtn) return this;
      helpers.hide(this.sortedBtn);
      return this;
    },
    sortDate() {
      this.todoArray.sort(dueDateAscending);
      function dueDateAscending(a, b) {
        var aDate = new Date(a.day);
        var bDate = new Date(b.day);

        if (aDate > bDate) return 1;
        if (aDate < bDate) return -1;
        return 0;
      }
    },
    sortPriority() {
      this.todoArray.sort(priorityDescending);
      function priorityDescending(a, b) {
        if (a.priority > b.priority) return 1;
        if (a.priority < b.priority) return -1;
        return 0;
      }
    },
    sortAlphabetically() {
      this.todoArray.sort(alphabetAsc);
      function alphabetAsc(a, b) {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
      }
    },
    sortReverse() {
      this.todoArray.reverse();
    },
    refresh() {
      (function refreshTodoList() {
        let fragment = document.createDocumentFragment();
        this.todoArray.forEach((todo) => todo.ctn.remove());
        this.todoArray.forEach((todo) => fragment.appendChild(todo.ctn));
        fragment.appendChild(this.todoBtn);
        this.todoList.appendChild(fragment);
      })();

      return this;
    },
  };

  const createNew = {
    header() {
      var header = document.createElement("header");
      header.classList.add("view-header", "view-content");
      return header;
    },
    headerContent(titleTag) {
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
    todoBtn() {
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
    actionCtn() {
      var ctn = document.createElement("div");
      ctn.classList.add("action-ctn");
      return ctn;
    },
    iconBtn(iconName, className, str, id) {
      const btn = helpers.createIconBtn(iconName, className);

      var text = document.createElement("span");
      text.classList.add("btn-text");
      text.textContent = str;
      btn.appendChild(text);

      btn.dataset.id = `${id}-${str}`;

      return btn;
    },
    todoList() {
      var todoList = document.createElement("ul");
      todoList.classList.add("todo-list", "view-content");
      return todoList;
    },
  };

  function createCtn(name) {
    var ctn = Object.create(ctnMethods);
    ctn.main = document.createElement("div");
    ctn.main.classList.add("main-ctn");
    ctn.main.id = `${name}-ctn`;

    ctn.header = createNew.header();
    const headerContentObj = createNew.headerContent("h1");
    ctn.headerContent = headerContentObj.ctn;
    ctn.header.appendChild(ctn.headerContent);
    ctn.title = headerContentObj.title;

    ctn.main.appendChild(ctn.header);

    ctn.todoArray = [];

    list.push(ctn);

    return ctn;
  }

  const todayCtn = createCtn("today");
  var todayStr = new Date().toString().slice(0, 10);
  todayCtn.title.innerHTML = `<span>Today</span><small>${todayStr}</small>`;
  todayCtn.actionCtn = createNew.actionCtn();
  todayCtn.headerContent.appendChild(todayCtn.actionCtn);
  todayCtn.sortedBtn = createNew.iconBtn(
    "flaticon",
    "sorted-btn",
    "",
    todayCtn.main.id
  );
  todayCtn.sortedBtn.classList.add("inactive");
  todayCtn.sortedBtnIcon = todayCtn.sortedBtn.querySelector(".flaticon");
  todayCtn.sortedBtnText = todayCtn.sortedBtn.querySelector(".btn-text");
  todayCtn.sortBtn = createNew.iconBtn(
    "flaticon-sort",
    "sort-btn",
    "Sort",
    todayCtn.main.id
  );
  todayCtn.actionCtn.appendChild(todayCtn.sortedBtn);
  todayCtn.actionCtn.appendChild(todayCtn.sortBtn);
  todayCtn.todoBtn = createNew.todoBtn();
  todayCtn.todoList = createNew.todoList();
  todayCtn.todoList.appendChild(todayCtn.todoBtn);
  todayCtn.main.appendChild(todayCtn.todoList);

  const upcomingCtn = createCtn("upcoming");
  upcomingCtn.title.textContent = "Upcoming";
  upcomingCtn.listHolder = document.createElement("div");
  upcomingCtn.sections = [];
  upcomingCtn.createSections = (number) => {
    for (var i = 1; i < number; i++) {
      var ctn = document.createElement("section");

      var header = createNew.header();
      header.setAttribute("class", "section-header section-content");
      var headerContent = createNew.headerContent("h2");
      headerContent.ctn.setAttribute("class", "section-header-content");

      var title = headerContent.title;

      header.appendChild(headerContent.ctn);

      var todoList = document.createElement("ul");
      todoList.classList.add("todo-list");

      var todoBtn = createNew.todoBtn();
      todoList.appendChild(todoBtn);

      ctn.appendChild(header);
      ctn.appendChild(todoList);

      upcomingCtn.listHolder.appendChild(ctn);

      upcomingCtn.sections.push({ ctn, title, todoList, todoBtn });
    }
  };
  upcomingCtn.createSections(8);
  upcomingCtn.main.appendChild(upcomingCtn.listHolder);
  upcomingCtn.refresh = function () {
    this.sections.forEach((section) => {
      var todos = listOfTodos.filter(
        (item) => item.day == section.todoList.dataset.dateStr
      );
      if (!todos[0]) return section.title.classList.add("empty");
      todos.forEach((todo) => section.todoList.prepend(todo.ctn));
      section.todoList.appendChild(section.todoBtn);
    });
  };

  const pjCtn = createCtn("pj");
  pjCtn.editor = helpers.createPJEditor("header-title-input");
  pjCtn.headerContent.appendChild(pjCtn.editor.ctn);
  pjCtn.actionCtn = createNew.actionCtn();
  pjCtn.headerContent.appendChild(pjCtn.actionCtn);
  pjCtn.sortedBtn = createNew.iconBtn(
    "flaticon",
    "sorted-btn",
    "",
    pjCtn.main.id
  );
  pjCtn.sortedBtn.classList.add("inactive");
  pjCtn.sortedBtnIcon = pjCtn.sortedBtn.querySelector(".flaticon");
  pjCtn.sortedBtnText = pjCtn.sortedBtn.querySelector(".btn-text");
  pjCtn.sortBtn = createNew.iconBtn(
    "flaticon-sort",
    "sort-btn",
    "Sort",
    pjCtn.main.id
  );
  pjCtn.commentBtn = createNew.iconBtn(
    "flaticon-comment",
    "comment-btn",
    "Comments"
  );
  pjCtn.deleteBtn = createNew.iconBtn(
    "flaticon-trash",
    "delete-btn",
    "Delete",
    pjCtn.main.id
  );
  pjCtn.editBtn = createNew.iconBtn(
    "flaticon-pen",
    "edit-btn",
    "Edit",
    pjCtn.main.id
  );
  pjCtn.actionCtn.appendChild(pjCtn.sortedBtn);
  pjCtn.actionCtn.appendChild(pjCtn.sortBtn);
  pjCtn.actionCtn.appendChild(pjCtn.editBtn);
  pjCtn.actionCtn.appendChild(pjCtn.commentBtn);
  pjCtn.actionCtn.appendChild(pjCtn.deleteBtn);
  pjCtn.todoList = createNew.todoList();
  pjCtn.todoBtn = createNew.todoBtn();
  pjCtn.todoList.appendChild(pjCtn.todoBtn);
  pjCtn.main.appendChild(pjCtn.todoList);
  pjCtn.refreshTitle = function (list) {
    const pj = helpers.findItem(list, pjCtn.main.dataset.project);
    pjCtn.title.textContent = pj.title;
    helpers.show(this.title);
    helpers.hide(this.editor.ctn);
    return this;
  };
  pjCtn.setDataProject = function (id) {
    pjCtn.main.dataset.project = id;
    const btnKeys = Object.keys(pjCtn).filter((key) => key.endsWith("Btn"));

    btnKeys.forEach((key) => (pjCtn[key].dataset.project = id));
  };

  return {
    list,
    main,
    pjCtn,
    todayCtn,
    upcomingCtn,
    findActiveCtn() {
      return list.find((ctn) => this.main.contains(ctn.main));
    },
    removeActiveCtn() {
      var activeCtn = this.findActiveCtn();
      if (!activeCtn) return;
      activeCtn.main.remove();
      activeCtn.hideSortedBtn().removeTodos();
    },
  };
})();

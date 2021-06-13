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
      let fragment = document.createDocumentFragment();
      this.todoArray.forEach((todo) => todo.ctn.remove());
      this.todoArray.forEach((todo) => fragment.appendChild(todo.ctn));
      fragment.appendChild(this.todoBtn);
      this.todoList.appendChild(fragment);
      return this;
    },
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
      ctn.classList.add("action-ctn");
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

      btn.dataset.id = `${this.main.id}-${str}`;

      return btn;
    },
    createTodoList() {
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

    ctn.header = ctn.createHeader();
    ctn.headerContent = ctn.createHeaderContent("h1");
    ctn.header.appendChild(ctn.headerContent.ctn);
    ctn.title = ctn.headerContent.title;

    ctn.main.appendChild(ctn.header);

    ctn.todoArray = [];

    list.push(ctn);

    return ctn;
  }

  const todayCtn = createCtn("today");
  var todayStr = new Date().toString().slice(0, 10);
  todayCtn.title.innerHTML = `<span>Today</span><small>${todayStr}</small>`;
  todayCtn.actionCtn = todayCtn.createActionCtn();
  todayCtn.headerContent.ctn.appendChild(todayCtn.actionCtn);
  todayCtn.sortedBtn = todayCtn.createIconBtn("flaticon", "sorted-btn", "");
  todayCtn.sortedBtn.classList.add("inactive");
  todayCtn.sortedBtnIcon = todayCtn.sortedBtn.querySelector(".flaticon");
  todayCtn.sortedBtnText = todayCtn.sortedBtn.querySelector(".btn-text");
  todayCtn.sortBtn = todayCtn.createIconBtn(
    "flaticon-sort",
    "sort-btn",
    "Sort"
  );
  todayCtn.actionCtn.appendChild(todayCtn.sortedBtn);
  todayCtn.actionCtn.appendChild(todayCtn.sortBtn);
  todayCtn.todoBtn = todayCtn.createNewTodoBtn();
  todayCtn.todoList = todayCtn.createTodoList();
  todayCtn.todoList.appendChild(todayCtn.todoBtn);
  todayCtn.main.appendChild(todayCtn.todoList);

  const upcomingCtn = createCtn("upcoming");
  upcomingCtn.title.textContent = "Upcoming";
  upcomingCtn.listHolder = document.createElement("div");
  upcomingCtn.sections = [];
  upcomingCtn.createSections = (number) => {
    for (var i = 1; i < number; i++) {
      var ctn = document.createElement("section");

      var header = upcomingCtn.createHeader();
      header.setAttribute("class", "section-header section-content");
      var headerContent = upcomingCtn.createHeaderContent("h2");
      headerContent.ctn.setAttribute("class", "section-header-content");

      var title = headerContent.title;

      header.appendChild(headerContent.ctn);

      var todoList = document.createElement("ul");
      todoList.classList.add("todo-list");

      var todoBtn = upcomingCtn.createNewTodoBtn();
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
  pjCtn.actionCtn = pjCtn.createActionCtn();
  pjCtn.headerContent.ctn.appendChild(pjCtn.actionCtn);
  pjCtn.sortedBtn = pjCtn.createIconBtn("flaticon", "sorted-btn", "");
  pjCtn.sortedBtn.classList.add("inactive");
  pjCtn.sortedBtnIcon = pjCtn.sortedBtn.querySelector(".flaticon");
  pjCtn.sortedBtnText = pjCtn.sortedBtn.querySelector(".btn-text");
  pjCtn.sortBtn = pjCtn.createIconBtn("flaticon-sort", "sort-btn", "Sort");
  pjCtn.commentBtn = pjCtn.createIconBtn(
    "flaticon-comment",
    "comment-btn",
    "Comments"
  );
  pjCtn.deleteBtn = pjCtn.createIconBtn(
    "flaticon-trash",
    "delete-btn",
    "Delete"
  );
  pjCtn.actionCtn.appendChild(pjCtn.sortedBtn);
  pjCtn.actionCtn.appendChild(pjCtn.sortBtn);
  pjCtn.actionCtn.appendChild(pjCtn.commentBtn);
  pjCtn.actionCtn.appendChild(pjCtn.deleteBtn);
  pjCtn.todoList = pjCtn.createTodoList();
  pjCtn.todoBtn = pjCtn.createNewTodoBtn();
  pjCtn.todoList.appendChild(pjCtn.todoBtn);
  pjCtn.main.appendChild(pjCtn.todoList);

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

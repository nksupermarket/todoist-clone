export { content };
import { helpers } from "./helpers.js";

const content = (() => {
  var main = document.getElementById("content");
  var todoForm = (function createTodoForm() {
    var ctn = document.createElement("form");
    ctn.classList.add("todo-editor", "new-todo-form");

    var editorArea = document.createElement("div");
    editorArea.classList.add("editor-area");

    var titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");

    var extraDetails = document.createElement("div");
    extraDetails.classList.add("editor-extra-details");

    var lhCtn = document.createElement("div");
    lhCtn.classList.add("lh-ctn");

    var dateInput = document.createElement("input");
    (function createDayBtn() {
      var dayBtn = document.createElement("button");
      dayBtn.setAttribute("type", "button");
      dayBtn.classList.add("day-btn", "btn");
      dateInput.setAttribute("type", "date");
      dayBtn.appendChild(dateInput);
      lhCtn.appendChild(dayBtn);
    })();

    var pjInput = document.createElement("select");
    (function createPjBtn() {
      var pjBtn = document.createElement("button");
      pjBtn.setAttribute("type", "button");
      pjBtn.classList.add("btn", "editor-pj-btn");

      var icon = document.createElement("i");
      icon.classList.add("flaticon", "flaticon-folder");

      var noneOption = document.createElement("option");
      noneOption.value = "None";
      noneOption.textContent = "None";
      pjInput.appendChild(noneOption);

      pjBtn.appendChild(icon);
      pjBtn.appendChild(pjInput);
      lhCtn.appendChild(pjBtn);
    })();

    var rhCtn = document.createElement("div");
    rhCtn.classList.add("rh-ctn");

    var priorityBtn = (function createPriorityBtn() {
      var btn = document.createElement("button");
      btn.dataset.id = `content-form`;
      btn.setAttribute("type", "button");
      btn.classList.add("btn", "icon-btn", "priority-btn");
      var icon = document.createElement("i");
      icon.classList.add("flaticon", "flaticon-flag");
      btn.appendChild(icon);

      rhCtn.appendChild(btn);
      return btn;
    })();
    var commentBtn = (function createCommentBtn() {
      var btn = document.createElement("button");
      btn.dataset.id = `content-form`;
      btn.setAttribute("type", "button");
      btn.classList.add("btn", "icon-btn", "comment-btn");
      var icon = document.createElement("i");
      icon.classList.add("flaticon", "flaticon-comment");
      btn.appendChild(icon);

      rhCtn.appendChild(btn);
      return btn;
    })();

    var editorActions = document.createElement("div");
    editorActions.classList.add("editor-actions");

    var addBtn = (function createAddBtn() {
      var btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.classList.add("btn", "act-btn", "add-todo-btn");
      btn.textContent = "Add";

      editorActions.appendChild(btn);
      return btn;
    })();
    var cancelBtn = (function createCancelBtn() {
      var btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.classList.add("btn", "act-btn", "cancel-btn");
      btn.textContent = "Cancel";

      editorActions.appendChild(btn);
      return btn;
    })();

    extraDetails.appendChild(lhCtn);
    extraDetails.appendChild(rhCtn);

    editorArea.appendChild(titleInput);
    editorArea.appendChild(extraDetails);

    ctn.appendChild(editorArea);
    ctn.appendChild(editorActions);

    return {
      ctn,
      titleInput,
      dateInput,
      pjInput,
      priorityBtn,
      commentBtn,
      addBtn,
      cancelBtn,
    };
  })();

  const ctnMethods = {
    hideSortedBtn() {
      if (!this.sortedBtn) return;
      helpers.hide(this.sortedBtn);
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
      this.todoArray.forEach((todo) => todo.ctn.remove());
      this.todoArray.forEach((todo) => this.todoList.appendChild(todo.ctn));
      this.todoBtn.remove();
      this.todoList.appendChild(this.todoBtn);
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
    ctn.main.id = `${name}-ctn`;

    ctn.header = ctn.createHeader();
    ctn.headerContent = ctn.createHeaderContent("h1");
    ctn.header.appendChild(ctn.headerContent.ctn);
    ctn.title = ctn.headerContent.title;

    ctn.main.appendChild(ctn.header);

    ctn.todoArray = [];

    return ctn;
  }

  const todayCtn = createCtn("today");
  var todayStr = new Date().toString().slice(0, 10);
  todayCtn.title.innerHTML = `<span>Today</span><small>${todayStr}</small>`;
  todayCtn.todoBtn = todayCtn.createNewTodoBtn();
  todayCtn.todoList = todayCtn.createTodoList();
  todayCtn.todoList.appendChild(todayCtn.todoBtn);
  todayCtn.main.appendChild(todayCtn.todoList);

  const upcomingCtn = createCtn("upcoming");
  upcomingCtn.title.textContent = "Upcoming";
  upcomingCtn.listHolder = document.createElement("div");
  upcomingCtn.sections = [];
  upcomingCtn.generateSections = (number) => {
    for (var i = 1; i < number; i++) {
      var ctn = document.createElement("section");

      var header = upcomingCtn.createHeader();
      var headerContent = upcomingCtn.createHeaderContent("h2");
      headerContent.ctn.classList.add("section-header");

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
  upcomingCtn.generateSections(8);
  upcomingCtn.main.appendChild(upcomingCtn.listHolder);

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
    main,
    todoForm,
    pjCtn,
    todayCtn,
    upcomingCtn,
    findActiveCtn() {
      var ctns = [todayCtn, pjCtn, upcomingCtn];
      var activeCtn = ctns.find((ctn) => this.main.contains(ctn.main));
      return activeCtn;
    },
    removeActiveCtn() {
      var activeCtn = this.findActiveCtn();
      if (!activeCtn) return;
      activeCtn.main.remove();
      activeCtn.hideSortedBtn();
    },
    removeTodos(ctn) {
      var todoCtns = ctn.querySelectorAll(".todo-ctn");
      if (!todoCtns[0]) return;
      todoCtns.forEach((todo) => todo.remove());
    },
  };
})();

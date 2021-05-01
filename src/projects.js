export { pjFactory, todoFactory };

function pjFactory() {
  this.id = 1;
}
pjFactory.prototype.createProject = function (title) {
  var todoList = [];
  return {
    id: this.id++,
    title,
    todoList,
    addToForm() {
      var newTodoForm = document.getElementById("new-todo-form");
      var pjSelect = newTodoForm.querySelector("select");

      var pjOption = document.createElement("option");
      pjOption.textContent = this.title;
      pjOption.value = this.id;

      pjSelect.appendChild(pjOption);
    },
    addToMenu() {
      var pjLink = document.createElement("li");
      pjLink.classList.add("pj-list-item", "btn");
      pjLink.textContent = title;
      pjLink.id = this.id;
      var pjMenu = document.querySelector("#pj-list");
      pjMenu.appendChild(pjLink);
      return pjLink;
    },
    del() {},
    editTitle(str) {
      this.title = str;
    },
  };
};

function todoFactory() {
  this.id = 1;
}
todoFactory.prototype.createTodo = function (
  project,
  title,
  day,
  priority,
  notes
) {
  var ctn = (function createContent() {
    var todoSection = document.createElement("article");
    todoSection.classList.add("todo-ctn", "inactive");
    var todoTitle = document.createElement("p");
    todoTitle.classList.add("todo-title");
    todoTitle.textContent = title;
    var todoDay = document.createElement("p");
    todoDay.classList.add("todo-day");
    todoDay.textContent = day;

    var todoActions = document.createElement("div");
    todoActions.classList.add("todo-actions");
    var editBtn = createBtn("edit", "pen");
    var notesBtn = createBtn("notes", "comment");
    var moreBtn = createBtn("more", "more-1");
    function createBtn(name, icon) {
      var btn = document.createElement("button");
      btn.classList.add(`${name}-btn`, "btn");
      var btnIcon = document.createElement("i");
      btnIcon.classList.add("flaticon", `flaticon-${icon}`);
      btn.appendChild(btnIcon);
      todoActions.appendChild(btn);
      return btn;
    }

    todoSection.appendChild(todoTitle);
    todoSection.appendChild(todoDay);
    todoSection.appendChild(todoActions);

    var todoList = document.querySelector("#todo-list");
    todoList.appendChild(todoSection);

    return todoSection;
  })();
  return {
    id: this.id++,
    project,
    title,
    day,
    priority,
    notes,
    ctn,
    pushToProject(pj) {
      pj.todoList.push(this);
    },
    del() {},
    editTitle(str) {
      this.title = str;
      return this;
    },
    editDesc(str) {
      this.description = str;
      return this;
    },
    editDay(date) {
      this.day = date;
      return this;
    },
    editPriorirty(str) {
      this.priority = str;
      return this;
    },
  };
};

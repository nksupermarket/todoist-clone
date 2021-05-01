export { createProject, createTodo };

const createProject = (title) => {
  var taskList = [];

  return {
    title,
    taskList,
    del() {},
    editTitle(str) {
      this.title = str;
    },
    addToMenu() {
      var pjLink = document.createElement("li");
      pjLink.classList.add("pj-list-item");
      pjLink.textContent = this.title;

      var pjMenu = document.querySelector("#pj-list");
      pjMenu.appendChild(pjLink);
    },
  };
};

const createTodo = (project, title, description, notes, day, priority) => ({
  project,
  title,
  description,
  notes,
  day,
  priority,
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
  pushToProject() {
    this.project.taskList.push(this);
  },
});

const newPj = createProject({
  title: "hello",
  description: "first project",
  deadline: "january first",
  priority: "urgent",
});

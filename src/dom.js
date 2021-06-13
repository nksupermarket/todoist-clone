import { helpers } from "./helpers.js";
import { listOfPjs, pjFact, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
import { commentModal } from "./comments.js";
import { menu } from "./menu.js";
import { content } from "./content.js";
import { todoForm } from "./todoForm.js";
import { samples } from "./samples.js";
import { popups } from "./popups.js";
import { header } from "./header.js";

const modalForm = todoForm.modalForm;
const headerEvents = {
  showModalTodoForm() {
    helpers.show(modalForm.ctn);
    popups.priority.reset();
    todoFormEvents.fillPjInput(modalForm);
    modalForm.setDefaultDate();
  },
};
header.todoBtn.addEventListener("click", headerEvents.showModalTodoForm);

const menuEvents = {
  showPjForm() {
    helpers.show(menu.form);
  },
  hidePjForm() {
    helpers.hide(menu.form);
    menu.form.reset();
  },
  onAddPj() {
    if (!menu.titleInput.value) return helpers.inputError("empty");
    var newPj = pjFact.createProject(menu.titleInput.value);
    newPj.pushToList();
    newPj.addToMenu().addEventListener("click", (e) => showPj(e));
    hidePjForm();
  },
  showToday() {
    if (content.findActiveCtn() !== undefined)
      content.removeActiveCtn().removeTodos();
    var todayList = today.getTodayTodos(listOfTodos);
    var fragment = document.createDocumentFragment();
    todayList.forEach((todo) => {
      fragment.prepend(todo.ctn);
    });
    content.todayCtn.todoList.prepend(fragment);
    content.todayCtn.todoArray = todayList;
    content.main.appendChild(content.todayCtn.main);
  },
  showUpcoming() {
    content.removeActiveCtn().removeTodos();
    fillSections();
    function fillSections() {
      var dateObj = new Date();
      for (var i = 0; i < content.upcomingCtn.sections.length; i++) {
        i === 0 ? null : dateObj.setDate(dateObj.getDate() + 1);
        setTitle(i);
        setTodoList(i);

        function setTitle(i) {
          content.upcomingCtn.sections[i].title.textContent = dateObj
            .toString()
            .slice(0, 10);
          (function setTodayStr() {
            if (i === 0)
              content.upcomingCtn.sections[i].title.textContent =
                "Today — ".concat(
                  content.upcomingCtn.sections[i].title.textContent
                );
          })();
          (function setTomorrowStr() {
            if (i === 1)
              content.upcomingCtn.sections[i].title.textContent =
                "Tomorrow — ".concat(
                  content.upcomingCtn.sections[i].title.textContent
                );
          })();
        }
        function setTodoList(i) {
          const dayStr = (function getDayStr() {
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth() + 1;
            var day = dateObj.getDate();
            if (month.toString().length === 1)
              month = "0".concat(month.toString());
            if (day.toString().length === 1) day = "0".concat(day.toString());
            return `${year}-${month}-${day}`;
          })();

          var todos = listOfTodos.filter((item) => item.day === dayStr);
          if (todos.length === 0)
            return content.upcomingCtn.sections[i].title.classList.add("empty");
          var fragment = document.createDocumentFragment();
          todos.forEach((todo) => fragment.prepend(todo.ctn));
          content.upcomingCtn.sections[i].todoList.prepend(fragment);
        }
      }
    }
    content.main.appendChild(content.upcomingCtn.main);
  },
  showPj(e) {
    var pjId = e.target.dataset.project;
    (function closeOpenCtn() {
      contentEvents.closeTodoForm();
      content.removeActiveCtn().removeTodos();
    })();
    (function setDatatset() {
      content.pjCtn.main.dataset.project = pjId;
      var pjCtnBtns = content.pjCtn.header.querySelectorAll("button");
      pjCtnBtns.forEach((btn) => (btn.dataset.pj = `${pjId}`));
    })();

    var pj = helpers.findItem(listOfPjs, pjId);
    content.pjCtn.title.textContent = pj.title;

    (function populateList() {
      let fragment = document.createDocumentFragment();
      pj.todoList.forEach((todo) => {
        helpers.show(todo.ctn);
        fragment.prepend(todo.ctn);
      });
      content.pjCtn.todoList.prepend(fragment);
      content.pjCtn.todoArray = pj.todoList;
    })();

    content.main.appendChild(content.pjCtn.main);
  },
};
menu.today.addEventListener("click", menuEvents.showToday);
menu.upcoming.addEventListener("click", menuEvents.showUpcoming);
menu.newBtn.addEventListener("click", menuEvents.showPjForm);
menu.addBtn.addEventListener("click", menuEvents.onAddPj);
menu.cancelBtn.addEventListener("click", menuEvents.hidePjForm);

commentModal.form.addEventListener("click", (e) => {
  e.stopPropagation();
});
commentModal.modal.addEventListener("click", commentModal.close);
commentModal.closeBtn.addEventListener("click", commentModal.close);

const todoFormEvents = {
  fillPjInput(form) {
    var options = form.pjInput.querySelectorAll("option");
    options.forEach((option) => {
      if (option.textContent === "None") return;
      option.remove();
    });
    listOfPjs.forEach((pj) => pj.addToForm(form.pjInput));
  },
  onIconBtn(popup, btn) {
    popup.setDataBtn(btn.dataset.id);
    popup.show();
    popup.position(btn);
  },
  onAddTodo(form) {
    var priority = popups.priority.ctn.querySelector(".active").dataset.value;
    var notes = { text: [], date: [] };
    (function addNotes() {
      if (!popups.comment.textarea.value) return;
      notes.text[0] = popups.comment.textarea.value;
      notes.date[0] = today.getToday();
    })();
    var newTodo = todoFact.createTodo(
      form.pjInput.value,
      form.titleInput.value,
      form.dateInput.value,
      priority,
      notes
    );
    addTodoCtnEvents(newTodo);
    newTodo.pushToList();
    newTodo.appendContent();
    if (form.pjInput.value != "None") newTodo.pushToProject();

    todoForm.hide();
    contentEvents.closeTodoForm();

    var activeCtn = content.findActiveCtn();
    activeCtn.refresh();
  },
  close(form) {
    form.hide();
    popups.hide();
    popups.comment.reset();
  },
  onSelectPriorityLevel(e) {
    var btn = e.target.closest(".btn");
    popups.priority.setActive(btn.dataset.value);

    (function () {
      const icon = btn.querySelector("i");
      const activeForm = todoForm.findActiveForm();
      activeForm.changeFlagIcon(icon.style.color, btn.dataset.value);
    })();
  },
  addTodoCtnEvents(todo) {
    var dayInput = todo.content.main.querySelector(".day-btn");
    dayInput.addEventListener("change", changeTodoDay);
    function changeTodoDay() {
      todo.day = dayInput.value;
    }

    var commentsBtn = todo.content.main.querySelectorAll(".notes-btn");
    commentsBtn.forEach((btn) =>
      btn.addEventListener("click", showCommentForm)
    );
    function showCommentForm() {
      helpers.show(commentModal.modal);
      var pj = helpers.findItem(listOfPjs, todo.project);
      commentModal.attachTodoId(todo.id);
      commentModal.changePjTitle(pj.title);
      commentModal.changeTodoTitle(todo.title);
      if (!todo.notes) return;
      for (var i = 0; i < todo.notes.text.length; i++) {
        commentModal.fillCommentList(todo.notes.text[i], todo.notes.date[i]);
      }
    }

    var editBtn = todo.content.main.querySelector(".edit-btn");
    editBtn.addEventListener("click", showEditor);
    function showEditor() {
      contentEvents.closeOpenEditors();
      editorForm.setDataset(todo.id);
      (function addPjOptions() {
        todoFormEvents.fillPjInput(editorForm);
      })();
      (function setDefaultOption() {
        var options = editorForm.pjInput.querySelectorAll("option");
        var defaultOption = Array.from(options).find((option) => {
          return option.value.toString() === todo.project.toString();
        });
        defaultOption.setAttribute("selected", "selected");
      })();
      todo.appendEditor(editorForm);
      helpers.show(editorForm.ctn);
    }
  },
};
const contentForm = todoForm.contentForm;
modalForm.titleInput.addEventListener("input", () => {
  modalForm.changeAddBtn();
});
contentForm.titleInput.addEventListener("input", () => {
  contentForm.changeAddBtn();
});
modalForm.addBtn.addEventListener("click", () => {
  () => todoFormEvents.onAddTodo(modalForm);
});
modalForm.form.addEventListener("click", function (e) {
  e.stopPropagation();
});
popups.modal.addEventListener("click", popups.hide);
const priorityPopup = popups.priority;
priorityPopup.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
const commentPopup = popups.comment;
commentPopup.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
modalForm.ctn.addEventListener("click", () => todoFormEvents.close(modalForm));
modalForm.cancelBtn.addEventListener("click", () =>
  todoFormEvents.close(modalForm)
);
modalForm.commentBtn.addEventListener("click", () =>
  todoFormEvents.onIconBtn(popups.comment, todoForm.modalForm.commentBtn)
);
modalForm.priorityBtn.addEventListener("click", () =>
  todoFormEvents.onIconBtn(popups.priority, modalForm.priorityBtn)
);
contentForm.addBtn.addEventListener("click", () =>
  todoFormEvents.onAddTodo(contentForm)
);
contentForm.cancelBtn.addEventListener("click", () =>
  contentEvents.closeTodoForm(content.pjCtn)
);
contentForm.priorityBtn.addEventListener("click", () => {
  todoFormEvents.onIconBtn(popups.priority, contentForm.priorityBtn);
});
contentForm.commentBtn.addEventListener("click", () =>
  todoFormEvents.onIconBtn(popups.comment, contentForm.commentBtn)
);
const editorForm = todoForm.editor;
editorForm.priorityBtn.addEventListener("click", function showPriorityPopup() {
  popups.priority.show();
  popups.priority.setDataBtn(`${editorForm.priorityBtn.dataset.id}`);
  popups.priority.position(editorForm.priorityBtn);
  (function setDefaultPriority() {
    var todo = helpers.findItem(listOfTodos, editorForm.ctn.dataset.id);
    popups.priority.setActive(todo.priority);
  })();
});

editorForm.saveBtn.addEventListener("click", () => {
  var todo = helpers.findItem(listOfTodos, editorForm.ctn.dataset.id);
  var prioritySelected = priorityPopup.ctn.querySelector(".active");
  todo.saveEdits(editorForm, prioritySelected);
  todo.content.refresh();
  editorForm.ctn.remove();
  helpers.hide(editorForm.ctn);
  todo.appendContent();
});

editorForm.cancelBtn.addEventListener("click", () => {
  editorForm.ctn.remove();
  helpers.hide(editorForm.ctn);
  var todo = helpers.findItem(listOfTodos, editorForm.ctn.dataset.id);
  todo.appendContent();
});

const popupEvents = {
  onDelete() {
    //find pj
    //pj.del()
    //display today
  },
};

commentPopup.textarea.oninput = () => {
  commentPopup.textarea.value
    ? todoForm.findActiveForm().changeCommentBtn("not empty")
    : todoForm.findActiveForm().changeCommentBtn("empty");
};
commentPopup.closeBtn.addEventListener("click", popups.hide);
window.onresize = function movePopups() {
  var activePopup = popups.findActivePopup();
  if (!activePopup) return;
  var btn = document.querySelector(
    `[data-id = "${activePopup.ctn.dataset.btn}"]`
  );
  activePopup.position(btn);
};
priorityPopup.btns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    todoFormEvents.onSelectPriorityLevel(e);
  })
);
const deletePopup = popups.del;
deletePopup.ctn.addEventListener("click", (e) => e.stopPropagation());
deletePopup.cancelBtn.addEventListener("click", popups.hide);

const contentEvents = {
  showSortPopup() {
    const activeCtn = content.findActiveCtn();
    popups.sort.setDataBtn(activeCtn.sortBtn.dataset.id);
    popups.sort.show();
    popups.sort.position(activeCtn.sortBtn);
  },
  onSort(method) {
    var activeCtn = content.findActiveCtn();
    helpers.show(activeCtn.sortedBtn);

    switch (method) {
      case "date":
        activeCtn.sortedBtnText.textContent = "Sorted by due date";
        activeCtn.sortedBtnIcon.setAttribute(
          "class",
          "flaticon flaticon-down-arrow-1"
        );
        activeCtn.sortDate();
        break;
      case "priority":
        activeCtn.sortedBtnText.textContent = "Sorted by priority";
        activeCtn.sortedBtnIcon.setAttribute(
          "class",
          "flaticon flaticon-down-arrow-1"
        );
        activeCtn.sortPriority();
        break;
      case "alphabet":
        activeCtn.sortedBtnText.textContent = "Sorted alphabetically";
        activeCtn.sortedBtnIcon.setAttribute(
          "class",
          "flaticon flaticon-down-arrow-1"
        );
        activeCtn.sortAlphabetically();
        break;
      case "reverse":
        activeCtn.sortedBtnIcon.classList.contains("flaticon-up-arrow")
          ? activeCtn.sortedBtnIcon.setAttribute(
              "class",
              "flaticon flaticon-down-arrow-1"
            )
          : activeCtn.sortedBtnIcon.setAttribute(
              "class",
              "flaticon flaticon-up-arrow"
            );
        activeCtn.sortReverse();
    }
    activeCtn.refresh();
  },
  showDeletePopup() {
    popups.del.show();
    popups.toggleModalFull();
  },
  showTodoForm(ctn) {
    contentEvents.closeOpenEditors();
    todoFormEvents.fillPjInput(contentForm);
    contentForm.setDefaultDate();
    ctn.todoList.appendChild(contentForm.ctn);
    helpers.show(contentForm.ctn);
    ctn.todoBtn.remove();
  },
  closeTodoForm() {
    var activeCtn = content.findActiveCtn();
    if (!activeCtn) return;
    contentForm.hide();
    if (activeCtn === content.upcomingCtn)
      return content.upcomingCtn.sections.forEach((section) =>
        section.todoList.appendChild(section.todoBtn)
      );
    activeCtn.todoList.appendChild(activeCtn.todoBtn);
  },
  setDefaultPjForTodoForm() {
    var defaultPj = contentForm.pjInput.querySelector(
      `[value="${content.pjCtn.main.dataset.project}"]`
    );
    defaultPj.setAttribute("selected", "selected");
  },
  closeOpenEditors() {
    var openEditor = document.querySelector(".todo-editor:not(.inactive)");
    if (!openEditor) return;
    if (openEditor.classList.contains("new-todo-form")) {
      var activeCtn = content.findActiveCtn();
      contentEvents.closeTodoForm(activeCtn);
      return;
    }
    if (!openEditor.dataset.id) return;
    var openTodo = helpers.findItem(listOfTodos, openEditor.dataset.id);
    var prioritySelected = priorityPopup.ctn.querySelector(".active");
    openTodo.saveEdits(editorForm, prioritySelected);
    openTodo.content.refresh();
    openTodo.appendContent();

    editorForm.ctn.remove();
    helpers.hide(editorForm.ctn);
  },
};
const pjCtn = content.pjCtn;
pjCtn.todoBtn.addEventListener("click", () => {
  contentEvents.showTodoForm(pjCtn);
  contentEvents.setDefaultPjForTodoForm();
});
const todayCtn = content.todayCtn;
todayCtn.todoBtn.addEventListener("click", () => {
  contentEvents.showTodoForm(content.todayCtn);
});
const upcomingCtn = content.upcomingCtn;
upcomingCtn.sections.forEach((section) => {
  section.todoBtn.addEventListener("click", () => {
    contentEvents.showTodoForm(section);
    upcomingCtn.sections.forEach((section) => {
      section.todoBtn.remove();
    });
  });
});
pjCtn.sortBtn.addEventListener("click", contentEvents.showSortPopup);
pjCtn.deleteBtn.addEventListener("click", contentEvents.showDeletePopup);
todayCtn.sortBtn.addEventListener("click", contentEvents.showSortPopup);
popups.sort.dateBtn.addEventListener("click", () =>
  contentEvents.onSort("date")
);
popups.sort.priorityBtn.addEventListener("click", () =>
  contentEvents.onSort("priority")
);
popups.sort.alphabetBtn.addEventListener("click", () =>
  contentEvents.onSort("alphabet")
);
pjCtn.sortedBtn.addEventListener("click", () =>
  contentEvents.onSort("reverse")
);
todayCtn.sortedBtn.addEventListener("click", () =>
  contentEvents.onSort("reverse")
);

const init = (() => {
  var pjWork = pjFact.createProject("Work");
  var pjHome = pjFact.createProject("Home");
  var pjCode = pjFact.createProject("Code");

  pjWork.pushToList();
  pjHome.pushToList();
  pjCode.pushToList();

  samples.generate(50);
  listOfTodos.forEach((todo) => todoFormEvents.addTodoCtnEvents(todo));
  (function displayPjs() {
    listOfPjs.forEach((pj) => {
      pj.menuItem.addEventListener("click", (e) => menuEvents.showPj(e));
    });
  })();
  menuEvents.showToday();
})();

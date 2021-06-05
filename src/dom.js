import { helpers } from "./helpers.js";
import { listOfPjs, pjFact, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
import { commentModal } from "./comments.js";
import { menu } from "./menu.js";
import { content } from "./content.js";
import { todoForm } from "./todoForm.js";
import { samples } from "./samples.js";
import { popups } from "./popups.js";

var pjWork = pjFact.createProject("Work");
var pjHome = pjFact.createProject("Home");
var pjCode = pjFact.createProject("Code");

var fdlkaTodo = todoFact.createTodo(pjWork.id, "fdlka", "2021-06-01", "4", {
  text: [],
  date: [],
});
pjWork.pushToList();
pjHome.pushToList();
pjCode.pushToList();

const init = (() => {
  samples.generate(30);
  listOfTodos.forEach((todo) => addTodoCtnEvents(todo));
  (function displayPjs() {
    listOfPjs.forEach((pj) => {
      pj.addToMenu().addEventListener("click", (e) => menuEvents.showPj(e));
    });
  })();
})();
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
    displayToday();
    function displayToday() {
      content.removeActiveCtn();
      content.removeTodos(content.todayCtn.main);
      var todayList = today.getTodayTodos(listOfTodos);
      todayList.forEach((todo) => {
        content.todayCtn.todoList.prepend(todo.ctn);
      });
      content.todayCtn.todoArray = todayList;
      content.main.appendChild(content.todayCtn.main);
    }
  },
  showUpcoming() {
    displayUpcoming();
    function displayUpcoming() {
      content.removeActiveCtn();
      content.removeTodos(content.upcomingCtn.main);
      fillSections();
      function fillSections() {
        var dateObj = new Date();
        for (var i = 0; i < content.upcomingCtn.sections.length; i++) {
          dateObj.setDate(dateObj.getDate() + i);
          setTitle(i);
          setTodoList(i);

          function setTitle(i) {
            content.upcomingCtn.sections[i].title.textContent = dateObj
              .toString()
              .slice(0, 10);
            if (i === 0)
              content.upcomingCtn.sections[i].title.textContent =
                "Today — ".concat(
                  content.upcomingCtn.sections[i].title.textContent
                );
            if (i === 1)
              content.upcomingCtn.sections[i].title.textContent =
                "Tomorrow — ".concat(
                  content.upcomingCtn.sections[i].title.textContent
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
              return content.upcomingCtn.sections[i].title.classList.add(
                "empty"
              );
            todos.forEach((todo) =>
              content.upcomingCtn.sections[i].todoList.prepend(todo.ctn)
            );
          }
        }
      }
      content.main.appendChild(content.upcomingCtn.main);
    }
  },
  showPj(e) {
    var pjId = e.target.dataset.project;
    (function closeOpenCtn() {
      contentEvents.closeForm();
      content.removeTodos(content.pjCtn.todoList);
      content.removeActiveCtn();
    })();
    (function setDatatset() {
      content.pjCtn.main.dataset.project = pjId;
      var pjCtnBtns = content.pjCtn.header.querySelectorAll("button");
      pjCtnBtns.forEach((btn) => (btn.dataset.ctn = `pjCtn-${pjId}`));
    })();

    var pj = helpers.findItem(listOfPjs, pjId);
    content.pjCtn.title.textContent = pj.title;

    (function populateList() {
      pj.todoList.forEach((todo) => {
        helpers.show(todo.ctn);
        content.pjCtn.todoList.prepend(todo.ctn);
      });
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

const todoPopupEvents = {
  showForm() {
    helpers.show(todoForm.modal);
    popups.priority.reset();
    todoPopupEvents.fillPjInput(todoForm);
    todoForm.setDefaultDate();
  },
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
    contentEvents.closeForm();

    var activeCtn = content.findActiveCtn();
    activeCtn.refresh();
  },
  close() {
    todoForm.hide();
    popups.hide();
    popups.comment.reset();
  },
};
todoForm.newTodoBtns.forEach((btn) =>
  btn.addEventListener("click", todoPopupEvents.showForm)
);
todoForm.addBtn.addEventListener("click", () => {
  () => todoPopupEvents.onAddTodo(todoForm);
});
todoForm.form.addEventListener("click", function (e) {
  e.stopPropagation();
});
popups.modal.addEventListener("click", popups.hide);
popups.priority.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
popups.comment.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
todoForm.modal.addEventListener("click", () => {
  todoPopupEvents.close;
});
todoForm.cancelBtn.addEventListener("click", todoPopupEvents.close);
todoForm.commentBtn.addEventListener("click", () =>
  todoPopupEvents.onIconBtn(popups.comment, todoForm.commentBtn)
);
todoForm.priorityBtn.addEventListener("click", () =>
  todoPopupEvents.onIconBtn(popups.priority, todoForm.priorityBtn)
);
popups.comment.textarea.oninput = () => {
  popups.comment.textarea.value
    ? todoForm.changeCommentBtn("not empty")
    : todoForm.changeCommentBtn("empty");
};
popups.comment.closeBtn.addEventListener("click", popups.hide);
window.onresize = function movePopups() {
  var activePopup = findActivePopup();
  if (!activePopup) return;
  var btn = document.querySelector(
    `[data-id = "${activePopup.ctn.dataset.btn}"]`
  );
  activePopup.position(btn);

  function findActivePopup() {
    var ctn = document.querySelector(".active.popup-popup");
    var activePopup = Object.keys(popups).find(
      (key) => popups[key].ctn === ctn
    );
    return popups[activePopup];
  }
};
popups.priority.btns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    popups.priority.onSelect(e);
  })
);
todoForm.titleInput.oninput = todoForm.activateAddBtn;

const contentEvents = {
  showSortPopup() {
    popups.sort.setDataBtn(content.pjCtn.sortBtn.dataset.id);
    popups.sort.show();
    popups.sort.position(content.pjCtn.sortBtn);
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
  showForm(ctn) {
    todoPopupEvents.fillPjInput(content.todoForm);
    content.todoForm.dateInput.value = today.getToday();
    ctn.todoList.appendChild(content.todoForm.ctn);
    ctn.todoBtn.remove();
  },
  closeForm() {
    var activeCtn = content.findActiveCtn();
    if (!activeCtn) return;
    if (activeCtn === content.upcomingCtn)
      return content.upcomingCtn.sections.forEach((section) =>
        section.todoList.appendChild(section.todoBtn)
      );
    content.todoForm.ctn.remove();
    activeCtn.todoList.appendChild(activeCtn.todoBtn);
  },
  setDefaultPj() {
    var defaultPj = content.todoForm.pjInput.querySelector(
      `[value="${content.pjCtn.main.dataset.project}"]`
    );

    defaultPj.setAttribute("selected", "selected");
  },
};
content.pjCtn.todoBtn.addEventListener("click", () => {
  contentEvents.showForm(content.pjCtn);
  contentEvents.setDefaultPj();
});
content.todayCtn.todoBtn.addEventListener("click", () => {
  contentEvents.showForm(content.todayCtn);
});
content.upcomingCtn.sections.forEach((section) => {
  section.todoBtn.addEventListener("click", () => {
    contentEvents.showForm(section);
    content.upcomingCtn.sections.forEach((section) => {
      section.todoBtn.remove();
    });
  });
});
content.pjCtn.sortBtn.addEventListener("click", contentEvents.showSortPopup);
popups.sort.dateBtn.addEventListener("click", () => onSort("date"));
popups.sort.priorityBtn.addEventListener("click", () => onSort("priority"));
popups.sort.alphabetBtn.addEventListener("click", () => onSort("alphabet"));
content.pjCtn.sortedBtn.addEventListener("click", () => onSort("reverse"));
content.todoForm.addBtn.addEventListener("click", () =>
  todoPopupEvents.onAddTodo(content.todoForm)
);
content.todoForm.cancelBtn.addEventListener("click", () =>
  contentEvents.closeForm(content.pjCtn)
);
content.todoForm.priorityBtn.addEventListener("click", () => {
  todoPopupEvents.onIconBtn(popups.priority, content.todoForm.priorityBtn);
});
content.todoForm.commentBtn.addEventListener("click", () =>
  todoPopupEvents.onIconBtn(popups.comment, content.todoForm.commentBtn)
);

function onSelectPriorityLevel(e) {
  this.removeActive();
  var btn = e.target.closest(".btn");
  var icon = btn.querySelector(".flaticon");
  btn.dataset.selected = "true";
  btn.classList.add("active");
  if (todoForm.formModal.classList.contains("inactive")) return;
  todoForm.changeFlagIcon(icon.style.color, btn.dataset.value);
}
function addTodoCtnEvents(todo) {
  var dayInput = todo.content.main.querySelector(".day-btn");
  dayInput.addEventListener("change", changeTodoDay);
  function changeTodoDay() {
    todo.day = dayInput.value;
  }

  var commentsBtn = todo.content.main.querySelectorAll(".notes-btn");
  commentsBtn.forEach((btn) => btn.addEventListener("click", showCommentForm));
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
    closeOtherEditors();
    (function addPjOptions() {
      var select = todo.editor.main.querySelector("select");
      listOfPjs.forEach((pj) => pj.addToForm(select));
    })();
    (function setDefaultOption() {
      var options = todo.editor.main.querySelectorAll("option");
      var defaultOption = Array.from(options).find((option) => {
        return option.value.toString() === todo.project.toString();
      });
      defaultOption.setAttribute("selected", "selected");
    })();
    todo.appendEditor();

    function closeOtherEditors() {
      var openEditor = document.querySelector(".todo-editor");
      if (!openEditor) return;
      if (openEditor.classList.contains("new-todo-form")) {
        var activeCtn = content.findActiveCtn();
        return contentEvents.closeForm(activeCtn);
      }
      var openTodo = helpers.findItem(listOfTodos, openEditor.dataset.todo);

      openTodo.saveEdits();
      openTodo.content.refresh();
      openTodo.appendContent();
    }
  }

  var priorityBtn = todo.editor.main.querySelector(".priority-btn");
  priorityBtn.addEventListener("click", showPriorityPopup);
  function showPriorityPopup() {
    popups.priority.show();
    popups.priority.setDataBtn(`priority-${todo.id}`);
    popups.priority.position(priorityBtn);
    (function setDefaultPriority() {
      popups.priority.setActive(todo.priority);
    })();
  }

  var saveBtn = todo.editor.main.querySelector(".save-btn");
  saveBtn.addEventListener("click", () => {
    todo.saveEdits();
    todo.content.refresh();
  });

  var cancelBtn = todo.editor.main.querySelector(".cancel-btn");
  cancelBtn.addEventListener("click", () => todo.appendContent());
}

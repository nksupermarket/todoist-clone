import { helpers } from "./helpers.js";
import { listOfPjs, pjFact, listOfTodos, todoFact } from "./projects.js";
import { today } from "./today.js";
import { commentModal } from "./commentModal.js";
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
  hideMenu() {
    menu.ctn.classList.add("minimize");
    content.main.classList.add("menu-minimized");
  },
  showMenu() {
    menu.ctn.classList.remove("minimize");
    content.main.classList.remove("menu-minimized");
  },
};
header.menuBtn.addEventListener("click", () => {
  menu.ctn.classList.contains("minimize")
    ? headerEvents.showMenu()
    : headerEvents.hideMenu();
});
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

    (function addEvents() {
      newPj.menuItem.addEventListener("click", (e) => menuEvents.showPj(e));
      newPj.menuItem.addEventListener("mouseover", (e) =>
        menuEvents.showActionsBtn(e)
      );
      newPj.menuItem.addEventListener("mouseleave", (e) =>
        menuEvents.hideActionsBtn(e)
      );
      const moreBtn = newPj.menuItem.querySelector(".more-btn");
      moreBtn.addEventListener("click", (e) => {
        popupEvents.showPJActionsPopup(e, moreBtn);
      });
      moreBtn.addEventListener("click", (e) => e.stopPropagation());
    })();
  },
  showToday() {
    contentEvents.closeOpenEditors();
    if (content.findActiveCtn() !== undefined) content.removeActiveCtn();
    content.main.appendChild(content.todayCtn.main);

    const overdueList = today.getOverdueTodos(listOfTodos);
    if (overdueList.length === 0) {
      helpers.hide(todayCtn.sectionView);
      helpers.show(todayCtn.todoList);
      showTodayTodos(todayCtn);
      return;
    }

    (function showOverdueTodos() {
      helpers.hide(todayCtn.todoList);
      helpers.show(todayCtn.sectionView);
      todayCtn.overdueSection.todoArray = overdueList;
      todayCtn.overdueSection.fillTodoList(overdueList);
      showTodayTodos(todayCtn.todaySection);
    })();

    function showTodayTodos(ctn) {
      const todayList = today.getTodayTodos(listOfTodos);
      ctn.fillTodoList(todayList);
      ctn.todoArray = todayList;
    }
  },
  showUpcoming() {
    contentEvents.closeOpenEditors();
    content.removeActiveCtn();
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
          content.upcomingCtn.sections[i].fillTodoList(todos);
          upcomingCtn.sections[i].main.dataset.dayStr = dayStr;
        }
      }
    }
    content.main.appendChild(content.upcomingCtn.main);
  },
  showPj(e) {
    contentEvents.closeOpenEditors();
    helpers.hide(pjCtn.actions.sortedBtn);
    (function closeOpenCtn() {
      contentEvents.closeTodoForm();
      content.removeActiveCtn();
    })();

    const menuItem = e.target.closest("li");
    const pjId = menuItem.dataset.project;
    pjCtn.setDataProject(pjId);

    const pj = helpers.findItem(listOfPjs, pjId);
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
  showActionsBtn(e) {
    const btn = e.target.closest("li");
    btn.classList.add("hovered");
  },
  hideActionsBtn(e) {
    const btn = e.target.closest("li");
    btn.classList.remove("hovered");
  },
  addFocusToListItem(e) {
    const btn = e.target.closest("li");
    btn.classList.add("focused");
  },
  removeFocusFromListItem() {
    const btn = document.querySelector(".focused");
    btn.classList.remove("focused");
  },
  hidePJEditor() {
    helpers.hide(menu.editor.ctn);
    const pj = helpers.findItem(listOfPjs, menu.editor.ctn.dataset.project);
    helpers.show(pj.menuContent);
    pj.menuItem.classList.remove("editor");
  },
  savePJEdit() {
    const pj = helpers.findItem(listOfPjs, menu.editor.ctn.dataset.project);
    pj.title = menu.editor.titleInput.value;
    pj.menuContent.querySelector("span").textContent = pj.title;
    if (content.findActiveCtn() === content.pjCtn)
      content.pjCtn.refreshTitle(listOfPjs);
    menuEvents.hidePJEditor();
  },
};
menu.today.addEventListener("click", menuEvents.showToday);
menu.upcoming.addEventListener("click", menuEvents.showUpcoming);
menu.newBtn.addEventListener("click", menuEvents.showPjForm);
menu.addBtn.addEventListener("click", menuEvents.onAddPj);
menu.cancelBtn.addEventListener("click", menuEvents.hidePjForm);
menu.editor.ctn.addEventListener("click", (e) => e.stopPropagation());
menu.editor.saveBtn.addEventListener("click", menuEvents.savePJEdit);
menu.editor.cancelBtn.addEventListener("click", menuEvents.hidePJEditor);

const todoFormEvents = {
  fillPjInput(form) {
    var options = form.pjInput.querySelectorAll("option");
    options.forEach((option) => {
      if (option.textContent === "None") return;
      option.remove();
    });
    listOfPjs.forEach((pj) => pj.addToForm(form.pjInput));
  },
  onAddTodo(form) {
    var priority = popups.priority.ctn.querySelector(".active").dataset.value;
    var notes = {
      text: [],
      date: [],
    };
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
  addTodoCtnEvents(todo) {
    const dayInput = todo.content.main.querySelector(".day-btn");
    dayInput.addEventListener("change", changeTodoDay);
    function changeTodoDay() {
      todo.editDay(dayInput.value);
    }

    const commentsBtn = todo.content.main.querySelectorAll(".notes-btn");
    commentsBtn.forEach((btn) =>
      btn.addEventListener("click", () =>
        contentEvents.showCommentForm(
          "todo",
          todo.id,
          helpers.findItem(listOfPjs, todo.project).title,
          todo.title
        )
      )
    );

    const editBtn = todo.content.editBtn;
    editBtn.addEventListener("click", showTodoEditor);

    const deleteBtn = todo.content.deleteBtn;
    deleteBtn.addEventListener("click", () =>
      contentEvents.showDeletePopup("todo", todo.id, todo.title)
    );

    function showTodoEditor() {
      contentEvents.closeOpenEditors();
      editorForm.setDataset(todo.id);
      editorForm.titleInput.value = todo.title;
      editorForm.dateInput.value = todo.day;
      todoFormEvents.fillPjInput(editorForm);
      (function setDefaultPJtOption() {
        if (todo.project === "None" || !todo.project) return;
        const options = editorForm.pjInput.querySelectorAll("option");
        const defaultOption = [...options].find((option) => {
          return option.value.toString() === todo.project.toString();
        });
        defaultOption.setAttribute("selected", "selected");
      })();
      let flagColor;
      switch (todo.priority) {
        case "1":
          flagColor = "rgb(209, 69, 59)";
          break;
        case "2":
          flagColor = "rgb(235, 137, 9)";
          break;
        case "3":
          flagColor = "rgb(36, 111, 224)";
          break;
      }
      editorForm.changeFlagIcon(flagColor, todo.priority);
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
modalForm.ctn.addEventListener("click", () => todoFormEvents.close(modalForm));
modalForm.cancelBtn.addEventListener("click", () =>
  todoFormEvents.close(modalForm)
);
modalForm.commentBtn.addEventListener("click", () =>
  popupEvents.onIconBtn(popups.comment, todoForm.modalForm.commentBtn)
);
modalForm.priorityBtn.addEventListener("click", () =>
  popupEvents.onIconBtn(popups.priority, modalForm.priorityBtn)
);
contentForm.addBtn.addEventListener("click", () =>
  todoFormEvents.onAddTodo(contentForm)
);
contentForm.cancelBtn.addEventListener("click", () =>
  contentEvents.closeTodoForm(content.pjCtn)
);
contentForm.priorityBtn.addEventListener("click", () => {
  popupEvents.onIconBtn(popups.priority, contentForm.priorityBtn);
});
contentForm.commentBtn.addEventListener("click", () =>
  popupEvents.onIconBtn(popups.comment, contentForm.commentBtn)
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
  closeModal() {
    if (popups.findActivePopup() === popups.pjActions)
      menuEvents.removeFocusFromListItem();
    popups.hide();
  },
  onIconBtn(popup, btn) {
    popup.setDataBtn(btn.dataset.id);
    popup.show();
    popup.position(btn);
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
  showDeletePopup(itemType, itemID, itemTitle) {
    deletePopup.show();
    deletePopup.setDataItemType(itemType);
    deletePopup.setDataItemID(itemID);
    deletePopup.updateText(itemTitle);
    popups.toggleModalFull();
  },
  onDelete() {
    let list;
    deletePopup.ctn.dataset.itemType === "project"
      ? (list = listOfPjs)
      : (list = listOfTodos);
    const item = helpers.findItem(list, deletePopup.ctn.dataset.itemId);
    item.del();
    if (deletePopup.ctn.dataset.itemType === "project") {
      menuEvents.showToday();
    }
    if (deletePopup.ctn.dataset.itemType === "todo") {
      (function removeFromContentTodoList() {
        content.mainCtns.forEach((ctn) => {
          const todoIndex = ctn.todoArray.findIndex(
            (todo) => todo.id.toString() === deletePopup.ctn.dataset.itemId
          );
          ctn.todoArray.splice(todoIndex, 1);
        });
      })();
      content.findActiveCtn().refresh();
    }
    popups.hide();
  },
  showCommentForm(itemType, itemID, pjTitle, todoTitle) {
    helpers.show(commentModal.modal);
    commentModal.setDataItemType(itemType);
    commentModal.setDataItemID(itemID);
    commentModal.changePjTitle(pjTitle);
    commentModal.changeTodoTitle(todoTitle);
    let list;
    itemType === "project" ? (list = listOfPjs) : (list = listOfTodos);
    const item = helpers.findItem(list, itemID);
    if (!item.notes) return;
    for (let i = 0; i < item.notes.text.length; i++) {
      commentModal.fillCommentList(item.notes.text[i], item.notes.date[i]);
    }
  },
  onAddComment() {
    let list = [];
    commentModal.form.dataset.itemType === "project"
      ? (list = listOfPjs)
      : (list = listOfTodos);

    const item = helpers.findItem(list, commentModal.form.dataset.itemId);

    const note = commentModal.textarea.value;
    const date = today.getToday();

    item.notes.text[item.notes.text.length] = note;
    item.notes.date[item.notes.date.length] = date;

    commentModal.attachNote(note, date);
    if (commentModal.form.dataset.item === "todo")
      item.content.updateCommentCounter();

    commentModal.textarea.value = "";
  },
  showSortPopup() {
    const activeCtn = content.findActiveCtn();
    popups.sort.setDataBtn(activeCtn.actions.sortBtn.dataset.id);
    popups.sort.show();
    popups.sort.position(activeCtn.actions.sortBtn);
  },
  onSort(method) {
    const activeCtn = content.findActiveCtn();
    helpers.show(activeCtn.actions.sortedBtn);
    activeCtn.actions.sortedBtnIcon.setAttribute(
      "class",
      "flaticon flaticon-down-arrow-1"
    );

    let sortCtn;
    activeCtn.checkSectionView()
      ? (sortCtn = activeCtn.sections)
      : (sortCtn = activeCtn);
    switch (method) {
      case "date":
        activeCtn.actions.sortedBtnText.textContent = "Sorted by due date";
        Array.isArray(sortCtn)
          ? sortCtn.forEach((ctn) => ctn.sortDate())
          : sortCtn.sortDate();
        break;
      case "priority":
        activeCtn.actions.sortedBtnText.textContent = "Sorted by priority";
        Array.isArray(sortCtn)
          ? sortCtn.forEach((ctn) => ctn.sortPriority())
          : sortCtn.sortPriority();
        break;
      case "alphabet":
        activeCtn.actions.sortedBtnText.textContent = "Sorted alphabetically";
        Array.isArray(sortCtn)
          ? sortCtn.forEach((ctn) => ctn.sortAlphabetically())
          : sortCtn.sortAlphabetically();
        break;
      case "reverse":
        activeCtn.actions.sortedBtnIcon.classList.contains("flaticon-up-arrow")
          ? activeCtn.actions.sortedBtnIcon.setAttribute(
              "class",
              "flaticon flaticon-down-arrow-1"
            )
          : activeCtn.actions.sortedBtnIcon.setAttribute(
              "class",
              "flaticon flaticon-up-arrow"
            );
        Array.isArray(sortCtn)
          ? sortCtn.forEach((ctn) => ctn.sortReverse())
          : sortCtn.sortReverse();
        break;
    }
    Array.isArray(sortCtn)
      ? sortCtn.forEach((ctn) => ctn.refresh())
      : sortCtn.refresh();
  },
  showPJActionsPopup(e, btn) {
    menuEvents.addFocusToListItem(e);
    popupEvents.onIconBtn(popups.pjActions, btn);
    const listItem = e.target.closest("li");
    popups.pjActions.setDataProject(listItem.dataset.project);
  },
  showPJMenuEditor() {
    popups.hide();
    menuEvents.removeFocusFromListItem();
    const pj = helpers.findItem(listOfPjs, pjActionsPopup.ctn.dataset.project);
    helpers.hide(pj.menuContent);
    helpers.show(menu.editor.ctn);
    menu.editor.titleInput.value = pj.title;
    menu.editor.ctn.dataset.project = pj.id;

    pj.menuItem.appendChild(menu.editor.ctn);
    pj.menuItem.classList.add("editor");
    menu.editor.titleInput.focus();
  },
};
popups.modal.addEventListener("click", popupEvents.closeModal);
const priorityPopup = popups.priority;
priorityPopup.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
const commentPopup = popups.comment;
commentPopup.ctn.addEventListener("click", function (e) {
  e.stopPropagation();
});
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
    popupEvents.onSelectPriorityLevel(e);
  })
);
const deletePopup = popups.del;
deletePopup.ctn.addEventListener("click", (e) => e.stopPropagation());
deletePopup.cancelBtn.addEventListener("click", () => popups.hide());
deletePopup.deleteBtn.addEventListener("click", popupEvents.onDelete);

const pjActionsPopup = popups.pjActions;
pjActionsPopup.ctn.addEventListener("click", (e) => e.stopPropagation());
pjActionsPopup.editBtn.addEventListener("click", popupEvents.showPJMenuEditor);
pjActionsPopup.deleteBtn.addEventListener("click", () => {
  const pjTitle = helpers.findItem(
    listOfPjs,
    pjActionsPopup.ctn.dataset.project
  ).title;
  popupEvents.showDeletePopup(
    "project",
    pjActionsPopup.ctn.dataset.project,
    pjTitle
  );
  menuEvents.removeFocusFromListItem();
});

commentModal.addBtn.addEventListener("click", popupEvents.onAddComment);
commentModal.form.addEventListener("click", (e) => {
  e.stopPropagation();
});
commentModal.modal.addEventListener("click", () => commentModal.close());
commentModal.closeBtn.addEventListener("click", () => commentModal.close());

const contentEvents = {
  showPJEditor() {
    helpers.hide(pjCtn.title);
    helpers.show(pjCtn.editor.ctn);
    pjCtn.editor.titleInput.focus();
    pjCtn.editor.titleInput.value = pjCtn.title.textContent;
  },
  saveEditPj() {
    const pj = helpers.findItem(listOfPjs, pjCtn.main.dataset.project);
    pj.title = pjCtn.editor.titleInput.value;
    pjCtn.refreshTitle(listOfPjs);
  },
  cancelPjEdit() {
    pjCtn.title.classList.remove("inactive");
    pjCtn.editor.ctn.classList.add("inactive");
  },
  showTodoForm(ctn) {
    contentEvents.closeOpenEditors();
    todoFormEvents.fillPjInput(contentForm);
    contentForm.setDefaultDate();
    ctn.todoList.appendChild(contentForm.ctn);
    helpers.show(contentForm.ctn);
    contentForm.titleInput.focus();
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
  contentEvents.showTodoForm(todayCtn);
});
todayCtn.todaySection.todoBtn.addEventListener("click", () =>
  contentEvents.showTodoForm(todayCtn.todaySection)
);
const upcomingCtn = content.upcomingCtn;
upcomingCtn.sections.forEach((section) => {
  section.todoBtn.addEventListener("click", () => {
    contentEvents.showTodoForm(section);
    contentForm.dateInput.value = section.main.dataset.dayStr;
    upcomingCtn.sections.forEach((section) => {
      section.todoBtn.remove();
    });
  });
});
pjCtn.actions.sortBtn.addEventListener("click", popupEvents.showSortPopup);
pjCtn.actions.editBtn.addEventListener("click", contentEvents.showPJEditor);
pjCtn.editor.saveBtn.addEventListener("click", contentEvents.saveEditPj);
pjCtn.editor.cancelBtn.addEventListener("click", contentEvents.cancelPjEdit);
pjCtn.actions.commentBtn.addEventListener("click", () =>
  popupEvents.showCommentForm(
    "project",
    pjCtn.main.dataset.project,
    pjCtn.title.textContent,
    ""
  )
);
pjCtn.actions.deleteBtn.addEventListener("click", () =>
  popupEvents.showDeletePopup(
    "project",
    pjCtn.main.dataset.project,
    pjCtn.title.textContent
  )
);
todayCtn.actions.sortBtn.addEventListener("click", popupEvents.showSortPopup);
popups.sort.dateBtn.addEventListener("click", () => popupEvents.onSort("date"));
popups.sort.priorityBtn.addEventListener("click", () =>
  popupEvents.onSort("priority")
);
popups.sort.alphabetBtn.addEventListener("click", () =>
  popupEvents.onSort("alphabet")
);
pjCtn.actions.sortedBtn.addEventListener("click", () =>
  popupEvents.onSort("reverse")
);
todayCtn.actions.sortedBtn.addEventListener("click", () =>
  popupEvents.onSort("reverse")
);

const init = (() => {
  var pjWork = pjFact.createProject("Work");
  var pjHome = pjFact.createProject("Home");
  var pjCode = pjFact.createProject("Code");

  pjWork.pushToList();
  pjHome.pushToList();
  pjCode.pushToList();

  listOfPjs.forEach((pj) => pj.addToMenu());

  samples.generate(50);
  listOfTodos.forEach((todo) => todoFormEvents.addTodoCtnEvents(todo));
  (function addEventsToPJMenuItems() {
    listOfPjs.forEach((pj) => {
      pj.menuItem.addEventListener("click", (e) => menuEvents.showPj(e));
      pj.menuItem.addEventListener("mouseover", (e) =>
        menuEvents.showActionsBtn(e)
      );
      pj.menuItem.addEventListener("mouseleave", (e) =>
        menuEvents.hideActionsBtn(e)
      );
      const moreBtn = pj.menuItem.querySelector(".more-btn");
      moreBtn.addEventListener("click", (e) => {
        popupEvents.showPJActionsPopup(e, moreBtn);
      });
      moreBtn.addEventListener("click", (e) => e.stopPropagation());
    });
  })();

  menuEvents.showToday();
})();

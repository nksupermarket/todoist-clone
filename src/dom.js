import { helpers } from './helpers.js';
import { listOfPjs, pjFact, listOfTodos, todoFact } from './projects.js';
import { today } from './today.js';
import { commentModal } from './commentModal.js';
import { menu } from './menu.js';
import { content } from './content.js';
import { todoForm } from './todoForm.js';
import { samples } from './samples.js';
import { popups } from './popups.js';
import { header } from './header.js';

function saveToLS(list) {
  const iceBlock = JSON.stringify(list);
  switch (list) {
    case listOfTodos: {
      localStorage.setItem('listOfTodos', iceBlock);
      break;
    }
    case listOfPjs: {
      localStorage.setItem('listOfPjs', iceBlock);
      break;
    }
  }
}

const modalForm = todoForm.modalForm;
const headerEvents = {
  showModalTodoForm() {
    helpers.show(modalForm.ctn);
    popups.priority.reset();
    todoFormEvents.fillPjInput(modalForm);
    modalForm.setDefaultDate();
  },
  hideMenu() {
    menu.ctn.classList.add('minimize');
    content.main.classList.add('menu-minimized');

    if (window.matchMedia('(max-width: 710px)').matches) {
      content.main.classList.remove('menu-minimized-sm');
    }
  },
  showMenu() {
    menu.ctn.classList.remove('minimize');
    content.main.classList.remove('menu-minimized');

    if (window.matchMedia('(max-width: 710px)').matches) {
      content.main.classList.add('menu-minimized-sm');
    }
  },
  showFullSearchbar() {
    if (window.matchMedia('(max-width: 710px)').matches)
      return header.search.parentElement.classList.add('focused-sm');
    header.search.parentElement.classList.add('focused');
  },
  hideFullSearchbar() {
    header.search.parentElement.classList.remove('focused', 'focused-sm');
  },
  showSearchResult() {
    if (!header.search.value || !/\S/.test(header.search.value)) return;

    contentEvents.closeOpenEditors();
    content.removeActiveCtn();

    searchCtn.title.textContent = `Results for "${header.search.value}"`;
    (function fillPJSection() {
      searchCtn.projectSection.todoList.textContent = '';
      const projects = listOfPjs.filter((project) =>
        project.title.toLowerCase().includes(header.search.value.toLowerCase())
      );
      if (projects.length === 0)
        return searchCtn.projectSection.title.classList.add('empty');
      searchCtn.projectSection.title.classList.remove('empty');
      projects.forEach((project) => {
        const link = document.createElement('a');
        link.classList.add('project-link');
        link.textContent = project.title;
        searchCtn.projectSection.todoList.appendChild(link);
        link.addEventListener('click', () => menuEvents.showPj(project.id));
      });
    })();
    (function fillTodoSection() {
      const todos = listOfTodos.filter((todo) =>
        todo.title.toLowerCase().includes(header.search.value.toLowerCase())
      );
      if (todos.length === 0)
        return searchCtn.todoSection.title.classList.add('empty');
      searchCtn.todoSection.title.classList.remove('empty');
      searchCtn.todoSection.fillTodoList(todos);
    })();
    content.main.appendChild(searchCtn.main);
  },
  changeNewTodoBtnOnResize() {
    const btnText = header.todoBtn.querySelector('.btn-text');
    if (window.matchMedia('(max-width: 500px)').matches) {
      btnText.textContent = '';
      header.todoBtn.classList.add('btn-sm');
      return;
    }
    btnText.textContent = 'New Task';
    header.todoBtn.classList.remove('btn-sm');
  },
};
header.menuBtn.addEventListener('click', () => {
  menu.ctn.classList.contains('minimize')
    ? headerEvents.showMenu()
    : headerEvents.hideMenu();
});
window.addEventListener('resize', function closeMenuUponResize() {
  if (window.matchMedia('(max-width: 710px)').matches) headerEvents.hideMenu();
});
window.addEventListener('resize', function changeSearchbarSize() {
  if (
    window.matchMedia('(max-width: 710px)').matches &&
    header.search.parentElement.classList.contains('focused')
  ) {
    header.search.parentElement.classList.remove('focused');
    header.search.parentElement.classList.add('focused-sm');
  }
});
window.addEventListener('resize', headerEvents.changeNewTodoBtnOnResize);
header.todoBtn.addEventListener('click', headerEvents.showModalTodoForm);
header.search.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.keyCode === 13) headerEvents.showSearchResult();
});
header.search.addEventListener('focus', headerEvents.showFullSearchbar);
header.search.addEventListener('blur', headerEvents.hideFullSearchbar);

const menuEvents = {
  addRemoveEventsRelatingToMenu() {
    const contentBody = document.querySelector('#not-header');
    if (window.matchMedia('(max-width: 710px)').matches) {
      contentBody.addEventListener('click', headerEvents.hideMenu);
      menu.ctn.addEventListener('click', function stopPropagation(e) {
        e.stopPropagation();
      });
      return;
    }
    contentBody.removeEventListener('click', headerEvents.hideMenu);
    menu.ctn.addEventListener('click', (e) => e.stopPropagation());
  },
  showPjForm() {
    helpers.show(menu.form);
    menu.formInput.focus();
  },
  hidePjForm() {
    helpers.hide(menu.form);
    menu.form.reset();
  },
  onAddPj() {
    if (!menu.titleInput.value) return helpers.inputError('empty');
    const newPj = pjFact.createProject(menu.titleInput.value);
    newPj.pushToList().addToMenu();
    saveToLS(listOfPjs);
    this.addPJMenuItemEvents(newPj.id);
    menu.hidePjForm();
  },
  addPJMenuItemEvents(pj) {
    pj.menuItem.addEventListener('click', () => {
      menuEvents.showPj(pj.id);
    });
    pj.menuItem.addEventListener('mouseover', (e) =>
      menuEvents.showActionsBtn(e)
    );
    pj.menuItem.addEventListener('mouseleave', (e) =>
      menuEvents.hideActionsBtn(e)
    );
    const moreBtn = pj.menuItem.querySelector('.more-btn');
    moreBtn.addEventListener('click', (e) => {
      popupEvents.showPJActionsPopup(e, moreBtn);
    });
    moreBtn.addEventListener('click', (e) => e.stopPropagation());
  },
  showToday() {
    contentEvents.closeOpenEditors();
    header.search.value = '';
    if (content.findActiveCtn() !== undefined) content.removeActiveCtn();
    content.main.appendChild(content.todayCtn.main);

    const overdueList = today.getOverdueTodos(listOfTodos);
    if (overdueList.length === 0) {
      helpers.hide(todayCtn.sectionHolder);
      helpers.show(todayCtn.todoList);
      todayCtn.sectionView = false;
      showTodayTodos(todayCtn);
      return;
    }

    showOverdueTodos();
    showTodayTodos(todayCtn.todaySection);

    function showOverdueTodos() {
      helpers.hide(todayCtn.todoList);
      helpers.show(todayCtn.sectionHolder);
      todayCtn.sectionView = true;
      todayCtn.overdueSection.todoArray = overdueList;
      todayCtn.overdueSection.fillTodoList(overdueList);
      overdueList.forEach((todo) => todo.checkOverdue());
    }
    function showTodayTodos(ctn) {
      const todayList = today.getTodayTodos(listOfTodos);
      ctn.fillTodoList(todayList);
      ctn.todoArray = todayList;
    }
  },
  showUpcoming() {
    contentEvents.closeOpenEditors();
    header.search.value = '';
    content.removeActiveCtn();
    fillSections();
    content.main.appendChild(content.upcomingCtn.main);

    function fillSections() {
      const dateObj = new Date();
      for (let i = 0; i < content.upcomingCtn.sections.length; i++) {
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
                'Today — '.concat(
                  content.upcomingCtn.sections[i].title.textContent
                );
          })();
          (function setTomorrowStr() {
            if (i === 1)
              content.upcomingCtn.sections[i].title.textContent =
                'Tomorrow — '.concat(
                  content.upcomingCtn.sections[i].title.textContent
                );
          })();
        }
        function setTodoList(i) {
          const dayStr = (function getDayStr() {
            const year = dateObj.getFullYear();
            let month = dateObj.getMonth() + 1;
            let day = dateObj.getDate();
            if (month.toString().length === 1)
              month = '0'.concat(month.toString());
            if (day.toString().length === 1) day = '0'.concat(day.toString());
            return `${year}-${month}-${day}`;
          })();

          const todos = listOfTodos.filter((item) => {
            if (item.priority === '5') return false;
            return item.day === dayStr;
          });
          if (todos.length === 0)
            return content.upcomingCtn.sections[i].title.classList.add('empty');
          content.upcomingCtn.sections[i].title.classList.remove('empty');
          content.upcomingCtn.sections[i].fillTodoList(todos);
          upcomingCtn.sections[i].main.dataset.dayStr = dayStr;
        }
      }
    }
  },
  showPj(id) {
    contentEvents.closeOpenEditors();
    header.search.value = '';
    helpers.hide(pjCtn.actions.sortedBtn);
    (function closeOpenCtn() {
      contentEvents.closeTodoForm();
      content.removeActiveCtn();
    })();

    pjCtn.setDataProject(id);
    const pj = helpers.findItem(listOfPjs, id);
    pj.notes.text.length === 0
      ? pjCtn.changeCommentBtn('empty')
      : pjCtn.changeCommentBtn('not empty');
    content.pjCtn.title.textContent = pj.title;
    pjCtn.fillTodoList(pj.todoList);
    pj.todoList.forEach((todo) => todo.checkOverdue());
    content.main.appendChild(content.pjCtn.main);
  },
  showActionsBtn(e) {
    const btn = e.target.closest('li');
    btn.classList.add('hovered');
  },
  hideActionsBtn(e) {
    const btn = e.target.closest('li');
    btn.classList.remove('hovered');
  },
  addFocusToListItem(e) {
    const btn = e.target.closest('li');
    btn.classList.add('focused');
  },
  removeFocusFromListItem() {
    const btn = document.querySelector('.focused');
    btn.classList.remove('focused');
  },
  hidePJEditor() {
    helpers.hide(menu.editor.ctn);
    const pj = helpers.findItem(listOfPjs, menu.editor.ctn.dataset.project);
    helpers.show(pj.menuContent);
    pj.menuItem.classList.remove('editor');
  },
  savePJEdit() {
    const pj = helpers.findItem(listOfPjs, menu.editor.ctn.dataset.project);
    pj.title = menu.editor.titleInput.value;
    saveToLS(listOfPjs);
    pj.menuContent.querySelector('span').textContent = pj.title;
    if (content.findActiveCtn() === content.pjCtn)
      content.pjCtn.refreshTitle(listOfPjs);
    menuEvents.hidePJEditor();
  },
};
window.addEventListener('resize', menuEvents.addRemoveEventsRelatingToMenu);
menu.today.addEventListener('click', menuEvents.showToday);
menu.upcoming.addEventListener('click', menuEvents.showUpcoming);
menu.newBtn.addEventListener('click', menuEvents.showPjForm);
menu.addBtn.addEventListener('click', menuEvents.onAddPj);
menu.cancelBtn.addEventListener('click', menuEvents.hidePjForm);
menu.editor.ctn.addEventListener('click', (e) => e.stopPropagation());
menu.editor.saveBtn.addEventListener('click', menuEvents.savePJEdit);
menu.editor.cancelBtn.addEventListener('click', menuEvents.hidePJEditor);

const todoFormEvents = {
  fillPjInput(form) {
    const options = form.pjInput.querySelectorAll('option');
    options.forEach((option) => {
      if (option.textContent === 'None') return;
      option.remove();
    });
    listOfPjs.forEach((pj) => pj.addToForm(form.pjInput));
  },
  onAddTodo(form) {
    const priority = popups.priority.ctn.querySelector('.active').dataset.value;
    const notes = {
      text: [],
      date: [],
    };
    (function addNotes() {
      if (!popups.comment.textarea.value) return;
      notes.text[0] = popups.comment.textarea.value;
      notes.date[0] = today.getToday();
    })();
    const newTodo = todoFact.createTodo(
      form.pjInput.value,
      form.titleInput.value,
      form.dateInput.value,
      priority,
      notes
    );
    todoFormEvents.addTodoCtnEvents(newTodo);
    newTodo.pushToList().appendContent();
    saveToLS(listOfTodos);
    if (form.pjInput.value != 'None') newTodo.pushToProject();

    form === todoForm.modalForm ? form.hide() : contentEvents.closeTodoForm();
    popups.comment.reset();
    popups.priority.reset();

    const activeCtn = content.findActiveCtn();
    activeCtn.checkSectionView()
      ? activeCtn.sections.forEach((section) => section.refresh())
      : activeCtn.refresh();
    switch (activeCtn) {
      case todayCtn: {
        menuEvents.showToday();
        break;
      }
      case upcomingCtn: {
        menuEvents.showUpcoming();
        break;
      }
      case pjCtn: {
        break;
      }
    }
  },
  close(form) {
    form.hide();
    popups.hide();
    popups.comment.reset();
  },
  addTodoCtnEvents(todo) {
    const dayInput = todo.content.main
      .querySelector('.day-btn')
      .querySelector('input');
    dayInput.addEventListener('change', changeTodoDay);
    function changeTodoDay() {
      todo.editDay(dayInput.value);
    }

    const commentsBtn = todo.content.main.querySelectorAll('.notes-btn');
    commentsBtn.forEach((btn) =>
      btn.addEventListener('click', () =>
        popupEvents.showCommentForm(
          'todo',
          todo.id,
          helpers.findItem(listOfPjs, todo.project).title,
          todo.title
        )
      )
    );

    const editBtn = todo.content.editBtn;
    editBtn.addEventListener('click', showTodoEditor);
    function showTodoEditor() {
      contentEvents.closeOpenEditors();
      editorForm.setDataset(todo.id);
      editorForm.titleInput.value = todo.title;
      editorForm.dateInput.value = todo.day;
      todoFormEvents.fillPjInput(editorForm);
      (function setDefaultPJtOption() {
        if (todo.project === 'None' || !todo.project) return;
        const options = editorForm.pjInput.querySelectorAll('option');
        const defaultOption = [...options].find((option) => {
          return option.value.toString() === todo.project.toString();
        });
        defaultOption.setAttribute('selected', 'selected');
      })();
      let flagColor;
      switch (todo.priority) {
        case '1':
          flagColor = 'rgb(209, 69, 59)';
          break;
        case '2':
          flagColor = 'rgb(235, 137, 9)';
          break;
        case '3':
          flagColor = 'rgb(36, 111, 224)';
          break;
      }
      editorForm.changeFlagIcon(flagColor, todo.priority);
      todo.appendEditor(editorForm);
      helpers.show(editorForm.ctn);
    }

    const deleteBtn = todo.content.deleteBtn;
    deleteBtn.addEventListener('click', () =>
      popupEvents.showDeletePopup('todo', todo.id, todo.title)
    );

    const checkbox = todo.content.checkbox;
    checkbox.addEventListener('click', onCheckbox);
    function onCheckbox() {
      todo.priority === '5' ? todo.markIncomplete() : todo.markComplete();
      saveToLS(listOfTodos);
      const activeCtn = content.findActiveCtn();
      if (activeCtn === todayCtn) menuEvents.showToday();
      if (activeCtn === upcomingCtn) menuEvents.showUpcoming();
    }
  },
  onSaveEdit() {
    const todo = helpers.findItem(listOfTodos, editorForm.ctn.dataset.id);
    const prioritySelected = priorityPopup.ctn.querySelector('.active');
    todo.saveEdits(editorForm, prioritySelected);
    saveToLS(listOfTodos);
    todo.content.refresh();
    editorForm.ctn.remove();
    helpers.hide(editorForm.ctn);
    todo.appendContent();
  },
  onCancelEdit() {
    editorForm.ctn.remove();
    helpers.hide(editorForm.ctn);
    const todo = helpers.findItem(listOfTodos, editorForm.ctn.dataset.id);
    todo.appendContent();
  },
};
const contentForm = todoForm.contentForm;
modalForm.titleInput.addEventListener('input', () => {
  modalForm.changeAddBtn();
});
contentForm.titleInput.addEventListener('input', () => {
  contentForm.changeAddBtn();
});
modalForm.addBtn.addEventListener('click', () =>
  todoFormEvents.onAddTodo(modalForm)
);
modalForm.form.addEventListener('click', function (e) {
  e.stopPropagation();
});
modalForm.ctn.addEventListener('click', () => todoFormEvents.close(modalForm));
modalForm.cancelBtn.addEventListener('click', () =>
  todoFormEvents.close(modalForm)
);
modalForm.commentBtn.addEventListener('click', () =>
  popupEvents.onIconBtn(popups.comment, todoForm.modalForm.commentBtn)
);
modalForm.priorityBtn.addEventListener('click', () =>
  popupEvents.onIconBtn(popups.priority, modalForm.priorityBtn)
);
contentForm.addBtn.addEventListener('click', () =>
  todoFormEvents.onAddTodo(contentForm)
);
contentForm.cancelBtn.addEventListener('click', () =>
  contentEvents.closeTodoForm(content.pjCtn)
);
contentForm.priorityBtn.addEventListener('click', () => {
  popupEvents.onIconBtn(popups.priority, contentForm.priorityBtn);
});
contentForm.commentBtn.addEventListener('click', () =>
  popupEvents.onIconBtn(popups.comment, contentForm.commentBtn)
);
const editorForm = todoForm.editor;
editorForm.priorityBtn.addEventListener('click', function showPriorityPopup() {
  popups.priority.show();
  popups.priority.setDataBtn(`${editorForm.priorityBtn.dataset.id}`);
  popups.priority.position(editorForm.priorityBtn);
  (function setDefaultPriority() {
    const todo = helpers.findItem(listOfTodos, editorForm.ctn.dataset.id);
    popups.priority.setActive(todo.priority);
  })();
});

editorForm.saveBtn.addEventListener('click', todoFormEvents.onSaveEdit);
editorForm.cancelBtn.addEventListener('click', todoFormEvents.onCancelEdit);

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
    const btn = e.target.closest('.btn');
    popups.priority.setActive(btn.dataset.value);

    (function () {
      const icon = btn.querySelector('i');
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
    deletePopup.ctn.dataset.itemType === 'project'
      ? (list = listOfPjs)
      : (list = listOfTodos);
    const item = helpers.findItem(list, deletePopup.ctn.dataset.itemId);
    item.del();
    deletePopup.ctn.dataset.itemType === 'project'
      ? saveToLS(listOfPjs)
      : saveToLS(listOfTodos);
    if (deletePopup.ctn.dataset.itemType === 'project') {
      menuEvents.showToday();
    }
    if (deletePopup.ctn.dataset.itemType === 'todo') {
      (function removeFromContentTodoList() {
        content.allCtns.forEach((ctn) => {
          if (!ctn.todoArray || ctn.todoArray.length === 0) return;
          const todoIndex = ctn.todoArray.findIndex(findTodo);
          function findTodo(todo) {
            return todo.id.toString() === deletePopup.ctn.dataset.itemId;
          }
          if (todoIndex !== -1) {
            ctn.todoArray.splice(todoIndex, 1);
            if (ctn.todoArray.length === 0 && ctn === todayCtn.overdueSection)
              return menuEvents.showToday();
            if (ctn.todoArray.length === 0)
              return ctn.title.classList.add('empty');
          }
        });
      })();
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
    itemType === 'project' ? (list = listOfPjs) : (list = listOfTodos);
    const item = helpers.findItem(list, itemID);
    if (item.notes.text.length === 0) return commentModal.showNoNotesNote();
    for (let i = 0; i < item.notes.text.length; i++) {
      commentModal.attachNote(item.notes.text[i], item.notes.date[i]);
    }
  },
  onAddComment() {
    commentModal.hideNoNotesNote();

    let list;
    commentModal.form.dataset.itemType === 'project'
      ? (list = listOfPjs)
      : (list = listOfTodos);
    const item = helpers.findItem(list, commentModal.form.dataset.itemId);
    const note = commentModal.textarea.value;
    const date = today.getToday();
    item.notes.text[item.notes.text.length] = note;
    item.notes.date[item.notes.date.length] = date;
    saveToLS(list);

    commentModal.attachNote(note, date);
    commentModal.form.dataset.itemType === 'todo'
      ? item.content.updateCommentCounter()
      : pjCtn.changeCommentBtn('not empty');

    commentModal.textarea.value = '';
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
      'class',
      'flaticon flaticon-down-arrow-1'
    );

    let sortCtn;
    activeCtn.checkSectionView()
      ? (sortCtn = activeCtn.sections)
      : (sortCtn = activeCtn);
    switch (method) {
      case 'date':
        activeCtn.actions.sortedBtnText.textContent = 'Sorted by due date';
        Array.isArray(sortCtn)
          ? sortCtn.forEach((ctn) => ctn.sortDate())
          : sortCtn.sortDate();
        break;
      case 'priority':
        activeCtn.actions.sortedBtnText.textContent = 'Sorted by priority';
        Array.isArray(sortCtn)
          ? sortCtn.forEach((ctn) => ctn.sortPriority())
          : sortCtn.sortPriority();
        break;
      case 'alphabet':
        activeCtn.actions.sortedBtnText.textContent = 'Sorted alphabetically';
        Array.isArray(sortCtn)
          ? sortCtn.forEach((ctn) => ctn.sortAlphabetically())
          : sortCtn.sortAlphabetically();
        break;
      case 'reverse':
        activeCtn.actions.sortedBtnIcon.classList.contains('flaticon-up-arrow')
          ? activeCtn.actions.sortedBtnIcon.setAttribute(
              'class',
              'flaticon flaticon-down-arrow-1'
            )
          : activeCtn.actions.sortedBtnIcon.setAttribute(
              'class',
              'flaticon flaticon-up-arrow'
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
    const listItem = e.target.closest('li');
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
    pj.menuItem.classList.add('editor');
    menu.editor.titleInput.focus();
  },
};
popups.modal.addEventListener('click', popupEvents.closeModal);
const priorityPopup = popups.priority;
priorityPopup.ctn.addEventListener('click', function (e) {
  e.stopPropagation();
});
const commentPopup = popups.comment;
commentPopup.ctn.addEventListener('click', function (e) {
  e.stopPropagation();
});
commentPopup.textarea.oninput = () => {
  commentPopup.textarea.value
    ? todoForm.findActiveForm().changeCommentBtn('not empty')
    : todoForm.findActiveForm().changeCommentBtn('empty');
};
commentPopup.closeBtn.addEventListener('click', popups.hide);
window.addEventListener('resize', function movePopups() {
  const activePopup = popups.findActivePopup();
  if (!activePopup) return;
  const btn = document.querySelector(
    `[data-id = "${activePopup.ctn.dataset.btn}"]`
  );
  activePopup.position(btn);
});
priorityPopup.btns.forEach((btn) =>
  btn.addEventListener('click', function (e) {
    popupEvents.onSelectPriorityLevel(e);
  })
);
const deletePopup = popups.del;
deletePopup.ctn.addEventListener('click', (e) => e.stopPropagation());
deletePopup.cancelBtn.addEventListener('click', () => popups.hide());
deletePopup.deleteBtn.addEventListener('click', popupEvents.onDelete);

const pjActionsPopup = popups.pjActions;
pjActionsPopup.ctn.addEventListener('click', (e) => e.stopPropagation());
pjActionsPopup.editBtn.addEventListener('click', popupEvents.showPJMenuEditor);
pjActionsPopup.deleteBtn.addEventListener('click', () => {
  const pjTitle = helpers.findItem(
    listOfPjs,
    pjActionsPopup.ctn.dataset.project
  ).title;
  popupEvents.showDeletePopup(
    'project',
    pjActionsPopup.ctn.dataset.project,
    pjTitle
  );
  menuEvents.removeFocusFromListItem();
});

commentModal.addBtn.addEventListener('click', popupEvents.onAddComment);
commentModal.form.addEventListener('click', (e) => {
  e.stopPropagation();
});
commentModal.modal.addEventListener('click', () => commentModal.close());
commentModal.closeBtn.addEventListener('click', () => commentModal.close());

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
    saveToLS(listOfPjs);
  },
  cancelPjEdit() {
    pjCtn.title.classList.remove('inactive');
    pjCtn.editor.ctn.classList.add('inactive');
  },
  showTodoForm(ctn) {
    contentEvents.closeOpenEditors();
    todoFormEvents.fillPjInput(contentForm);
    contentForm.setDefaultDate();
    ctn.todoList.appendChild(contentForm.form);
    helpers.show(contentForm.form);
    contentForm.titleInput.focus();
    helpers.hide(ctn.todoBtn);
  },
  closeTodoForm() {
    const activeCtn = content.findActiveCtn();
    if (!activeCtn) return;
    contentForm.hide();

    if (activeCtn === content.upcomingCtn)
      return content.upcomingCtn.sections.forEach((section) => {
        helpers.show(section.todoBtn);
        section.todoList.appendChild(section.todoBtn);
      });

    if (activeCtn === content.todayCtn && content.todayCtn.checkSectionView()) {
      helpers.show(content.todayCtn.todaySection.todoBtn);
      content.todayCtn.todaySection.todoList.appendChild(
        content.todayCtn.todaySection.todoBtn
      );
      return;
    }

    if (activeCtn.todoBtn) {
      helpers.show(activeCtn.todoBtn);
      activeCtn.todoList.appendChild(activeCtn.todoBtn);
    }
  },
  setDefaultPjForTodoForm() {
    const defaultPj = contentForm.pjInput.querySelector(
      `[value="${content.pjCtn.main.dataset.project}"]`
    );
    defaultPj.setAttribute('selected', 'selected');
  },
  closeOpenEditors() {
    const openEditor = document.querySelector('.todo-editor:not(.inactive)');
    if (!openEditor) return;
    if (openEditor.classList.contains('new-todo-form')) {
      const activeCtn = content.findActiveCtn();
      contentEvents.closeTodoForm(activeCtn);
      return;
    }
    if (!openEditor.dataset.id) return;
    const openTodo = helpers.findItem(listOfTodos, openEditor.dataset.id);
    const prioritySelected = priorityPopup.ctn.querySelector('.active');
    openTodo.saveEdits(editorForm, prioritySelected);
    openTodo.content.refresh();
    openTodo.appendContent();

    editorForm.ctn.remove();
    helpers.hide(editorForm.ctn);
  },
};
const pjCtn = content.pjCtn;
pjCtn.todoBtn.addEventListener('click', () => {
  contentEvents.showTodoForm(pjCtn);
  contentEvents.setDefaultPjForTodoForm();
});
const todayCtn = content.todayCtn;
todayCtn.todoBtn.addEventListener('click', () => {
  contentEvents.showTodoForm(todayCtn);
});
todayCtn.todaySection.todoBtn.addEventListener('click', () =>
  contentEvents.showTodoForm(todayCtn.todaySection)
);
const upcomingCtn = content.upcomingCtn;
upcomingCtn.sections.forEach((section) => {
  section.todoBtn.addEventListener('click', () => {
    contentEvents.showTodoForm(section);
    contentForm.dateInput.value = section.main.dataset.dayStr;
    upcomingCtn.sections.forEach((section) => {
      helpers.hide(section.todoBtn);
    });
  });
});
upcomingCtn.actions.sortBtn.addEventListener(
  'click',
  popupEvents.showSortPopup
);

pjCtn.actions.sortBtn.addEventListener('click', popupEvents.showSortPopup);
pjCtn.actions.editBtn.addEventListener('click', contentEvents.showPJEditor);
pjCtn.editor.saveBtn.addEventListener('click', contentEvents.saveEditPj);
pjCtn.editor.cancelBtn.addEventListener('click', contentEvents.cancelPjEdit);
pjCtn.actions.commentBtn.addEventListener('click', () =>
  popupEvents.showCommentForm(
    'project',
    pjCtn.main.dataset.project,
    pjCtn.title.textContent,
    ''
  )
);
pjCtn.actions.deleteBtn.addEventListener('click', () =>
  popupEvents.showDeletePopup(
    'project',
    pjCtn.main.dataset.project,
    pjCtn.title.textContent
  )
);
todayCtn.actions.sortBtn.addEventListener('click', popupEvents.showSortPopup);
popups.sort.dateBtn.addEventListener('click', () => popupEvents.onSort('date'));
popups.sort.priorityBtn.addEventListener('click', () =>
  popupEvents.onSort('priority')
);
popups.sort.alphabetBtn.addEventListener('click', () =>
  popupEvents.onSort('alphabet')
);
pjCtn.actions.sortedBtn.addEventListener('click', () =>
  popupEvents.onSort('reverse')
);
todayCtn.actions.sortedBtn.addEventListener('click', () =>
  popupEvents.onSort('reverse')
);
upcomingCtn.actions.sortedBtn.addEventListener('click', () =>
  popupEvents.onSort('reverse')
);
const searchCtn = content.searchCtn;

(function init() {
  if (localStorage.listOfPjs) {
    const LOPzombie = JSON.parse(localStorage.getItem('listOfPjs'));
    LOPzombie.forEach((pj) => bringToLife(pj, 'project'));
    const LOTzombie = JSON.parse(localStorage.getItem('listOfTodos'));
    LOTzombie.forEach((todo) => bringToLife(todo, 'todo'));

    function bringToLife(item, itemType) {
      switch (itemType) {
        case 'project': {
          const project = pjFact.createProject(item.title);
          project.notes = item.notes;
          project.pushToList().addToMenu();
          break;
        }
        case 'todo': {
          const todo = todoFact.createTodo(
            item.project,
            item.title,
            item.day,
            item.priority,
            item.notes
          );
          todo.pushToList().appendContent().checkComplete();
          if (item.project != 'None') todo.pushToProject();
        }
      }
    }
  }
  if (!localStorage.listOfPjs) {
    const pjWork = pjFact.createProject('Work');
    const pjHome = pjFact.createProject('Home');
    const pjCode = pjFact.createProject('Code');
    pjWork.pushToList().addToMenu();
    pjHome.pushToList().addToMenu();
    pjCode.pushToList().addToMenu();
    samples.generate(50);
    saveToLS(listOfPjs);
    saveToLS(listOfTodos);
  }

  if (window.matchMedia('(max-width: 710px)').matches) {
    headerEvents.hideMenu();
    menuEvents.addRemoveEventsRelatingToMenu();
  }
  headerEvents.changeNewTodoBtnOnResize();
  listOfTodos.forEach((todo) => todoFormEvents.addTodoCtnEvents(todo));
  listOfPjs.forEach((pj) => menuEvents.addPJMenuItemEvents(pj));
  menuEvents.showToday();
})();

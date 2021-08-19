import helpers from './helpers.js';
import { listOfTodos } from './Projects-Todo.js';

const content = (() => {
  const main = document.getElementById('content');
  const mainCtns = []; // all ctns, does not include sections ie 'Today', 'Upcoming' not 'Overdue' or sections in upcoming
  const allCtns = [];

  const ctnMethods = {
    checkSectionView() {
      return !!this.sectionView;
    },
    changeCommentBtn(status) {
      if (!this.actions.commentBtn) return; // sections don't have comment buttons
      const commentIcon = this.actions.commentBtn.querySelector('i');
      switch (status) {
        case 'empty':
          commentIcon.classList.remove('flaticon-comment-1');
          break;
        case 'not empty':
          commentIcon.classList.add('flaticon-comment-1');
          break;
      }
    },
    fillTodoList(list) {
      this.todoArray = list;
      const fragment = document.createDocumentFragment();
      list.forEach((todo) => fragment.appendChild(todo.ctn));
      this.todoList.prepend(fragment);
    },
    removeTodos() {
      const todoCtns = this.main.querySelectorAll('.todo-ctn');
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
        const aDate = new Date(a.day);
        const bDate = new Date(b.day);

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
        const fragment = document.createDocumentFragment();
        // need to place todos in correct position after adding a todo
        this.todoArray.forEach((todo) => todo.ctn.remove());
        this.todoArray.forEach((todo) => fragment.appendChild(todo.ctn));
        if (this.todoBtn) {
          helpers.show(this.todoBtn);
          fragment.appendChild(this.todoBtn);
        }
        this.todoList.appendChild(fragment);
      }.call(this));

      return this;
    },
  };

  const create = {
    ctn(ctnEl, className, name, titleTag, todoList = true, todoBtn = true) {
      const ctn = Object.create(ctnMethods);
      ctn.main = document.createElement(ctnEl);
      ctn.main.classList.add(className);
      if (name) ctn.main.id = `${name}-ctn`;

      ctn.header = create.header();
      const headerContentObj = create.headerContentObj(titleTag);
      ctn.headerContent = headerContentObj.ctn;
      ctn.header.appendChild(ctn.headerContent);
      ctn.title = headerContentObj.title;

      ctn.main.appendChild(ctn.header);

      if (todoList) {
        ctn.todoArray = [];
        ctn.todoList = create.todoList();
        ctn.main.appendChild(ctn.todoList);
      }
      if (todoBtn) {
        ctn.todoBtn = create.todoBtn();
        ctn.todoList.appendChild(ctn.todoBtn);
      }

      if (className === 'main-ctn') mainCtns.push(ctn);
      allCtns.push(ctn);

      return ctn;
    },
    header() {
      const header = document.createElement('header');
      header.classList.add('view-header', 'view-content');
      return header;
    },
    headerContentObj(titleTag) {
      const ctn = document.createElement('div');
      ctn.classList.add('view-header-content');

      const title = document.createElement(titleTag);
      title.classList.add('content-title');
      ctn.appendChild(title);

      return {
        ctn: ctn,
        title: title,
      };
    },
    todoBtn() {
      const btn = document.createElement('button');
      btn.classList.add('btn', 'new-todo-btn');

      const icon = document.createElement('i');
      icon.classList.add('flaticon', 'flaticon-plus');

      const text = document.createElement('span');
      text.classList.add('add-todo-btn-text');
      text.textContent = 'Add todo';

      btn.appendChild(icon);
      btn.appendChild(text);

      return btn;
    },
    actionCtn() {
      const ctn = document.createElement('div');
      ctn.classList.add('action-ctn');
      return ctn;
    },
    actionBtns(id, ctn, ...btns) {
      const obj = {};

      if (btns.includes('sort')) {
        const sortedBtn = create.iconBtn('flaticon', 'sorted-btn', '', id);
        sortedBtn.classList.add('inactive');
        const sortedBtnIcon = sortedBtn.querySelector('.flaticon');
        const sortedBtnText = sortedBtn.querySelector('.btn-text');

        const sortBtn = create.iconBtn('flaticon-sort', 'sort-btn', 'Sort', id);
        obj.sortedBtn = sortedBtn;
        obj.sortedBtnIcon = sortedBtnIcon;
        obj.sortedBtnText = sortedBtnText;
        obj.sortBtn = sortBtn;
      }

      if (btns.includes('comment')) {
        const commentBtn = create.iconBtn(
          'flaticon-comment',
          'comment-btn',
          'Comments'
        );
        obj.commentBtn = commentBtn;
      }

      if (btns.includes('delete')) {
        const deleteBtn = create.iconBtn(
          'flaticon-trash',
          'delete-btn',
          'Delete',
          id
        );
        obj.deleteBtn = deleteBtn;
      }

      if (btns.includes('edit')) {
        const editBtn = create.iconBtn('flaticon-pen', 'edit-btn', 'Edit', id);
        obj.editBtn = editBtn;
      }

      for (const btnKey in obj) {
        if (btnKey.endsWith('Btn')) ctn.appendChild(obj[btnKey]);
      }

      return obj;
    },
    iconBtn(iconName, className, str, id) {
      const btn = helpers.createIconBtn(iconName, className);

      const text = document.createElement('span');
      text.classList.add('btn-text');
      text.textContent = str;
      btn.appendChild(text);

      btn.dataset.id = `${id}-${str}`;

      return btn;
    },
    todoList() {
      const todoList = document.createElement('ul');
      todoList.classList.add('todo-list', 'view-content');
      return todoList;
    },
    sections(number, sectionHolder, sectionArr, todoBtn = true) {
      for (let i = 0; i < number; i++) {
        const ctn = create.ctn(
          'section',
          'section-ctn',
          '',
          'h2',
          true,
          todoBtn
        );
        ctn.header.setAttribute('class', 'section-header section-content');
        ctn.headerContent.setAttribute('class', 'section-header-content');
        sectionArr.push(ctn);
        sectionHolder.appendChild(ctn.main);
        if (number === 1) return ctn;
      }
    },
    todayCtnObj() {
      const todayCtn = create.ctn('div', 'main-ctn', 'today', 'h1');

      todayCtn.sections = [];
      todayCtn.sectionView = false;
      todayCtn.sectionHolder = document.createElement('div');

      todayCtn.overdueSection = create.sections(
        1,
        todayCtn.sectionHolder,
        todayCtn.sections,
        false
      );
      todayCtn.overdueSection.title.textContent = 'Overdue';
      todayCtn.todaySection = create.sections(
        1,
        todayCtn.sectionHolder,
        todayCtn.sections,
        true
      );

      todayCtn.todaySection.title.textContent = 'Today';
      const todayStr = new Date().toString().slice(0, 10);
      todayCtn.title.innerHTML = `<span>Today</span><small>${todayStr}</small>`;

      const todayCtnActionCtn = create.actionCtn();
      todayCtn.actions = create.actionBtns(
        todayCtn.main.id,
        todayCtnActionCtn,
        'sort'
      );

      todayCtn.main.appendChild(todayCtn.sectionHolder);
      todayCtn.headerContent.appendChild(todayCtnActionCtn);

      return todayCtn;
    },
    upcomingCtnObj() {
      const upcomingCtn = create.ctn(
        'div',
        'main-ctn',
        'upcoming',
        'h1',
        false,
        false
      );

      upcomingCtn.title.textContent = 'Upcoming';

      const upcomingCtnActionCtn = create.actionCtn();
      upcomingCtn.actions = create.actionBtns(
        upcomingCtn.main.id,
        upcomingCtnActionCtn,
        'sort'
      );
      upcomingCtn.headerContent.appendChild(upcomingCtnActionCtn);

      upcomingCtn.sectionHolder = document.createElement('div');
      upcomingCtn.sections = [];
      upcomingCtn.sectionView = true;
      create.sections(7, upcomingCtn.sectionHolder, upcomingCtn.sections);
      upcomingCtn.main.appendChild(upcomingCtn.sectionHolder);

      upcomingCtn.refresh = function () {
        this.sections.forEach((section) => {
          const todos = listOfTodos.filter(
            // eslint-disable-next-line eqeqeq
            (item) => item.day == section.todoList.dataset.dateStr
          );
          if (!todos[0]) return section.title.classList.add('empty');
          todos.forEach((todo) => section.todoList.prepend(todo.ctn));
          section.todoList.appendChild(section.todoBtn);
        });
      };

      return upcomingCtn;
    },
    pjCtnObj() {
      const pjCtn = create.ctn('div', 'main-ctn', 'pj', 'h1');

      pjCtn.editor = helpers.createPJEditor('header-title-input');
      pjCtn.headerContent.appendChild(pjCtn.editor.ctn);

      const pjCtnActionCtn = create.actionCtn();
      pjCtn.actions = create.actionBtns(
        pjCtn.main.id,
        pjCtnActionCtn,
        'sort',
        'edit',
        'comment',
        'delete'
      );
      pjCtn.headerContent.appendChild(pjCtnActionCtn);

      pjCtn.refreshTitle = function (list) {
        const pj = helpers.findItem(mainCtns, pjCtn.main.dataset.project);
        pjCtn.title.textContent = pj.title;
        helpers.show(this.title);
        helpers.hide(this.editor.ctn);
        return this;
      };

      pjCtn.setDataProject = function (id) {
        pjCtn.main.dataset.project = id;
        const btnKeys = Object.keys(pjCtn).filter((key) => key.endsWith('Btn'));

        btnKeys.forEach((key) => (pjCtn[key].dataset.project = id));
      };

      return pjCtn;
    },
    searchCtnObj() {
      const searchCtn = create.ctn(
        'div',
        'main-ctn',
        'search',
        'h1',
        false,
        false
      );

      searchCtn.sections = [];
      searchCtn.sectionHolder = document.createElement('div');
      searchCtn.main.appendChild(searchCtn.sectionHolder);

      searchCtn.projectSection = create.sections(
        1,
        searchCtn.sectionHolder,
        searchCtn.sections,
        false
      );
      searchCtn.projectSection.title.textContent = 'Projects';

      searchCtn.todoSection = create.sections(
        1,
        searchCtn.sectionHolder,
        searchCtn.sections,
        false
      );
      searchCtn.todoSection.title.textContent = 'Todos';

      return searchCtn;
    },
  };

  return {
    main,
    mainCtns,
    allCtns,
    pjCtn: create.pjCtnObj(),
    todayCtn: create.todayCtnObj(),
    upcomingCtn: create.upcomingCtnObj(),
    searchCtn: create.searchCtnObj(),
    findActiveCtn() {
      return mainCtns.find((ctn) => this.main.contains(ctn.main));
    },
    removeActiveCtn() {
      const activeCtn = this.findActiveCtn();
      if (!activeCtn) return;
      activeCtn.main.remove();
      activeCtn.hideSortedBtn().removeTodos();
      return activeCtn;
    },
  };
})();

export { content };

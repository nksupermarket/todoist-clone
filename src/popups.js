import helpers from './helpers.js';

const popups = (() => {
  const modal = document.getElementById('popup-modal');
  const list = [];

  const popupMethods = {
    show() {
      popups.hide();
      helpers.show(modal);
      helpers.show(this.ctn);
      return this;
    },
    setDataBtn(value) {
      this.ctn.dataset.btn = value;
      return this;
    },
    position(btn) {
      const btnPos = btn.getBoundingClientRect();

      const btnCenter = findBtnCenter();
      const btnBottom = btn.getBoundingClientRect().bottom;
      const popupCenter = findPopupCenter.call(this);
      this.ctn.style.left = `${btnCenter - popupCenter}px`;
      this.ctn.style.top = `${btnBottom + 8}px`;
      removePopupOverflow.call(this);

      function removePopupOverflow() {
        const browserWidth = document.documentElement.clientWidth;
        const popupCtn = this.ctn.querySelector('.popup-ctn');
        const newPos = this.ctn.getBoundingClientRect();
        if (newPos.right > browserWidth) {
          popupCtn.style.right = `${newPos.right - browserWidth}px`;
        }
      }

      function findBtnCenter() {
        const btnWidth = btn.offsetWidth;
        const center = btnPos.left + btnWidth / 2;
        return center;
      }

      function findPopupCenter() {
        const popupWidth = this.ctn.offsetWidth;
        const center = popupWidth / 2;
        return center;
      }
    },
  };

  function createPopup(name) {
    const popup = Object.create(popupMethods);
    popup.ctn = modal.querySelector(`#${name}-popup`);
    list.push(popup);

    return popup;
  }

  const priority = createPopup('priority');
  priority.btns = priority.ctn.querySelectorAll('li');
  priority.setActive = function (priorityLevel) {
    this.removeActive();
    const btn = this.ctn.querySelector(`[data-value="${priorityLevel}"]`);
    btn.classList.add('active');
  };
  priority.removeActive = function () {
    const active = this.ctn.querySelector('.active');
    active.classList.remove('active');
  };
  priority.reset = function () {
    this.btns.forEach((btn) => btn.classList.remove('active'));
    const priority4 = this.ctn.querySelector(`[data-value="4"]`);
    priority4.classList.add('active');
  };

  const comment = createPopup('comment');
  comment.textarea = comment.ctn.querySelector('textarea');
  comment.closeBtn = comment.ctn.querySelector('.close-btn');
  comment.reset = function () {
    this.textarea.value = '';
  };

  const sort = createPopup('sort');
  sort.dateBtn = sort.ctn.querySelector('#sort-date-btn');
  sort.priorityBtn = sort.ctn.querySelector('#sort-priority-btn');
  sort.alphabetBtn = sort.ctn.querySelector('#sort-alphabet-btn');

  const del = createPopup('delete');
  del.text = del.ctn.querySelector('.delete-popup-text');
  del.deleteBtn = del.ctn.querySelector('.delete-act-btn');
  del.cancelBtn = del.ctn.querySelector('.cancel-act-btn');
  del.updateText = function (str) {
    this.text.textContent = `Are you sure you want to delete ${str}?`;
  };
  del.setDataItemType = function (str) {
    this.ctn.dataset.itemType = str;
  };
  del.setDataItemID = function (str) {
    this.ctn.dataset.itemId = str;
  };

  const pjActions = createPopup('pj-actions');
  pjActions.listHolder = pjActions.ctn.querySelector('ul');
  pjActions.editBtn = createpjActionsListItem(
    'flaticon-pen',
    'edit-pj-btn',
    'Edit'
  );
  pjActions.deleteBtn = createpjActionsListItem(
    'flaticon-trash',
    'delete-pj-btn',
    'Delete Project'
  );
  pjActions.listHolder.appendChild(pjActions.editBtn);
  pjActions.listHolder.appendChild(pjActions.deleteBtn);
  pjActions.setDataProject = function (id) {
    pjActions.ctn.dataset.project = id;
  };

  function createpjActionsListItem(iconName, className, str) {
    const listItem = document.createElement('li');
    listItem.classList.add('btn', 'pj-actions-list-btn', className);

    const icon = document.createElement('i');
    icon.classList.add('flaticon', iconName);

    listItem.textContent = str;

    listItem.prepend(icon);

    return listItem;
  }

  return {
    modal,
    priority,
    comment,
    sort,
    del,
    pjActions,
    hide() {
      helpers.hide(modal);
      list.forEach((popup) => {
        helpers.hide(popup.ctn);
      });
      this.modal.classList.remove('modal-full');
    },
    findActivePopup() {
      return list.find((popup) => !popup.ctn.classList.contains('inactive'));
    },
    toggleModalFull() {
      this.modal.classList.toggle('modal-full');
    },
  };
})();

export { popups };

import helpers from './helpers.js';

const commentModal = (() => {
  return {
    modal: document.querySelector('.comment-modal'),
    commentList: document.querySelector('.comment-list'),
    closeBtn: document.querySelector('.close-btn'),
    pjTitle: document.querySelector('.project-title'),
    todoTitle: document.querySelector('.todo-title'),
    addBtn: document.querySelector('.add-comment-btn'),
    form: document.querySelector('.comment-editor'),
    textarea: document.querySelector('#modal-textarea'),
    noNotesNote: document.querySelector('#no-notes-note'),
    setDataItemType(str) {
      this.form.dataset.itemType = str;
    },
    setDataItemID(id) {
      this.form.dataset.itemId = id;
    },
    changePjTitle(str) {
      this.pjTitle.textContent = str;
    },
    changeTodoTitle(str) {
      this.todoTitle.textContent = str;
    },
    attachNote(note, date) {
      const myLineBreak = note.replace(/\r\n|\r|\n/g, '</br>');

      if (
        this.commentList.lastChild &&
        this.commentList.lastChild.dataset.date === date
      )
        return displayNoNotes();

      const noteCtn = document.createElement('div');
      noteCtn.dataset.date = date;
      noteCtn.classList.add('note');

      const dateText = createDateEl();
      const noteText = createNote();

      noteCtn.appendChild(dateText);
      noteCtn.appendChild(noteText);

      this.commentList.appendChild(noteCtn);

      // helper functions
      function displayNoNotes() {
        const noteText = this.commentList.lastChild.querySelector('.note-text');
        return (noteText.innerHTML += '<br>' + myLineBreak);
      }

      function createDateEl() {
        const dateText = document.createElement('p');
        dateText.classList.add('note-date');
        dateText.textContent = date;
        return dateText;
      }

      function createNote() {
        const noteText = document.createElement('p');
        noteText.classList.add('note-text');
        noteText.innerHTML = myLineBreak;
        return noteText;
      }
    },
    showNoNotesNote() {
      helpers.show(this.noNotesNote);
    },
    hideNoNotesNote() {
      helpers.hide(this.noNotesNote);
    },
    close() {
      helpers.hide(this.modal);
      this.form.dataset.itemType = '';
      this.form.dataset.itemId = '';
      this.commentList.textContent = '';
      this.textarea.value = '';
    },
  };
})();

export { commentModal };

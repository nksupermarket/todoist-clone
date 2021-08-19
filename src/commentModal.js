import helpers from './helpers.js';

const commentModal = (() => {
  const modal = document.querySelector('.comment-modal');
  const form = modal.querySelector('#add-comment');
  const commentList = modal.querySelector('.comment-list');
  const closeBtn = modal.querySelector('.close-btn');
  const pjTitle = modal.querySelector('.project-title');
  const todoTitle = modal.querySelector('.todo-title');
  const addBtn = modal.querySelector('.add-comment-btn');
  const textarea = form.querySelector('textarea');
  const noNotesNote = form.querySelector('#no-notes-note');

  return {
    modal,
    form,
    closeBtn,
    addBtn,
    pjTitle,
    todoTitle,
    textarea,
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
        commentList.lastChild &&
        commentList.lastChild.dataset.date === date
      ) {
        const noteText = commentList.lastChild.querySelector('.note-text');
        return (noteText.innerHTML += '<br>' + myLineBreak);
      }
      const noteCtn = document.createElement('div');
      noteCtn.dataset.date = date;
      noteCtn.classList.add('note');
      const dateText = document.createElement('p');
      dateText.classList.add('note-date');
      dateText.textContent = date;
      const noteText = document.createElement('p');
      noteText.classList.add('note-text');
      noteText.innerHTML = myLineBreak;
      noteCtn.appendChild(dateText);
      noteCtn.appendChild(noteText);
      commentList.appendChild(noteCtn);
    },
    showNoNotesNote() {
      helpers.show(noNotesNote);
    },
    hideNoNotesNote() {
      helpers.hide(noNotesNote);
    },
    close() {
      helpers.hide(modal);
      this.form.dataset.itemType = '';
      this.form.dataset.itemId = '';
      commentList.textContent = '';
      this.textarea.value = '';
    },
  };
})();

export { commentModal };

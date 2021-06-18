export { helpers };

const helpers = (() => ({
  pushTo(list, obj) {
    list.push(obj);
  },
  show(el) {
    el.classList.remove("inactive");
  },
  hide(el) {
    el.classList.add("inactive");
  },
  findItem(list, id) {
    return list.find((item) => item.id.toString() === id.toString());
  },
  findTodoFrom(btn, list) {
    var hyphen = btn.dataset.id.search("-");
    var todoId = btn.dataset.id.slice(hyphen + 1);
    var todo = helpers.findItem(list, todoId);
    return todo;
  },
  createIconBtn(iconName, className) {
    var btn = document.createElement("button");
    btn.classList.add("btn", "icon-btn", className);

    var icon = document.createElement("i");
    icon.classList.add("flaticon", iconName);
    btn.prepend(icon);

    return btn;
  },
  createPJEditor(className) {
    const ctn = document.createElement("div");
    ctn.classList.add("inactive", "pj-editor");

    const titleInput = document.createElement("input");
    titleInput.classList.add("title-input", className);
    ctn.appendChild(titleInput);

    const editorActions = document.createElement("div");
    editorActions.classList.add("editor-actions");
    ctn.appendChild(editorActions);

    const saveBtn = document.createElement("button");
    saveBtn.classList.add("btn", "act-btn", "save-btn");
    saveBtn.setAttribute("type", "button");
    saveBtn.textContent = "Save";
    editorActions.appendChild(saveBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("btn", "act-btn", "cancel-btn");
    cancelBtn.setAttribute("type", "button");
    cancelBtn.textContent = "Cancel";
    editorActions.appendChild(cancelBtn);

    return {
      ctn,
      titleInput,
      editorActions,
      saveBtn,
      cancelBtn,
    };
  },
}))();

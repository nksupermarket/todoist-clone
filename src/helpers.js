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
}))();

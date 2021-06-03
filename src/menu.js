export { menu };

const menu = (() => {
  var menu = document.getElementById("menu");
  var today = menu.querySelector("#today-menu");
  var upcoming = menu.querySelector("#upcoming-menu");
  var form = menu.querySelector("#new-pj-form");
  var newBtn = menu.querySelector("#new-pj-btn");
  var addBtn = menu.querySelector("#add-pj-btn");
  var cancelBtn = menu.querySelector("#cancel-pj-btn");

  var titleInput = document.querySelector("#new-pj-form input[name=pj-title]");

  var pjListItems = menu.querySelectorAll(".pj-list-item");

  return {
    today,
    upcoming,
    form,
    titleInput,
    newBtn,
    addBtn,
    cancelBtn,
    pjListItems,
  };
})();

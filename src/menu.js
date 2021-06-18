import { helpers } from "./helpers.js";

export { menu };

const menu = (() => {
  const ctn = document.getElementById("menu");
  const today = ctn.querySelector("#today-menu");
  const upcoming = ctn.querySelector("#upcoming-menu");
  const form = ctn.querySelector("#new-pj-form");
  const newBtn = ctn.querySelector("#new-pj-btn");
  const addBtn = ctn.querySelector("#add-pj-btn");
  const cancelBtn = ctn.querySelector("#cancel-pj-btn");
  const titleInput = document.querySelector(
    "#new-pj-form input[name=pj-title]"
  );
  const editor = helpers.createPJEditor("menu-title-input");

  return {
    ctn,
    today,
    upcoming,
    form,
    titleInput,
    newBtn,
    addBtn,
    cancelBtn,
    editor,
  };
})();

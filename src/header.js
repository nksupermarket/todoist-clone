export { header };

const header = (() => {
  const ctn = document.getElementById("header");
  const menuBtn = ctn.querySelector("#menu-btn");
  const todoBtn = ctn.querySelector(".new-todo-btn");

  return {
    ctn,
    menuBtn,
    todoBtn,
  };
})();

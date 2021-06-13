export { header };

const header = (() => {
  const ctn = document.getElementById("header");
  const todoBtn = ctn.querySelector(".new-todo-btn");

  return {
    ctn,
    todoBtn,
  };
})();

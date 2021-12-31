const header = (() => {
  const ctn = document.getElementById('header');
  const menuBtn = ctn.querySelector('#menu-btn');
  const todoBtn = ctn.querySelector('.new-todo-btn');
  const search = ctn.querySelector('input[name=searchbar]');

  return {
    ctn,
    menuBtn,
    todoBtn,
    search,
  };
})();

export { header };

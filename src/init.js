import { listOfPjs, pjFact, listOfTodos } from "./projects.js";
import { samples } from "./samples.js";
import { menuEvents, todoFormEvents, popupEvents } from "./dom.js";

export { init };

const init = (() => {
  function pullFromLS(item) {
    switch (item) {
      case "projects": {
        return localStorage.listOfPjs
          ? JSON.parse(localStorage.getItem("listOfPjs"))
          : listOfPjs;
        break;
      }
      case "todos": {
        return localStorage.listOfTodos
          ? JSON.parse(localStorage.getItem("listOfTodos"))
          : listOfTodos;
        break;
      }
    }
  }
  listOfPjs = pullFromLS("projects");
  listOfTodos = pullFromLS("todos");
  const pjWork = pjFact.createProject("Work");
  const pjHome = pjFact.createProject("Home");
  const pjCode = pjFact.createProject("Code");

  pjWork.pushToList();
  pjHome.pushToList();
  pjCode.pushToList();

  listOfPjs.forEach((pj) => pj.addToMenu());

  samples.generate(50);
  listOfTodos.forEach((todo) => todoFormEvents.addTodoCtnEvents(todo));
  (function addEventsToPJMenuItems() {
    listOfPjs.forEach((pj) => {
      pj.menuItem.addEventListener("click", (e) => {
        const menuItem = e.target.closest("li");
        const pjId = menuItem.dataset.project;
        menuEvents.showPj(pjId);
      });
      pj.menuItem.addEventListener("mouseover", (e) =>
        menuEvents.showActionsBtn(e)
      );
      pj.menuItem.addEventListener("mouseleave", (e) =>
        menuEvents.hideActionsBtn(e)
      );
      const moreBtn = pj.menuItem.querySelector(".more-btn");
      moreBtn.addEventListener("click", (e) => {
        popupEvents.showPJActionsPopup(e, moreBtn);
      });
      moreBtn.addEventListener("click", (e) => e.stopPropagation());
    });
  })();

  menuEvents.showToday();
})();

import { listOfTodos, listOfPjs, todoFact } from "./projects.js";
export { samples };

const samples = (() => {
  return {
    generate(quantity) {
      for (var i = 0; i < quantity; i++) {
        var project = getRandomProject();
        var title = `sample todo ${i}`;
        var day = "2021-05-28";
        var priority = getRandomPriority();
        var notes = { text: [], date: [] };

        var newTodo = todoFact.createTodo(project, title, day, priority, notes);
        newTodo.pushToList();
        newTodo.pushToProject();
        newTodo.appendContent();
        function getRandomProject() {
          var randomIndex = Math.floor(Math.random() * listOfPjs.length);
          return listOfPjs[randomIndex].id;
        }
        function getRandomDay() {
          var currentYear = new Date().getFullYear();
          var yearBegin = new Date(currentYear, 0, 1);
          var yearEnd = new Date(currentYear, 11, 31);
          var randomDay = new Date(
            yearBegin.getTime() +
              Math.random() * (yearEnd.getTime() - yearBegin.getTime())
          );

          var randomDayMonth = randomDay.getMonth() + 1;
          if (randomDayMonth.toString().length != 2)
            randomDayMonth = `0${randomDayMonth}`;
          var randomDayDay = randomDay.getDate();
          if (randomDayDay.toString().length != 2)
            randomDayDay = `0${randomDayDay}`;

          var randomDayStr = `${currentYear}-${randomDayMonth}-${randomDayDay}`;
          return randomDayStr;
        }
      }
      function getRandomPriority() {
        return Math.floor(Math.random() * 4 + 1).toString();
      }
    },
  };
})();

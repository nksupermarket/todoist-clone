import { listOfPjs, todoFact } from "./projects.js";
export { samples };

const samples = (() => {
  return {
    generate(quantity) {
      for (var i = 0; i < quantity; i++) {
        const project = getRandomProject();
        const title = `sample todo ${i}`;
        const day = getRandomDay();
        const priority = getRandomPriority();
        const notes = { text: [], date: [] };

        const newTodo = todoFact.createTodo(
          project,
          title,
          day,
          priority,
          notes
        );
        newTodo.pushToList().pushToProject().appendContent();
        function getRandomProject() {
          const randomIndex = Math.floor(Math.random() * listOfPjs.length);
          return listOfPjs[randomIndex].id;
        }
        function getRandomDay() {
          const currentYear = new Date().getFullYear();
          let today = new Date();
          let todayDay = today.getDate();
          let yesterday = new Date();
          yesterday.setDate(todayDay - 1);
          let nextWeek = new Date();
          nextWeek.setDate(todayDay + 7);
          const randomDay = new Date(
            yesterday.getTime() +
              Math.random() * (nextWeek.getTime() - yesterday.getTime())
          );
          console.log(yesterday.getDate(), randomDay);

          let randomDayMonth = randomDay.getMonth() + 1;
          if (randomDayMonth.toString().length != 2)
            randomDayMonth = `0${randomDayMonth}`;
          let randomDayDay = randomDay.getDate();
          if (randomDayDay.toString().length != 2)
            randomDayDay = `0${randomDayDay}`;

          const randomDayStr = `${currentYear}-${randomDayMonth}-${randomDayDay}`;
          return randomDayStr;
        }
      }
      function getRandomPriority() {
        return Math.floor(Math.random() * 4 + 1).toString();
      }
    },
  };
})();

export { today };

const today = (() => {
  return {
    getToday() {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      if (month.toString().length === 1) month = "0".concat(month.toString());
      const day = today.getDate();
      if (day.toString().length === 1) day = "0".concat(day.toString());
      const todayStr = `${year}-${month}-${day}`;
      return todayStr;
    },
    getTodayTodos(list) {
      const today = this.getToday();
      const todoList = list.filter((item) => {
        if (item.priority === "5") return false;
        return item.day == today;
      });
      return todoList;
    },
    getOverdueTodos(list) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todoList = list.filter((item) => {
        if (item.priority === "5") return false;
        const dueDay = new Date(item.day + " 00:00");
        return dueDay < today;
      });
      return todoList;
    },
  };
})();

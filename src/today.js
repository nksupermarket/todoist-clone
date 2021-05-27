export { today };

const today = (() => {
  return {
    getToday() {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      if (month.toString().length === 1) month = "0".concat(month.toString());
      var day = today.getDate();
      if (day.toString().length === 1) day = "0".concat(day.toString());
      var todayStr = `${year}-${month}-${day}`;
      return todayStr;
    },
  };
  //   function getTodaytodos() {
  //     listOftodos.filter((todo) => {
  //       return todoForm.day === todayStr;
  //     });
  //   }
})();

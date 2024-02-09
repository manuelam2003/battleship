/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/

async function getWeather(location="Sevilla"){
    const response = await fetch("http://api.weatherapi.com/v1/current.json?key=65704d5121124e30b38144030240102&q="+location);
    const data = await response.json();
    return data.current;
}



async function filterData(){
    const currentWeather = await getWeather();
    console.log(currentWeather);
    console.log(currentWeather.gust_kph);
}

filterData();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5hc3luYyBmdW5jdGlvbiBnZXRXZWF0aGVyKGxvY2F0aW9uPVwiU2V2aWxsYVwiKXtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9jdXJyZW50Lmpzb24/a2V5PTY1NzA0ZDUxMjExMjRlMzBiMzgxNDQwMzAyNDAxMDImcT1cIitsb2NhdGlvbik7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gZGF0YS5jdXJyZW50O1xufVxuXG5cblxuYXN5bmMgZnVuY3Rpb24gZmlsdGVyRGF0YSgpe1xuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gYXdhaXQgZ2V0V2VhdGhlcigpO1xuICAgIGNvbnNvbGUubG9nKGN1cnJlbnRXZWF0aGVyKTtcbiAgICBjb25zb2xlLmxvZyhjdXJyZW50V2VhdGhlci5ndXN0X2twaCk7XG59XG5cbmZpbHRlckRhdGEoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
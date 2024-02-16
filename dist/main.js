/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/Gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/Gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ship */ "./src/modules/Ship.js");

const SIZE = 10;
class Gameboard {
  constructor() {
    this.board = [];
    this.missedShots = [];
    this.shots = [];
    this.initialize();
  }
  initialize() {
    for (let i = 0; i < SIZE; i++) {
      this.board[i] = [];
      this.missedShots[i] = [];
      this.shots[i] = [];
      for (let j = 0; j < SIZE; j++) {
        this.board[i][j] = null;
        this.missedShots[i][j] = false;
        this.shots[i][j] = false;
      }
    }
  }
  placeShip(ship, row, column, isVertical) {
    if (!this.isPlacementPossible(ship, row, column, isVertical)) {
      console.log("Cant place ship here");
      return false;
    }
    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        this.board[row + i][column] = ship;
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        this.board[row][column + i] = ship;
      }
    }
    // console.log(`Placed a ship ${ship} in row ${row} and col ${column}`);
    return true;
  }
  placeShipsRandomly() {
    if (!this.isEmpty()) return;
    const ships = [];
    ships.push(new _Ship__WEBPACK_IMPORTED_MODULE_0__["default"](5), new _Ship__WEBPACK_IMPORTED_MODULE_0__["default"](4), new _Ship__WEBPACK_IMPORTED_MODULE_0__["default"](3), new _Ship__WEBPACK_IMPORTED_MODULE_0__["default"](3), new _Ship__WEBPACK_IMPORTED_MODULE_0__["default"](2));
    let succesfulPlacements = 0;
    while (succesfulPlacements < 5) {
      const row = Math.floor(Math.random() * SIZE);
      const column = Math.floor(Math.random() * SIZE);
      const isVertical = Math.random() < 0.5;
      if (this.placeShip(ships[succesfulPlacements], row, column, isVertical)) {
        succesfulPlacements++;
      }
    }
  }
  receiveAttack(row, column) {
    if (row < 0 || row >= SIZE || column < 0 || column >= SIZE) {
      return false;
    }
    this.shots[row][column] = true;
    if (this.board[row][column]) {
      let hitIndex = 0;
      // is horizontal
      if (column > 0 && this.board[row][column - 1]) {
        let i = 1;
        while (column - i >= 0 && this.board[row][column - i]) {
          hitIndex++;
          i++;
        }
      }
      // is vertical
      else if (row > 0 && this.board[row - 1][column]) {
        let i = 1;
        while (row - i >= 0 && this.board[row - i][column]) {
          hitIndex++;
          i++;
        }
      }
      this.board[row][column].hit(hitIndex);
      return true;
    }
    this.missedShots[row][column] = true;
    return false;
  }
  isPlacementPossible(ship, row, column, isVertical) {
    // position out of gameboard
    if (row < 0 || row >= SIZE || column < 0 || column >= SIZE) {
      return false;
    }
    if (isVertical) {
      //   ship doesn't fit in the gameboard
      if (row + ship.length > SIZE) return false;
      //   any of the fields is taken
      for (let i = 0; i < ship.length; i++) {
        if (this.board[row + i][column] !== null) {
          return false;
        }
      }
      // any of neighbours cells is taken
      for (let i = 0; i < ship.length; i++) {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (row + x + i < 0 || row + x + i >= SIZE || column + y < 0 || column + y >= SIZE) {
              continue;
            }
            if (this.board[row + x + i][column + y]) return false;
          }
        }
      }
    } else {
      if (column + ship.length > SIZE) return false;
      for (let i = 0; i < ship.length; i++) {
        if (this.board[row][column + i] !== null) {
          return false;
        }
      }
      for (let i = 0; i < ship.length; i++) {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (row + x < 0 || row + x >= SIZE || column + y + i < 0 || column + y + i >= SIZE) continue;
            if (this.board[row + x][column + y + i]) return false;
          }
        }
      }
    }
    return true;
  }
  isGameOver() {
    let isBoardEmpty = true;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j]) {
          isBoardEmpty = false;
          if (!this.board[i][j].isSunk()) {
            return false;
          }
        }
      }
    }
    return !isBoardEmpty;
  }
  isEmpty() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j] !== null) return false;
      }
    }
    return true;
  }
  getEmptyFieldsAmount() {
    let result = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j] === null) result++;
      }
    }
    return result;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Player {
  constructor(name) {
    this.name = name;
    this.alreadyHit = [];
    this.lastHit = null;
  }
  attack(posX, posY, gameboard) {
    if (this.hasAlreadyHit(posX, posY)) return false;
    this.alreadyHit.push([posX, posY]);
    return gameboard.receiveAttack(posX, posY);
  }
  randomAttack(gameboard) {
    if (this.alreadyHit.length === 100) return;
    let posX;
    let posY;
    let probableSpots = [];
    if (this.lastHit) {
      probableSpots = this.attacksAroundPoint(this.lastHit[0], this.lastHit[1]);
      const [curPosX, curPosY] = probableSpots.shift();
      posX = curPosX;
      posY = curPosY;
    } else {
      posX = Math.floor(Math.random() * 10);
      posY = Math.floor(Math.random() * 10);
    }
    while (this.hasAlreadyHit(posX, posY)) {
      if (probableSpots.length > 0) {
        const [curPosX, curPosY] = probableSpots.shift();
        posX = curPosX;
        posY = curPosY;
      } else {
        posX = Math.floor(Math.random() * 10);
        posY = Math.floor(Math.random() * 10);
      }
    }
    if (this.attack(posX, posY, gameboard)) {
      this.lastHit = [posX, posY];
    }
  }

  // eslint-disable-next-line class-methods-use-this
  attacksAroundPoint(posX, posY) {
    const arrayOfPos = [[posX, posY - 1], [posX, posY + 1], [posX - 1, posY], [posX + 1, posY]];
    if (posX === 0) {
      arrayOfPos.splice(2, 1);
    }
    if (posY === 0) {
      arrayOfPos.splice(0, 1);
    }
    if (posX === 9) {
      arrayOfPos.splice(3, 1);
    }
    if (posY === 9) {
      arrayOfPos.splice(1, 1);
    }
    console.log(arrayOfPos);
    return arrayOfPos;
  }
  hasAlreadyHit(posX, posY) {
    for (let i = 0; i < this.alreadyHit.length; i++) {
      if (this.alreadyHit[i][0] === posX && this.alreadyHit[i][1] === posY) {
        return true;
      }
    }
    return false;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/modules/Ship.js":
/*!*****************************!*\
  !*** ./src/modules/Ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = [];
  }
  hit(pos) {
    if (this.hits.includes(pos) || pos < 0 || pos >= this.length) {
      return;
    }
    this.hits.push(pos);
  }
  isSunk() {
    return this.hits.length === this.length;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./src/modules/dom.js":
/*!****************************!*\
  !*** ./src/modules/dom.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearBoards: () => (/* binding */ clearBoards),
/* harmony export */   createBoardElement: () => (/* binding */ createBoardElement),
/* harmony export */   displayBoard: () => (/* binding */ displayBoard)
/* harmony export */ });
// eslint-disable-next-line import/prefer-default-export
function createBoardElement(name) {
  const board = document.createElement("div");
  board.classList.add("board");
  board.id = `board${name}`;
  // Create the rows and columns
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 10; j++) {
      const col = document.createElement("div");
      col.classList.add("field");
      if (name === "P") {
        col.classList.add("playerField");
      } else {
        col.classList.add("aiField");
      }
      col.id = `${name}${i}${j}`;
      row.appendChild(col);
    }
    board.appendChild(row);
  }
  return board;
}
function clearBoards() {
  const cells = document.querySelectorAll(".field");
  cells.forEach(cell => {
    const currentCell = cell;
    currentCell.style.backgroundColor = "white";
  });
}
function displayBoard(gameboard, name) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const el = document.querySelector(`#${name}${i}${j}`);
      //   el.textContent = `${name}${i}${j}`;
      if (gameboard.board[i][j] && !gameboard.shots[i][j] && name === "P") {
        el.style.backgroundColor = "gray";
      }
      if (gameboard.missedShots[i][j]) {
        el.style.backgroundColor = "lightgray";
      }
      if (gameboard.board[i][j] && gameboard.shots[i][j]) {
        el.style.backgroundColor = "darkred";
      }
      if (gameboard.board[i][j] && gameboard.board[i][j].isSunk()) {
        el.style.backgroundColor = "red";
      }
    }
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Gameboard */ "./src/modules/Gameboard.js");
/* harmony import */ var _modules_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/dom */ "./src/modules/dom.js");
/* harmony import */ var _modules_Ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/Ship */ "./src/modules/Ship.js");
/* harmony import */ var _modules_Player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/Player */ "./src/modules/Player.js");
/* eslint-disable no-use-before-define */




let boardPlayer;
let boardAi;
let lens;
let initialGame = true;
let orientationIsVertical = true;
const bot = new _modules_Player__WEBPACK_IMPORTED_MODULE_3__["default"]();
function initializeDom() {
  const container = document.getElementById("boards");
  container.appendChild((0,_modules_dom__WEBPACK_IMPORTED_MODULE_1__.createBoardElement)("P"));
  container.appendChild((0,_modules_dom__WEBPACK_IMPORTED_MODULE_1__.createBoardElement)("A"));
}
function addShip(e) {
  const id = e.target.getAttribute("id").split("");
  id.shift();
  const coords = id.map(i => parseInt(i, 10));
  if (lens.length > 0 && boardPlayer.placeShip(new _modules_Ship__WEBPACK_IMPORTED_MODULE_2__["default"](lens[0]), coords[0], coords[1], orientationIsVertical)) {
    if (lens.length === 1) allowPlayerAttack();
    (0,_modules_dom__WEBPACK_IMPORTED_MODULE_1__.displayBoard)(boardPlayer, "P");
    lens.shift();
  }
}
function allowPlayerAttack() {
  const content = document.querySelector("#content");
  content.textContent = "sink your opponent";
  const cells = document.querySelectorAll(".aiField");
  cells.forEach(cell => {
    cell.addEventListener("click", checkAttackSuccess);
  });
}
function checkAttackSuccess(e) {
  const id = e.target.getAttribute("id").split("");
  id.shift();
  const coords = id.map(i => parseInt(i, 10));
  if (boardAi.shots[coords[0]][coords[1]]) return;
  boardAi.receiveAttack(coords[0], coords[1]);
  (0,_modules_dom__WEBPACK_IMPORTED_MODULE_1__.displayBoard)(boardAi, "A");
  if (boardAi.isGameOver()) {
    displayWinner("human");
  }
  allowBotAttack();
}
function allowBotAttack() {
  bot.randomAttack(boardPlayer);
  (0,_modules_dom__WEBPACK_IMPORTED_MODULE_1__.displayBoard)(boardPlayer, "P");
  if (boardPlayer.isGameOver()) {
    displayWinner("AI");
  }
}
function removeEventListeners() {
  let cells = document.querySelectorAll(".playerField");
  cells.forEach(cell => {
    cell.removeEventListener("click", addShip);
  });
  cells = document.querySelectorAll(".aiField");
  cells.forEach(cell => {
    cell.removeEventListener("click", checkAttackSuccess);
  });
}
function displayWinner(winner) {
  const content = document.querySelector("#content");
  content.textContent = `${winner} is the winner!`;
  removeEventListeners();
  setTimeout(() => {
    (0,_modules_dom__WEBPACK_IMPORTED_MODULE_1__.clearBoards)();
    setup();
  }, 5000);
}
function getPlayerMoves() {
  const cells = document.querySelectorAll(".playerField");
  cells.forEach(cell => {
    cell.addEventListener("click", addShip);
  });
}
function setup() {
  if (initialGame) {
    initializeDom();
    initialGame = false;
  }
  boardPlayer = new _modules_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
  boardAi = new _modules_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
  boardAi.placeShipsRandomly();
  console.log(boardAi.board);
  lens = [2, 3, 3, 4, 5];
  const content = document.querySelector("#content");
  content.textContent = "place your 5 ships below";
  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    if (orientationIsVertical) {
      button.textContent = "Vertical";
      orientationIsVertical = false;
    } else {
      button.textContent = "Horizontal";
      orientationIsVertical = true;
    }
  });
  getPlayerMoves();
}
setup();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFDZixJQUFJekIsV0FBVyxFQUFFO0lBQ2ZHLGFBQWEsQ0FBQyxDQUFDO0lBQ2ZILFdBQVcsR0FBRyxLQUFLO0VBQ3JCO0VBQ0FILFdBQVcsR0FBRyxJQUFJMUUsMERBQVMsQ0FBQyxDQUFDO0VBQzdCMkUsT0FBTyxHQUFHLElBQUkzRSwwREFBUyxDQUFDLENBQUM7RUFDekIyRSxPQUFPLENBQUMxRCxrQkFBa0IsQ0FBQyxDQUFDO0VBRTVCSCxPQUFPLENBQUNDLEdBQUcsQ0FBQzRELE9BQU8sQ0FBQ3pFLEtBQUssQ0FBQztFQUMxQjBFLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsTUFBTWdCLE9BQU8sR0FBR3BDLFFBQVEsQ0FBQ2lCLGFBQWEsQ0FBQyxVQUFVLENBQUM7RUFDbERtQixPQUFPLENBQUNDLFdBQVcsR0FBRywwQkFBMEI7RUFFaEQsTUFBTVcsTUFBTSxHQUFHaEQsUUFBUSxDQUFDaUIsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUMvQytCLE1BQU0sQ0FBQ1YsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDckMsSUFBSWhCLHFCQUFxQixFQUFFO01BQ3pCMEIsTUFBTSxDQUFDWCxXQUFXLEdBQUcsVUFBVTtNQUMvQmYscUJBQXFCLEdBQUcsS0FBSztJQUMvQixDQUFDLE1BQU07TUFDTDBCLE1BQU0sQ0FBQ1gsV0FBVyxHQUFHLFlBQVk7TUFDakNmLHFCQUFxQixHQUFHLElBQUk7SUFDOUI7RUFDRixDQUFDLENBQUM7RUFDRnlCLGNBQWMsQ0FBQyxDQUFDO0FBQ2xCO0FBRUFELEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tIFwiLi9TaGlwXCI7XG5cbmNvbnN0IFNJWkUgPSAxMDtcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLnNob3RzID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICB0aGlzLmJvYXJkW2ldID0gW107XG4gICAgICB0aGlzLm1pc3NlZFNob3RzW2ldID0gW107XG4gICAgICB0aGlzLnNob3RzW2ldID0gW107XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICB0aGlzLmJvYXJkW2ldW2pdID0gbnVsbDtcbiAgICAgICAgdGhpcy5taXNzZWRTaG90c1tpXVtqXSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3RzW2ldW2pdID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSB7XG4gICAgaWYgKCF0aGlzLmlzUGxhY2VtZW50UG9zc2libGUoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNhbnQgcGxhY2Ugc2hpcCBoZXJlXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2x1bW5dID0gc2hpcDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gKyBpXSA9IHNoaXA7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGBQbGFjZWQgYSBzaGlwICR7c2hpcH0gaW4gcm93ICR7cm93fSBhbmQgY29sICR7Y29sdW1ufWApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcGxhY2VTaGlwc1JhbmRvbWx5KCkge1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHJldHVybjtcblxuICAgIGNvbnN0IHNoaXBzID0gW107XG4gICAgc2hpcHMucHVzaChuZXcgU2hpcCg1KSwgbmV3IFNoaXAoNCksIG5ldyBTaGlwKDMpLCBuZXcgU2hpcCgzKSwgbmV3IFNoaXAoMikpO1xuXG4gICAgbGV0IHN1Y2Nlc2Z1bFBsYWNlbWVudHMgPSAwO1xuICAgIHdoaWxlIChzdWNjZXNmdWxQbGFjZW1lbnRzIDwgNSkge1xuICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogU0laRSk7XG4gICAgICBjb25zdCBjb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBTSVpFKTtcbiAgICAgIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXG4gICAgICBpZiAodGhpcy5wbGFjZVNoaXAoc2hpcHNbc3VjY2VzZnVsUGxhY2VtZW50c10sIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSkge1xuICAgICAgICBzdWNjZXNmdWxQbGFjZW1lbnRzKys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayhyb3csIGNvbHVtbikge1xuICAgIGlmIChyb3cgPCAwIHx8IHJvdyA+PSBTSVpFIHx8IGNvbHVtbiA8IDAgfHwgY29sdW1uID49IFNJWkUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sdW1uXSkge1xuICAgICAgbGV0IGhpdEluZGV4ID0gMDtcbiAgICAgIC8vIGlzIGhvcml6b250YWxcbiAgICAgIGlmIChjb2x1bW4gPiAwICYmIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gLSAxXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChjb2x1bW4gLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3ddW2NvbHVtbiAtIGldKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlzIHZlcnRpY2FsXG4gICAgICBlbHNlIGlmIChyb3cgPiAwICYmIHRoaXMuYm9hcmRbcm93IC0gMV1bY29sdW1uXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChyb3cgLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3cgLSBpXVtjb2x1bW5dKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2x1bW5dLmhpdChoaXRJbmRleCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5taXNzZWRTaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzUGxhY2VtZW50UG9zc2libGUoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpIHtcbiAgICAvLyBwb3NpdGlvbiBvdXQgb2YgZ2FtZWJvYXJkXG4gICAgaWYgKHJvdyA8IDAgfHwgcm93ID49IFNJWkUgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4gPj0gU0laRSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgLy8gICBzaGlwIGRvZXNuJ3QgZml0IGluIHRoZSBnYW1lYm9hcmRcbiAgICAgIGlmIChyb3cgKyBzaGlwLmxlbmd0aCA+IFNJWkUpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vICAgYW55IG9mIHRoZSBmaWVsZHMgaXMgdGFrZW5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3cgKyBpXVtjb2x1bW5dICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBhbnkgb2YgbmVpZ2hib3VycyBjZWxscyBpcyB0YWtlblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAtMTsgeCA8PSAxOyB4KyspIHtcbiAgICAgICAgICBmb3IgKGxldCB5ID0gLTE7IHkgPD0gMTsgeSsrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHJvdyArIHggKyBpIDwgMCB8fFxuICAgICAgICAgICAgICByb3cgKyB4ICsgaSA+PSBTSVpFIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgPCAwIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgPj0gU0laRVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgeCArIGldW2NvbHVtbiArIHldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2x1bW4gKyBzaGlwLmxlbmd0aCA+IFNJWkUpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbHVtbiArIGldICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IC0xOyB4IDw9IDE7IHgrKykge1xuICAgICAgICAgIGZvciAobGV0IHkgPSAtMTsgeSA8PSAxOyB5KyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcm93ICsgeCA8IDAgfHxcbiAgICAgICAgICAgICAgcm93ICsgeCA+PSBTSVpFIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgKyBpIDwgMCB8fFxuICAgICAgICAgICAgICBjb2x1bW4gKyB5ICsgaSA+PSBTSVpFXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgeF1bY29sdW1uICsgeSArIGldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICBsZXQgaXNCb2FyZEVtcHR5ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNJWkU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBTSVpFOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0pIHtcbiAgICAgICAgICBpc0JvYXJkRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoIXRoaXMuYm9hcmRbaV1bal0uaXNTdW5rKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICFpc0JvYXJkRW1wdHk7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSAhPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldEVtcHR5RmllbGRzQW1vdW50KCkge1xuICAgIGxldCByZXN1bHQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSA9PT0gbnVsbCkgcmVzdWx0Kys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5hbHJlYWR5SGl0ID0gW107XG4gICAgdGhpcy5sYXN0SGl0ID0gbnVsbDtcbiAgfVxuXG4gIGF0dGFjayhwb3NYLCBwb3NZLCBnYW1lYm9hcmQpIHtcbiAgICBpZiAodGhpcy5oYXNBbHJlYWR5SGl0KHBvc1gsIHBvc1kpKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5hbHJlYWR5SGl0LnB1c2goW3Bvc1gsIHBvc1ldKTtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socG9zWCwgcG9zWSk7XG4gIH1cblxuICByYW5kb21BdHRhY2soZ2FtZWJvYXJkKSB7XG4gICAgaWYgKHRoaXMuYWxyZWFkeUhpdC5sZW5ndGggPT09IDEwMCkgcmV0dXJuO1xuICAgIGxldCBwb3NYO1xuICAgIGxldCBwb3NZO1xuICAgIGxldCBwcm9iYWJsZVNwb3RzID0gW107XG4gICAgaWYgKHRoaXMubGFzdEhpdCkge1xuICAgICAgcHJvYmFibGVTcG90cyA9IHRoaXMuYXR0YWNrc0Fyb3VuZFBvaW50KHRoaXMubGFzdEhpdFswXSwgdGhpcy5sYXN0SGl0WzFdKTtcbiAgICAgIGNvbnN0IFtjdXJQb3NYLCBjdXJQb3NZXSA9IHByb2JhYmxlU3BvdHMuc2hpZnQoKTtcbiAgICAgIHBvc1ggPSBjdXJQb3NYO1xuICAgICAgcG9zWSA9IGN1clBvc1k7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc1ggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBwb3NZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIH1cbiAgICB3aGlsZSAodGhpcy5oYXNBbHJlYWR5SGl0KHBvc1gsIHBvc1kpKSB7XG4gICAgICBpZiAocHJvYmFibGVTcG90cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IFtjdXJQb3NYLCBjdXJQb3NZXSA9IHByb2JhYmxlU3BvdHMuc2hpZnQoKTtcbiAgICAgICAgcG9zWCA9IGN1clBvc1g7XG4gICAgICAgIHBvc1kgPSBjdXJQb3NZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgcG9zWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYXR0YWNrKHBvc1gsIHBvc1ksIGdhbWVib2FyZCkpIHtcbiAgICAgIHRoaXMubGFzdEhpdCA9IFtwb3NYLCBwb3NZXTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBhdHRhY2tzQXJvdW5kUG9pbnQocG9zWCwgcG9zWSkge1xuICAgIGNvbnN0IGFycmF5T2ZQb3MgPSBbXG4gICAgICBbcG9zWCwgcG9zWSAtIDFdLFxuICAgICAgW3Bvc1gsIHBvc1kgKyAxXSxcbiAgICAgIFtwb3NYIC0gMSwgcG9zWV0sXG4gICAgICBbcG9zWCArIDEsIHBvc1ldLFxuICAgIF07XG4gICAgaWYgKHBvc1ggPT09IDApIHtcbiAgICAgIGFycmF5T2ZQb3Muc3BsaWNlKDIsIDEpO1xuICAgIH1cbiAgICBpZiAocG9zWSA9PT0gMCkge1xuICAgICAgYXJyYXlPZlBvcy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuICAgIGlmIChwb3NYID09PSA5KSB7XG4gICAgICBhcnJheU9mUG9zLnNwbGljZSgzLCAxKTtcbiAgICB9XG4gICAgaWYgKHBvc1kgPT09IDkpIHtcbiAgICAgIGFycmF5T2ZQb3Muc3BsaWNlKDEsIDEpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhhcnJheU9mUG9zKTtcbiAgICByZXR1cm4gYXJyYXlPZlBvcztcbiAgfVxuXG4gIGhhc0FscmVhZHlIaXQocG9zWCwgcG9zWSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbHJlYWR5SGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5hbHJlYWR5SGl0W2ldWzBdID09PSBwb3NYICYmIHRoaXMuYWxyZWFkeUhpdFtpXVsxXSA9PT0gcG9zWSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmhpdHMgPSBbXTtcbiAgfVxuXG4gIGhpdChwb3MpIHtcbiAgICBpZiAodGhpcy5oaXRzLmluY2x1ZGVzKHBvcykgfHwgcG9zIDwgMCB8fCBwb3MgPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5oaXRzLnB1c2gocG9zKTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5oaXRzLmxlbmd0aCA9PT0gdGhpcy5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQm9hcmRFbGVtZW50KG5hbWUpIHtcbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG4gIGJvYXJkLmlkID0gYGJvYXJkJHtuYW1lfWA7XG4gIC8vIENyZWF0ZSB0aGUgcm93cyBhbmQgY29sdW1uc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgY29uc3QgY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNvbC5jbGFzc0xpc3QuYWRkKFwiZmllbGRcIik7XG4gICAgICBpZiAobmFtZSA9PT0gXCJQXCIpIHtcbiAgICAgICAgY29sLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJGaWVsZFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbC5jbGFzc0xpc3QuYWRkKFwiYWlGaWVsZFwiKTtcbiAgICAgIH1cbiAgICAgIGNvbC5pZCA9IGAke25hbWV9JHtpfSR7an1gO1xuXG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY29sKTtcbiAgICB9XG4gICAgYm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcbiAgfVxuICByZXR1cm4gYm9hcmQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckJvYXJkcygpIHtcbiAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpZWxkXCIpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgY3VycmVudENlbGwgPSBjZWxsO1xuICAgIGN1cnJlbnRDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5Qm9hcmQoZ2FtZWJvYXJkLCBuYW1lKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtuYW1lfSR7aX0ke2p9YCk7XG4gICAgICAvLyAgIGVsLnRleHRDb250ZW50ID0gYCR7bmFtZX0ke2l9JHtqfWA7XG4gICAgICBpZiAoZ2FtZWJvYXJkLmJvYXJkW2ldW2pdICYmICFnYW1lYm9hcmQuc2hvdHNbaV1bal0gJiYgbmFtZSA9PT0gXCJQXCIpIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmF5XCI7XG4gICAgICB9XG4gICAgICBpZiAoZ2FtZWJvYXJkLm1pc3NlZFNob3RzW2ldW2pdKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwibGlnaHRncmF5XCI7XG4gICAgICB9XG4gICAgICBpZiAoZ2FtZWJvYXJkLmJvYXJkW2ldW2pdICYmIGdhbWVib2FyZC5zaG90c1tpXVtqXSkge1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImRhcmtyZWRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbaV1bal0gJiYgZ2FtZWJvYXJkLmJvYXJkW2ldW2pdLmlzU3VuaygpKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmVkXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL21vZHVsZXMvR2FtZWJvYXJkXCI7XG5pbXBvcnQgeyBjbGVhckJvYXJkcywgY3JlYXRlQm9hcmRFbGVtZW50LCBkaXNwbGF5Qm9hcmQgfSBmcm9tIFwiLi9tb2R1bGVzL2RvbVwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vbW9kdWxlcy9TaGlwXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL21vZHVsZXMvUGxheWVyXCI7XG5cbmxldCBib2FyZFBsYXllcjtcbmxldCBib2FyZEFpO1xubGV0IGxlbnM7XG5sZXQgaW5pdGlhbEdhbWUgPSB0cnVlO1xubGV0IG9yaWVudGF0aW9uSXNWZXJ0aWNhbCA9IHRydWU7XG5jb25zdCBib3QgPSBuZXcgUGxheWVyKCk7XG5mdW5jdGlvbiBpbml0aWFsaXplRG9tKCkge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkc1wiKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUJvYXJkRWxlbWVudChcIlBcIikpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRFbGVtZW50KFwiQVwiKSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNoaXAoZSkge1xuICBjb25zdCBpZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpLnNwbGl0KFwiXCIpO1xuICBpZC5zaGlmdCgpO1xuICBjb25zdCBjb29yZHMgPSBpZC5tYXAoKGkpID0+IHBhcnNlSW50KGksIDEwKSk7XG4gIGlmIChcbiAgICBsZW5zLmxlbmd0aCA+IDAgJiZcbiAgICBib2FyZFBsYXllci5wbGFjZVNoaXAoXG4gICAgICBuZXcgU2hpcChsZW5zWzBdKSxcbiAgICAgIGNvb3Jkc1swXSxcbiAgICAgIGNvb3Jkc1sxXSxcbiAgICAgIG9yaWVudGF0aW9uSXNWZXJ0aWNhbFxuICAgIClcbiAgKSB7XG4gICAgaWYgKGxlbnMubGVuZ3RoID09PSAxKSBhbGxvd1BsYXllckF0dGFjaygpO1xuICAgIGRpc3BsYXlCb2FyZChib2FyZFBsYXllciwgXCJQXCIpO1xuICAgIGxlbnMuc2hpZnQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvd1BsYXllckF0dGFjaygpIHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IFwic2luayB5b3VyIG9wcG9uZW50XCI7XG4gIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5haUZpZWxkXCIpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tBdHRhY2tTdWNjZXNzKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQXR0YWNrU3VjY2VzcyhlKSB7XG4gIGNvbnN0IGlkID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikuc3BsaXQoXCJcIik7XG4gIGlkLnNoaWZ0KCk7XG4gIGNvbnN0IGNvb3JkcyA9IGlkLm1hcCgoaSkgPT4gcGFyc2VJbnQoaSwgMTApKTtcblxuICBpZiAoYm9hcmRBaS5zaG90c1tjb29yZHNbMF1dW2Nvb3Jkc1sxXV0pIHJldHVybjtcblxuICBib2FyZEFpLnJlY2VpdmVBdHRhY2soY29vcmRzWzBdLCBjb29yZHNbMV0pO1xuICBkaXNwbGF5Qm9hcmQoYm9hcmRBaSwgXCJBXCIpO1xuICBpZiAoYm9hcmRBaS5pc0dhbWVPdmVyKCkpIHtcbiAgICBkaXNwbGF5V2lubmVyKFwiaHVtYW5cIik7XG4gIH1cbiAgYWxsb3dCb3RBdHRhY2soKTtcbn1cblxuZnVuY3Rpb24gYWxsb3dCb3RBdHRhY2soKSB7XG4gIGJvdC5yYW5kb21BdHRhY2soYm9hcmRQbGF5ZXIpO1xuICBkaXNwbGF5Qm9hcmQoYm9hcmRQbGF5ZXIsIFwiUFwiKTtcbiAgaWYgKGJvYXJkUGxheWVyLmlzR2FtZU92ZXIoKSkge1xuICAgIGRpc3BsYXlXaW5uZXIoXCJBSVwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgbGV0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5ZXJGaWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZFNoaXApO1xuICB9KTtcbiAgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFpRmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGVja0F0dGFja1N1Y2Nlc3MpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IGAke3dpbm5lcn0gaXMgdGhlIHdpbm5lciFgO1xuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNsZWFyQm9hcmRzKCk7XG4gICAgc2V0dXAoKTtcbiAgfSwgNTAwMCk7XG59XG5cbmZ1bmN0aW9uIGdldFBsYXllck1vdmVzKCkge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyRmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhZGRTaGlwKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBpZiAoaW5pdGlhbEdhbWUpIHtcbiAgICBpbml0aWFsaXplRG9tKCk7XG4gICAgaW5pdGlhbEdhbWUgPSBmYWxzZTtcbiAgfVxuICBib2FyZFBsYXllciA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgYm9hcmRBaSA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgYm9hcmRBaS5wbGFjZVNoaXBzUmFuZG9tbHkoKTtcblxuICBjb25zb2xlLmxvZyhib2FyZEFpLmJvYXJkKTtcbiAgbGVucyA9IFsyLCAzLCAzLCA0LCA1XTtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IFwicGxhY2UgeW91ciA1IHNoaXBzIGJlbG93XCI7XG5cbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaWYgKG9yaWVudGF0aW9uSXNWZXJ0aWNhbCkge1xuICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gXCJWZXJ0aWNhbFwiO1xuICAgICAgb3JpZW50YXRpb25Jc1ZlcnRpY2FsID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiSG9yaXpvbnRhbFwiO1xuICAgICAgb3JpZW50YXRpb25Jc1ZlcnRpY2FsID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBnZXRQbGF5ZXJNb3ZlcygpO1xufVxuXG5zZXR1cCgpO1xuIl0sIm5hbWVzIjpbIlNoaXAiLCJTSVpFIiwiR2FtZWJvYXJkIiwiY29uc3RydWN0b3IiLCJib2FyZCIsIm1pc3NlZFNob3RzIiwic2hvdHMiLCJpbml0aWFsaXplIiwiaSIsImoiLCJwbGFjZVNoaXAiLCJzaGlwIiwicm93IiwiY29sdW1uIiwiaXNWZXJ0aWNhbCIsImlzUGxhY2VtZW50UG9zc2libGUiLCJjb25zb2xlIiwibG9nIiwibGVuZ3RoIiwicGxhY2VTaGlwc1JhbmRvbWx5IiwiaXNFbXB0eSIsInNoaXBzIiwicHVzaCIsInN1Y2Nlc2Z1bFBsYWNlbWVudHMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJyZWNlaXZlQXR0YWNrIiwiaGl0SW5kZXgiLCJoaXQiLCJ4IiwieSIsImlzR2FtZU92ZXIiLCJpc0JvYXJkRW1wdHkiLCJpc1N1bmsiLCJnZXRFbXB0eUZpZWxkc0Ftb3VudCIsInJlc3VsdCIsIlBsYXllciIsIm5hbWUiLCJhbHJlYWR5SGl0IiwibGFzdEhpdCIsImF0dGFjayIsInBvc1giLCJwb3NZIiwiZ2FtZWJvYXJkIiwiaGFzQWxyZWFkeUhpdCIsInJhbmRvbUF0dGFjayIsInByb2JhYmxlU3BvdHMiLCJhdHRhY2tzQXJvdW5kUG9pbnQiLCJjdXJQb3NYIiwiY3VyUG9zWSIsInNoaWZ0IiwiYXJyYXlPZlBvcyIsInNwbGljZSIsImhpdHMiLCJwb3MiLCJpbmNsdWRlcyIsImNyZWF0ZUJvYXJkRWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImlkIiwiY29sIiwiYXBwZW5kQ2hpbGQiLCJjbGVhckJvYXJkcyIsImNlbGxzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJjZWxsIiwiY3VycmVudENlbGwiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImRpc3BsYXlCb2FyZCIsImVsIiwicXVlcnlTZWxlY3RvciIsImJvYXJkUGxheWVyIiwiYm9hcmRBaSIsImxlbnMiLCJpbml0aWFsR2FtZSIsIm9yaWVudGF0aW9uSXNWZXJ0aWNhbCIsImJvdCIsImluaXRpYWxpemVEb20iLCJjb250YWluZXIiLCJnZXRFbGVtZW50QnlJZCIsImFkZFNoaXAiLCJlIiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJjb29yZHMiLCJtYXAiLCJwYXJzZUludCIsImFsbG93UGxheWVyQXR0YWNrIiwiY29udGVudCIsInRleHRDb250ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNoZWNrQXR0YWNrU3VjY2VzcyIsImRpc3BsYXlXaW5uZXIiLCJhbGxvd0JvdEF0dGFjayIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIndpbm5lciIsInNldFRpbWVvdXQiLCJzZXR1cCIsImdldFBsYXllck1vdmVzIiwiYnV0dG9uIl0sInNvdXJjZVJvb3QiOiIifQ==
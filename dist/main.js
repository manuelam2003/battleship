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
  }
  attack(posX, posY, gameboard) {
    if (this.hasAlreadyHit(posX, posY)) return;
    this.alreadyHit.push([posX, posY]);
    gameboard.receiveAttack(posX, posY);
  }
  randomAttack(gameboard) {
    if (this.alreadyHit.length === 100) return;
    let posX = Math.floor(Math.random() * 10);
    let posY = Math.floor(Math.random() * 10);
    while (this.hasAlreadyHit(posX, posY)) {
      posX = Math.floor(Math.random() * 10);
      posY = Math.floor(Math.random() * 10);
    }
    this.attack(posX, posY, gameboard);
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
  // TODO: orientacion de los barcos
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

// revisar
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO0VBQ2xEb0IsT0FBTyxDQUFDQyxXQUFXLEdBQUcsMEJBQTBCO0VBRWhELE1BQU1XLE1BQU0sR0FBR2pELFFBQVEsQ0FBQ2lCLGFBQWEsQ0FBQyxRQUFRLENBQUM7RUFDL0NnQyxNQUFNLENBQUNWLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ3JDLElBQUlqQixxQkFBcUIsRUFBRTtNQUN6QjJCLE1BQU0sQ0FBQ1gsV0FBVyxHQUFHLFVBQVU7TUFDL0JoQixxQkFBcUIsR0FBRyxLQUFLO0lBQy9CLENBQUMsTUFBTTtNQUNMMkIsTUFBTSxDQUFDWCxXQUFXLEdBQUcsWUFBWTtNQUNqQ2hCLHFCQUFxQixHQUFHLElBQUk7SUFDOUI7RUFDRixDQUFDLENBQUM7RUFDRjBCLGNBQWMsQ0FBQyxDQUFDO0FBQ2xCO0FBRUFELEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tIFwiLi9TaGlwXCI7XG5cbmNvbnN0IFNJWkUgPSAxMDtcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLnNob3RzID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICB0aGlzLmJvYXJkW2ldID0gW107XG4gICAgICB0aGlzLm1pc3NlZFNob3RzW2ldID0gW107XG4gICAgICB0aGlzLnNob3RzW2ldID0gW107XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICB0aGlzLmJvYXJkW2ldW2pdID0gbnVsbDtcbiAgICAgICAgdGhpcy5taXNzZWRTaG90c1tpXVtqXSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3RzW2ldW2pdID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSB7XG4gICAgaWYgKCF0aGlzLmlzUGxhY2VtZW50UG9zc2libGUoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNhbnQgcGxhY2Ugc2hpcCBoZXJlXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2x1bW5dID0gc2hpcDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gKyBpXSA9IHNoaXA7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGBQbGFjZWQgYSBzaGlwICR7c2hpcH0gaW4gcm93ICR7cm93fSBhbmQgY29sICR7Y29sdW1ufWApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcGxhY2VTaGlwc1JhbmRvbWx5KCkge1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHJldHVybjtcblxuICAgIGNvbnN0IHNoaXBzID0gW107XG4gICAgc2hpcHMucHVzaChuZXcgU2hpcCg1KSwgbmV3IFNoaXAoNCksIG5ldyBTaGlwKDMpLCBuZXcgU2hpcCgzKSwgbmV3IFNoaXAoMikpO1xuXG4gICAgbGV0IHN1Y2Nlc2Z1bFBsYWNlbWVudHMgPSAwO1xuICAgIHdoaWxlIChzdWNjZXNmdWxQbGFjZW1lbnRzIDwgNSkge1xuICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogU0laRSk7XG4gICAgICBjb25zdCBjb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBTSVpFKTtcbiAgICAgIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXG4gICAgICBpZiAodGhpcy5wbGFjZVNoaXAoc2hpcHNbc3VjY2VzZnVsUGxhY2VtZW50c10sIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSkge1xuICAgICAgICBzdWNjZXNmdWxQbGFjZW1lbnRzKys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayhyb3csIGNvbHVtbikge1xuICAgIGlmIChyb3cgPCAwIHx8IHJvdyA+PSBTSVpFIHx8IGNvbHVtbiA8IDAgfHwgY29sdW1uID49IFNJWkUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sdW1uXSkge1xuICAgICAgbGV0IGhpdEluZGV4ID0gMDtcbiAgICAgIC8vIGlzIGhvcml6b250YWxcbiAgICAgIGlmIChjb2x1bW4gPiAwICYmIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gLSAxXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChjb2x1bW4gLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3ddW2NvbHVtbiAtIGldKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlzIHZlcnRpY2FsXG4gICAgICBlbHNlIGlmIChyb3cgPiAwICYmIHRoaXMuYm9hcmRbcm93IC0gMV1bY29sdW1uXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChyb3cgLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3cgLSBpXVtjb2x1bW5dKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2x1bW5dLmhpdChoaXRJbmRleCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5taXNzZWRTaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzUGxhY2VtZW50UG9zc2libGUoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpIHtcbiAgICAvLyBwb3NpdGlvbiBvdXQgb2YgZ2FtZWJvYXJkXG4gICAgaWYgKHJvdyA8IDAgfHwgcm93ID49IFNJWkUgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4gPj0gU0laRSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgLy8gICBzaGlwIGRvZXNuJ3QgZml0IGluIHRoZSBnYW1lYm9hcmRcbiAgICAgIGlmIChyb3cgKyBzaGlwLmxlbmd0aCA+IFNJWkUpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vICAgYW55IG9mIHRoZSBmaWVsZHMgaXMgdGFrZW5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3cgKyBpXVtjb2x1bW5dICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBhbnkgb2YgbmVpZ2hib3VycyBjZWxscyBpcyB0YWtlblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAtMTsgeCA8PSAxOyB4KyspIHtcbiAgICAgICAgICBmb3IgKGxldCB5ID0gLTE7IHkgPD0gMTsgeSsrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHJvdyArIHggKyBpIDwgMCB8fFxuICAgICAgICAgICAgICByb3cgKyB4ICsgaSA+PSBTSVpFIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgPCAwIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgPj0gU0laRVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgeCArIGldW2NvbHVtbiArIHldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2x1bW4gKyBzaGlwLmxlbmd0aCA+IFNJWkUpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbHVtbiArIGldICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IC0xOyB4IDw9IDE7IHgrKykge1xuICAgICAgICAgIGZvciAobGV0IHkgPSAtMTsgeSA8PSAxOyB5KyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcm93ICsgeCA8IDAgfHxcbiAgICAgICAgICAgICAgcm93ICsgeCA+PSBTSVpFIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgKyBpIDwgMCB8fFxuICAgICAgICAgICAgICBjb2x1bW4gKyB5ICsgaSA+PSBTSVpFXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgeF1bY29sdW1uICsgeSArIGldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICBsZXQgaXNCb2FyZEVtcHR5ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNJWkU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBTSVpFOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0pIHtcbiAgICAgICAgICBpc0JvYXJkRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoIXRoaXMuYm9hcmRbaV1bal0uaXNTdW5rKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICFpc0JvYXJkRW1wdHk7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSAhPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldEVtcHR5RmllbGRzQW1vdW50KCkge1xuICAgIGxldCByZXN1bHQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSA9PT0gbnVsbCkgcmVzdWx0Kys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5hbHJlYWR5SGl0ID0gW107XG4gIH1cblxuICBhdHRhY2socG9zWCwgcG9zWSwgZ2FtZWJvYXJkKSB7XG4gICAgaWYgKHRoaXMuaGFzQWxyZWFkeUhpdChwb3NYLCBwb3NZKSkgcmV0dXJuO1xuICAgIHRoaXMuYWxyZWFkeUhpdC5wdXNoKFtwb3NYLCBwb3NZXSk7XG4gICAgZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socG9zWCwgcG9zWSk7XG4gIH1cblxuICByYW5kb21BdHRhY2soZ2FtZWJvYXJkKSB7XG4gICAgaWYgKHRoaXMuYWxyZWFkeUhpdC5sZW5ndGggPT09IDEwMCkgcmV0dXJuO1xuICAgIGxldCBwb3NYID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIGxldCBwb3NZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuXG4gICAgd2hpbGUgKHRoaXMuaGFzQWxyZWFkeUhpdChwb3NYLCBwb3NZKSkge1xuICAgICAgcG9zWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIHBvc1kgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgfVxuICAgIHRoaXMuYXR0YWNrKHBvc1gsIHBvc1ksIGdhbWVib2FyZCk7XG4gIH1cblxuICBoYXNBbHJlYWR5SGl0KHBvc1gsIHBvc1kpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYWxyZWFkeUhpdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuYWxyZWFkeUhpdFtpXVswXSA9PT0gcG9zWCAmJiB0aGlzLmFscmVhZHlIaXRbaV1bMV0gPT09IHBvc1kpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5oaXRzID0gW107XG4gIH1cblxuICBoaXQocG9zKSB7XG4gICAgaWYgKHRoaXMuaGl0cy5pbmNsdWRlcyhwb3MpIHx8IHBvcyA8IDAgfHwgcG9zID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaGl0cy5wdXNoKHBvcyk7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGl0cy5sZW5ndGggPT09IHRoaXMubGVuZ3RoO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydFxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJvYXJkRWxlbWVudChuYW1lKSB7XG4gIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgYm9hcmQuY2xhc3NMaXN0LmFkZChcImJvYXJkXCIpO1xuICBib2FyZC5pZCA9IGBib2FyZCR7bmFtZX1gO1xuICAvLyBDcmVhdGUgdGhlIHJvd3MgYW5kIGNvbHVtbnNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICByb3cuY2xhc3NMaXN0LmFkZChcInJvd1wiKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb2wuY2xhc3NMaXN0LmFkZChcImZpZWxkXCIpO1xuICAgICAgaWYgKG5hbWUgPT09IFwiUFwiKSB7XG4gICAgICAgIGNvbC5jbGFzc0xpc3QuYWRkKFwicGxheWVyRmllbGRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2wuY2xhc3NMaXN0LmFkZChcImFpRmllbGRcIik7XG4gICAgICB9XG4gICAgICBjb2wuaWQgPSBgJHtuYW1lfSR7aX0ke2p9YDtcblxuICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XG4gICAgfVxuICAgIGJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XG4gIH1cbiAgcmV0dXJuIGJvYXJkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJCb2FyZHMoKSB7XG4gIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRDZWxsID0gY2VsbDtcbiAgICBjdXJyZW50Q2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheUJvYXJkKGdhbWVib2FyZCwgbmFtZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7bmFtZX0ke2l9JHtqfWApO1xuICAgICAgLy8gICBlbC50ZXh0Q29udGVudCA9IGAke25hbWV9JHtpfSR7an1gO1xuICAgICAgaWYgKGdhbWVib2FyZC5ib2FyZFtpXVtqXSAmJiAhZ2FtZWJvYXJkLnNob3RzW2ldW2pdICYmIG5hbWUgPT09IFwiUFwiKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JheVwiO1xuICAgICAgfVxuICAgICAgaWYgKGdhbWVib2FyZC5taXNzZWRTaG90c1tpXVtqXSkge1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xuICAgICAgfVxuICAgICAgaWYgKGdhbWVib2FyZC5ib2FyZFtpXVtqXSAmJiBnYW1lYm9hcmQuc2hvdHNbaV1bal0pIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJkYXJrcmVkXCI7XG4gICAgICB9XG4gICAgICBpZiAoZ2FtZWJvYXJkLmJvYXJkW2ldW2pdICYmIGdhbWVib2FyZC5ib2FyZFtpXVtqXS5pc1N1bmsoKSkge1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJlZFwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11c2UtYmVmb3JlLWRlZmluZSAqL1xuaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9tb2R1bGVzL0dhbWVib2FyZFwiO1xuaW1wb3J0IHsgY2xlYXJCb2FyZHMsIGNyZWF0ZUJvYXJkRWxlbWVudCwgZGlzcGxheUJvYXJkIH0gZnJvbSBcIi4vbW9kdWxlcy9kb21cIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL21vZHVsZXMvU2hpcFwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9tb2R1bGVzL1BsYXllclwiO1xuXG5sZXQgYm9hcmRQbGF5ZXI7XG5sZXQgYm9hcmRBaTtcbmxldCBsZW5zO1xubGV0IGluaXRpYWxHYW1lID0gdHJ1ZTtcbmxldCBvcmllbnRhdGlvbklzVmVydGljYWwgPSB0cnVlO1xuY29uc3QgYm90ID0gbmV3IFBsYXllcigpO1xuZnVuY3Rpb24gaW5pdGlhbGl6ZURvbSgpIHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZHNcIik7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjcmVhdGVCb2FyZEVsZW1lbnQoXCJQXCIpKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUJvYXJkRWxlbWVudChcIkFcIikpO1xufVxuXG5mdW5jdGlvbiBhZGRTaGlwKGUpIHtcbiAgY29uc3QgaWQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJpZFwiKS5zcGxpdChcIlwiKTtcbiAgaWQuc2hpZnQoKTtcbiAgY29uc3QgY29vcmRzID0gaWQubWFwKChpKSA9PiBwYXJzZUludChpLCAxMCkpO1xuICAvLyBUT0RPOiBvcmllbnRhY2lvbiBkZSBsb3MgYmFyY29zXG4gIGlmIChcbiAgICBsZW5zLmxlbmd0aCA+IDAgJiZcbiAgICBib2FyZFBsYXllci5wbGFjZVNoaXAoXG4gICAgICBuZXcgU2hpcChsZW5zWzBdKSxcbiAgICAgIGNvb3Jkc1swXSxcbiAgICAgIGNvb3Jkc1sxXSxcbiAgICAgIG9yaWVudGF0aW9uSXNWZXJ0aWNhbFxuICAgIClcbiAgKSB7XG4gICAgaWYgKGxlbnMubGVuZ3RoID09PSAxKSBhbGxvd1BsYXllckF0dGFjaygpO1xuICAgIGRpc3BsYXlCb2FyZChib2FyZFBsYXllciwgXCJQXCIpO1xuICAgIGxlbnMuc2hpZnQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvd1BsYXllckF0dGFjaygpIHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IFwic2luayB5b3VyIG9wcG9uZW50XCI7XG4gIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5haUZpZWxkXCIpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tBdHRhY2tTdWNjZXNzKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQXR0YWNrU3VjY2VzcyhlKSB7XG4gIGNvbnN0IGlkID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikuc3BsaXQoXCJcIik7XG4gIGlkLnNoaWZ0KCk7XG4gIGNvbnN0IGNvb3JkcyA9IGlkLm1hcCgoaSkgPT4gcGFyc2VJbnQoaSwgMTApKTtcblxuICBpZiAoYm9hcmRBaS5zaG90c1tjb29yZHNbMF1dW2Nvb3Jkc1sxXV0pIHJldHVybjtcblxuICBib2FyZEFpLnJlY2VpdmVBdHRhY2soY29vcmRzWzBdLCBjb29yZHNbMV0pO1xuICBkaXNwbGF5Qm9hcmQoYm9hcmRBaSwgXCJBXCIpO1xuICBpZiAoYm9hcmRBaS5pc0dhbWVPdmVyKCkpIHtcbiAgICBkaXNwbGF5V2lubmVyKFwiaHVtYW5cIik7XG4gIH1cbiAgYWxsb3dCb3RBdHRhY2soKTtcbn1cblxuLy8gcmV2aXNhclxuZnVuY3Rpb24gYWxsb3dCb3RBdHRhY2soKSB7XG4gIGJvdC5yYW5kb21BdHRhY2soYm9hcmRQbGF5ZXIpO1xuICBkaXNwbGF5Qm9hcmQoYm9hcmRQbGF5ZXIsIFwiUFwiKTtcbiAgaWYgKGJvYXJkUGxheWVyLmlzR2FtZU92ZXIoKSkge1xuICAgIGRpc3BsYXlXaW5uZXIoXCJBSVwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgbGV0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5ZXJGaWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZFNoaXApO1xuICB9KTtcbiAgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFpRmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGVja0F0dGFja1N1Y2Nlc3MpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IGAke3dpbm5lcn0gaXMgdGhlIHdpbm5lciFgO1xuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNsZWFyQm9hcmRzKCk7XG4gICAgc2V0dXAoKTtcbiAgfSwgNTAwMCk7XG59XG5cbmZ1bmN0aW9uIGdldFBsYXllck1vdmVzKCkge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyRmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhZGRTaGlwKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBpZiAoaW5pdGlhbEdhbWUpIHtcbiAgICBpbml0aWFsaXplRG9tKCk7XG4gICAgaW5pdGlhbEdhbWUgPSBmYWxzZTtcbiAgfVxuICBib2FyZFBsYXllciA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgYm9hcmRBaSA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgYm9hcmRBaS5wbGFjZVNoaXBzUmFuZG9tbHkoKTtcblxuICBjb25zb2xlLmxvZyhib2FyZEFpLmJvYXJkKTtcbiAgbGVucyA9IFsyLCAzLCAzLCA0LCA1XTtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IFwicGxhY2UgeW91ciA1IHNoaXBzIGJlbG93XCI7XG5cbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaWYgKG9yaWVudGF0aW9uSXNWZXJ0aWNhbCkge1xuICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gXCJWZXJ0aWNhbFwiO1xuICAgICAgb3JpZW50YXRpb25Jc1ZlcnRpY2FsID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiSG9yaXpvbnRhbFwiO1xuICAgICAgb3JpZW50YXRpb25Jc1ZlcnRpY2FsID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBnZXRQbGF5ZXJNb3ZlcygpO1xufVxuXG5zZXR1cCgpO1xuIl0sIm5hbWVzIjpbIlNoaXAiLCJTSVpFIiwiR2FtZWJvYXJkIiwiY29uc3RydWN0b3IiLCJib2FyZCIsIm1pc3NlZFNob3RzIiwic2hvdHMiLCJpbml0aWFsaXplIiwiaSIsImoiLCJwbGFjZVNoaXAiLCJzaGlwIiwicm93IiwiY29sdW1uIiwiaXNWZXJ0aWNhbCIsImlzUGxhY2VtZW50UG9zc2libGUiLCJjb25zb2xlIiwibG9nIiwibGVuZ3RoIiwicGxhY2VTaGlwc1JhbmRvbWx5IiwiaXNFbXB0eSIsInNoaXBzIiwicHVzaCIsInN1Y2Nlc2Z1bFBsYWNlbWVudHMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJyZWNlaXZlQXR0YWNrIiwiaGl0SW5kZXgiLCJoaXQiLCJ4IiwieSIsImlzR2FtZU92ZXIiLCJpc0JvYXJkRW1wdHkiLCJpc1N1bmsiLCJnZXRFbXB0eUZpZWxkc0Ftb3VudCIsInJlc3VsdCIsIlBsYXllciIsIm5hbWUiLCJhbHJlYWR5SGl0IiwiYXR0YWNrIiwicG9zWCIsInBvc1kiLCJnYW1lYm9hcmQiLCJoYXNBbHJlYWR5SGl0IiwicmFuZG9tQXR0YWNrIiwiaGl0cyIsInBvcyIsImluY2x1ZGVzIiwiY3JlYXRlQm9hcmRFbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiaWQiLCJjb2wiLCJhcHBlbmRDaGlsZCIsImNsZWFyQm9hcmRzIiwiY2VsbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImNlbGwiLCJjdXJyZW50Q2VsbCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZGlzcGxheUJvYXJkIiwiZWwiLCJxdWVyeVNlbGVjdG9yIiwiYm9hcmRQbGF5ZXIiLCJib2FyZEFpIiwibGVucyIsImluaXRpYWxHYW1lIiwib3JpZW50YXRpb25Jc1ZlcnRpY2FsIiwiYm90IiwiaW5pdGlhbGl6ZURvbSIsImNvbnRhaW5lciIsImdldEVsZW1lbnRCeUlkIiwiYWRkU2hpcCIsImUiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJzcGxpdCIsInNoaWZ0IiwiY29vcmRzIiwibWFwIiwicGFyc2VJbnQiLCJhbGxvd1BsYXllckF0dGFjayIsImNvbnRlbnQiLCJ0ZXh0Q29udGVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjaGVja0F0dGFja1N1Y2Nlc3MiLCJkaXNwbGF5V2lubmVyIiwiYWxsb3dCb3RBdHRhY2siLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ3aW5uZXIiLCJzZXRUaW1lb3V0Iiwic2V0dXAiLCJnZXRQbGF5ZXJNb3ZlcyIsImJ1dHRvbiJdLCJzb3VyY2VSb290IjoiIn0=
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
  if (lens.length > 0 && boardPlayer.placeShip(new _modules_Ship__WEBPACK_IMPORTED_MODULE_2__["default"](lens[0]), coords[0], coords[1], true)) {
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
  // getBotMoves();
  getPlayerMoves();
}
setup();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LDBCQUEwQjtFQUNoRDtFQUNBVSxjQUFjLENBQUMsQ0FBQztBQUNsQjtBQUVBRCxLQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9TaGlwLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoaXAgZnJvbSBcIi4vU2hpcFwiO1xuXG5jb25zdCBTSVpFID0gMTA7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9hcmQgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107XG4gICAgdGhpcy5zaG90cyA9IFtdO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNJWkU7IGkrKykge1xuICAgICAgdGhpcy5ib2FyZFtpXSA9IFtdO1xuICAgICAgdGhpcy5taXNzZWRTaG90c1tpXSA9IFtdO1xuICAgICAgdGhpcy5zaG90c1tpXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBTSVpFOyBqKyspIHtcbiAgICAgICAgdGhpcy5ib2FyZFtpXVtqXSA9IG51bGw7XG4gICAgICAgIHRoaXMubWlzc2VkU2hvdHNbaV1bal0gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaG90c1tpXVtqXSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHBsYWNlU2hpcChzaGlwLCByb3csIGNvbHVtbiwgaXNWZXJ0aWNhbCkge1xuICAgIGlmICghdGhpcy5pc1BsYWNlbWVudFBvc3NpYmxlKHNoaXAsIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSkge1xuICAgICAgY29uc29sZS5sb2coXCJDYW50IHBsYWNlIHNoaXAgaGVyZVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuYm9hcmRbcm93ICsgaV1bY29sdW1uXSA9IHNoaXA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sdW1uICsgaV0gPSBzaGlwO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhgUGxhY2VkIGEgc2hpcCAke3NoaXB9IGluIHJvdyAke3Jvd30gYW5kIGNvbCAke2NvbHVtbn1gKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHBsYWNlU2hpcHNSYW5kb21seSgpIHtcbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSByZXR1cm47XG5cbiAgICBjb25zdCBzaGlwcyA9IFtdO1xuICAgIHNoaXBzLnB1c2gobmV3IFNoaXAoNSksIG5ldyBTaGlwKDQpLCBuZXcgU2hpcCgzKSwgbmV3IFNoaXAoMyksIG5ldyBTaGlwKDIpKTtcblxuICAgIGxldCBzdWNjZXNmdWxQbGFjZW1lbnRzID0gMDtcbiAgICB3aGlsZSAoc3VjY2VzZnVsUGxhY2VtZW50cyA8IDUpIHtcbiAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIFNJWkUpO1xuICAgICAgY29uc3QgY29sdW1uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogU0laRSk7XG4gICAgICBjb25zdCBpc1ZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcblxuICAgICAgaWYgKHRoaXMucGxhY2VTaGlwKHNoaXBzW3N1Y2Nlc2Z1bFBsYWNlbWVudHNdLCByb3csIGNvbHVtbiwgaXNWZXJ0aWNhbCkpIHtcbiAgICAgICAgc3VjY2VzZnVsUGxhY2VtZW50cysrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2socm93LCBjb2x1bW4pIHtcbiAgICBpZiAocm93IDwgMCB8fCByb3cgPj0gU0laRSB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbiA+PSBTSVpFKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuc2hvdHNbcm93XVtjb2x1bW5dID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbHVtbl0pIHtcbiAgICAgIGxldCBoaXRJbmRleCA9IDA7XG4gICAgICAvLyBpcyBob3Jpem9udGFsXG4gICAgICBpZiAoY29sdW1uID4gMCAmJiB0aGlzLmJvYXJkW3Jvd11bY29sdW1uIC0gMV0pIHtcbiAgICAgICAgbGV0IGkgPSAxO1xuICAgICAgICB3aGlsZSAoY29sdW1uIC0gaSA+PSAwICYmIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gLSBpXSkge1xuICAgICAgICAgIGhpdEluZGV4Kys7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpcyB2ZXJ0aWNhbFxuICAgICAgZWxzZSBpZiAocm93ID4gMCAmJiB0aGlzLmJvYXJkW3JvdyAtIDFdW2NvbHVtbl0pIHtcbiAgICAgICAgbGV0IGkgPSAxO1xuICAgICAgICB3aGlsZSAocm93IC0gaSA+PSAwICYmIHRoaXMuYm9hcmRbcm93IC0gaV1bY29sdW1uXSkge1xuICAgICAgICAgIGhpdEluZGV4Kys7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmJvYXJkW3Jvd11bY29sdW1uXS5oaXQoaGl0SW5kZXgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRoaXMubWlzc2VkU2hvdHNbcm93XVtjb2x1bW5dID0gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1BsYWNlbWVudFBvc3NpYmxlKHNoaXAsIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSB7XG4gICAgLy8gcG9zaXRpb24gb3V0IG9mIGdhbWVib2FyZFxuICAgIGlmIChyb3cgPCAwIHx8IHJvdyA+PSBTSVpFIHx8IGNvbHVtbiA8IDAgfHwgY29sdW1uID49IFNJWkUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIC8vICAgc2hpcCBkb2Vzbid0IGZpdCBpbiB0aGUgZ2FtZWJvYXJkXG4gICAgICBpZiAocm93ICsgc2hpcC5sZW5ndGggPiBTSVpFKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyAgIGFueSBvZiB0aGUgZmllbGRzIGlzIHRha2VuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgaV1bY29sdW1uXSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gYW55IG9mIG5laWdoYm91cnMgY2VsbHMgaXMgdGFrZW5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCB4ID0gLTE7IHggPD0gMTsgeCsrKSB7XG4gICAgICAgICAgZm9yIChsZXQgeSA9IC0xOyB5IDw9IDE7IHkrKykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICByb3cgKyB4ICsgaSA8IDAgfHxcbiAgICAgICAgICAgICAgcm93ICsgeCArIGkgPj0gU0laRSB8fFxuICAgICAgICAgICAgICBjb2x1bW4gKyB5IDwgMCB8fFxuICAgICAgICAgICAgICBjb2x1bW4gKyB5ID49IFNJWkVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3JvdyArIHggKyBpXVtjb2x1bW4gKyB5XSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sdW1uICsgc2hpcC5sZW5ndGggPiBTSVpFKSByZXR1cm4gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gKyBpXSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAtMTsgeCA8PSAxOyB4KyspIHtcbiAgICAgICAgICBmb3IgKGxldCB5ID0gLTE7IHkgPD0gMTsgeSsrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHJvdyArIHggPCAwIHx8XG4gICAgICAgICAgICAgIHJvdyArIHggPj0gU0laRSB8fFxuICAgICAgICAgICAgICBjb2x1bW4gKyB5ICsgaSA8IDAgfHxcbiAgICAgICAgICAgICAgY29sdW1uICsgeSArIGkgPj0gU0laRVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3JvdyArIHhdW2NvbHVtbiArIHkgKyBpXSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgbGV0IGlzQm9hcmRFbXB0eSA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTSVpFOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgU0laRTsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW2ldW2pdKSB7XG4gICAgICAgICAgaXNCb2FyZEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCF0aGlzLmJvYXJkW2ldW2pdLmlzU3VuaygpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAhaXNCb2FyZEVtcHR5O1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNJWkU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBTSVpFOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0gIT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXRFbXB0eUZpZWxkc0Ftb3VudCgpIHtcbiAgICBsZXQgcmVzdWx0ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNJWkU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBTSVpFOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0gPT09IG51bGwpIHJlc3VsdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuYWxyZWFkeUhpdCA9IFtdO1xuICB9XG5cbiAgYXR0YWNrKHBvc1gsIHBvc1ksIGdhbWVib2FyZCkge1xuICAgIGlmICh0aGlzLmhhc0FscmVhZHlIaXQocG9zWCwgcG9zWSkpIHJldHVybjtcbiAgICB0aGlzLmFscmVhZHlIaXQucHVzaChbcG9zWCwgcG9zWV0pO1xuICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHBvc1gsIHBvc1kpO1xuICB9XG5cbiAgcmFuZG9tQXR0YWNrKGdhbWVib2FyZCkge1xuICAgIGlmICh0aGlzLmFscmVhZHlIaXQubGVuZ3RoID09PSAxMDApIHJldHVybjtcbiAgICBsZXQgcG9zWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICBsZXQgcG9zWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblxuICAgIHdoaWxlICh0aGlzLmhhc0FscmVhZHlIaXQocG9zWCwgcG9zWSkpIHtcbiAgICAgIHBvc1ggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBwb3NZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIH1cbiAgICB0aGlzLmF0dGFjayhwb3NYLCBwb3NZLCBnYW1lYm9hcmQpO1xuICB9XG5cbiAgaGFzQWxyZWFkeUhpdChwb3NYLCBwb3NZKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFscmVhZHlIaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmFscmVhZHlIaXRbaV1bMF0gPT09IHBvc1ggJiYgdGhpcy5hbHJlYWR5SGl0W2ldWzFdID09PSBwb3NZKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuaGl0cyA9IFtdO1xuICB9XG5cbiAgaGl0KHBvcykge1xuICAgIGlmICh0aGlzLmhpdHMuaW5jbHVkZXMocG9zKSB8fCBwb3MgPCAwIHx8IHBvcyA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmhpdHMucHVzaChwb3MpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLmhpdHMubGVuZ3RoID09PSB0aGlzLmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnRcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCb2FyZEVsZW1lbnQobmFtZSkge1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiKTtcbiAgYm9hcmQuaWQgPSBgYm9hcmQke25hbWV9YDtcbiAgLy8gQ3JlYXRlIHRoZSByb3dzIGFuZCBjb2x1bW5zXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcm93LmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29sLmNsYXNzTGlzdC5hZGQoXCJmaWVsZFwiKTtcbiAgICAgIGlmIChuYW1lID09PSBcIlBcIikge1xuICAgICAgICBjb2wuY2xhc3NMaXN0LmFkZChcInBsYXllckZpZWxkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sLmNsYXNzTGlzdC5hZGQoXCJhaUZpZWxkXCIpO1xuICAgICAgfVxuICAgICAgY29sLmlkID0gYCR7bmFtZX0ke2l9JHtqfWA7XG5cbiAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG4gIHJldHVybiBib2FyZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQm9hcmRzKCkge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCBjdXJyZW50Q2VsbCA9IGNlbGw7XG4gICAgY3VycmVudENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlCb2FyZChnYW1lYm9hcmQsIG5hbWUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke25hbWV9JHtpfSR7an1gKTtcbiAgICAgIC8vICAgZWwudGV4dENvbnRlbnQgPSBgJHtuYW1lfSR7aX0ke2p9YDtcbiAgICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbaV1bal0gJiYgIWdhbWVib2FyZC5zaG90c1tpXVtqXSAmJiBuYW1lID09PSBcIlBcIikge1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyYXlcIjtcbiAgICAgIH1cbiAgICAgIGlmIChnYW1lYm9hcmQubWlzc2VkU2hvdHNbaV1bal0pIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJsaWdodGdyYXlcIjtcbiAgICAgIH1cbiAgICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbaV1bal0gJiYgZ2FtZWJvYXJkLnNob3RzW2ldW2pdKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZGFya3JlZFwiO1xuICAgICAgfVxuICAgICAgaWYgKGdhbWVib2FyZC5ib2FyZFtpXVtqXSAmJiBnYW1lYm9hcmQuYm9hcmRbaV1bal0uaXNTdW5rKCkpIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vbW9kdWxlcy9HYW1lYm9hcmRcIjtcbmltcG9ydCB7IGNsZWFyQm9hcmRzLCBjcmVhdGVCb2FyZEVsZW1lbnQsIGRpc3BsYXlCb2FyZCB9IGZyb20gXCIuL21vZHVsZXMvZG9tXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9tb2R1bGVzL1NoaXBcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vbW9kdWxlcy9QbGF5ZXJcIjtcblxubGV0IGJvYXJkUGxheWVyO1xubGV0IGJvYXJkQWk7XG5sZXQgbGVucztcbmxldCBpbml0aWFsR2FtZSA9IHRydWU7XG5jb25zdCBib3QgPSBuZXcgUGxheWVyKCk7XG5mdW5jdGlvbiBpbml0aWFsaXplRG9tKCkge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkc1wiKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUJvYXJkRWxlbWVudChcIlBcIikpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRFbGVtZW50KFwiQVwiKSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNoaXAoZSkge1xuICBjb25zdCBpZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpLnNwbGl0KFwiXCIpO1xuICBpZC5zaGlmdCgpO1xuICBjb25zdCBjb29yZHMgPSBpZC5tYXAoKGkpID0+IHBhcnNlSW50KGksIDEwKSk7XG4gIC8vIFRPRE86IG9yaWVudGFjaW9uIGRlIGxvcyBiYXJjb3NcbiAgaWYgKFxuICAgIGxlbnMubGVuZ3RoID4gMCAmJlxuICAgIGJvYXJkUGxheWVyLnBsYWNlU2hpcChuZXcgU2hpcChsZW5zWzBdKSwgY29vcmRzWzBdLCBjb29yZHNbMV0sIHRydWUpXG4gICkge1xuICAgIGlmIChsZW5zLmxlbmd0aCA9PT0gMSkgYWxsb3dQbGF5ZXJBdHRhY2soKTtcbiAgICBkaXNwbGF5Qm9hcmQoYm9hcmRQbGF5ZXIsIFwiUFwiKTtcbiAgICBsZW5zLnNoaWZ0KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb3dQbGF5ZXJBdHRhY2soKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gIGNvbnRlbnQudGV4dENvbnRlbnQgPSBcInNpbmsgeW91ciBvcHBvbmVudFwiO1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWlGaWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoZWNrQXR0YWNrU3VjY2Vzcyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0F0dGFja1N1Y2Nlc3MoZSkge1xuICBjb25zdCBpZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpLnNwbGl0KFwiXCIpO1xuICBpZC5zaGlmdCgpO1xuICBjb25zdCBjb29yZHMgPSBpZC5tYXAoKGkpID0+IHBhcnNlSW50KGksIDEwKSk7XG5cbiAgaWYgKGJvYXJkQWkuc2hvdHNbY29vcmRzWzBdXVtjb29yZHNbMV1dKSByZXR1cm47XG5cbiAgYm9hcmRBaS5yZWNlaXZlQXR0YWNrKGNvb3Jkc1swXSwgY29vcmRzWzFdKTtcbiAgZGlzcGxheUJvYXJkKGJvYXJkQWksIFwiQVwiKTtcbiAgaWYgKGJvYXJkQWkuaXNHYW1lT3ZlcigpKSB7XG4gICAgZGlzcGxheVdpbm5lcihcImh1bWFuXCIpO1xuICB9XG4gIGFsbG93Qm90QXR0YWNrKCk7XG59XG5cbi8vIHJldmlzYXJcbmZ1bmN0aW9uIGFsbG93Qm90QXR0YWNrKCkge1xuICBib3QucmFuZG9tQXR0YWNrKGJvYXJkUGxheWVyKTtcbiAgZGlzcGxheUJvYXJkKGJvYXJkUGxheWVyLCBcIlBcIik7XG4gIGlmIChib2FyZFBsYXllci5pc0dhbWVPdmVyKCkpIHtcbiAgICBkaXNwbGF5V2lubmVyKFwiQUlcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGxldCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyRmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhZGRTaGlwKTtcbiAgfSk7XG4gIGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5haUZpZWxkXCIpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tBdHRhY2tTdWNjZXNzKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlXaW5uZXIod2lubmVyKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gIGNvbnRlbnQudGV4dENvbnRlbnQgPSBgJHt3aW5uZXJ9IGlzIHRoZSB3aW5uZXIhYDtcblxuICByZW1vdmVFdmVudExpc3RlbmVycygpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBjbGVhckJvYXJkcygpO1xuICAgIHNldHVwKCk7XG4gIH0sIDUwMDApO1xufVxuXG5mdW5jdGlvbiBnZXRQbGF5ZXJNb3ZlcygpIHtcbiAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXllckZpZWxkXCIpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYWRkU2hpcCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgaWYgKGluaXRpYWxHYW1lKSB7XG4gICAgaW5pdGlhbGl6ZURvbSgpO1xuICAgIGluaXRpYWxHYW1lID0gZmFsc2U7XG4gIH1cbiAgYm9hcmRQbGF5ZXIgPSBuZXcgR2FtZWJvYXJkKCk7XG4gIGJvYXJkQWkgPSBuZXcgR2FtZWJvYXJkKCk7XG4gIGJvYXJkQWkucGxhY2VTaGlwc1JhbmRvbWx5KCk7XG4gIGNvbnNvbGUubG9nKGJvYXJkQWkuYm9hcmQpO1xuICBsZW5zID0gWzIsIDMsIDMsIDQsIDVdO1xuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICBjb250ZW50LnRleHRDb250ZW50ID0gXCJwbGFjZSB5b3VyIDUgc2hpcHMgYmVsb3dcIjtcbiAgLy8gZ2V0Qm90TW92ZXMoKTtcbiAgZ2V0UGxheWVyTW92ZXMoKTtcbn1cblxuc2V0dXAoKTtcbiJdLCJuYW1lcyI6WyJTaGlwIiwiU0laRSIsIkdhbWVib2FyZCIsImNvbnN0cnVjdG9yIiwiYm9hcmQiLCJtaXNzZWRTaG90cyIsInNob3RzIiwiaW5pdGlhbGl6ZSIsImkiLCJqIiwicGxhY2VTaGlwIiwic2hpcCIsInJvdyIsImNvbHVtbiIsImlzVmVydGljYWwiLCJpc1BsYWNlbWVudFBvc3NpYmxlIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInBsYWNlU2hpcHNSYW5kb21seSIsImlzRW1wdHkiLCJzaGlwcyIsInB1c2giLCJzdWNjZXNmdWxQbGFjZW1lbnRzIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicmVjZWl2ZUF0dGFjayIsImhpdEluZGV4IiwiaGl0IiwieCIsInkiLCJpc0dhbWVPdmVyIiwiaXNCb2FyZEVtcHR5IiwiaXNTdW5rIiwiZ2V0RW1wdHlGaWVsZHNBbW91bnQiLCJyZXN1bHQiLCJQbGF5ZXIiLCJuYW1lIiwiYWxyZWFkeUhpdCIsImF0dGFjayIsInBvc1giLCJwb3NZIiwiZ2FtZWJvYXJkIiwiaGFzQWxyZWFkeUhpdCIsInJhbmRvbUF0dGFjayIsImhpdHMiLCJwb3MiLCJpbmNsdWRlcyIsImNyZWF0ZUJvYXJkRWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImlkIiwiY29sIiwiYXBwZW5kQ2hpbGQiLCJjbGVhckJvYXJkcyIsImNlbGxzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJjZWxsIiwiY3VycmVudENlbGwiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImRpc3BsYXlCb2FyZCIsImVsIiwicXVlcnlTZWxlY3RvciIsImJvYXJkUGxheWVyIiwiYm9hcmRBaSIsImxlbnMiLCJpbml0aWFsR2FtZSIsImJvdCIsImluaXRpYWxpemVEb20iLCJjb250YWluZXIiLCJnZXRFbGVtZW50QnlJZCIsImFkZFNoaXAiLCJlIiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJzaGlmdCIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYWxsb3dQbGF5ZXJBdHRhY2siLCJjb250ZW50IiwidGV4dENvbnRlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY2hlY2tBdHRhY2tTdWNjZXNzIiwiZGlzcGxheVdpbm5lciIsImFsbG93Qm90QXR0YWNrIiwicmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwid2lubmVyIiwic2V0VGltZW91dCIsInNldHVwIiwiZ2V0UGxheWVyTW92ZXMiXSwic291cmNlUm9vdCI6IiJ9
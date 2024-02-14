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
/* eslint-disable no-use-before-define */



let boardPlayer;
let boardAi;
let lens;
let bot;
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
  if (boardAi.hit[coords[0]][coords[1]]) return;
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
    displayWinner("player");
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
  initializeDom();
  boardPlayer = new _modules_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
  boardAi = new _modules_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
  lens = [2, 3, 3, 4, 5];
  getPlayerMoves();
}
setup();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ekMsQ0FBQyxDQUFDO0FBQ0o7QUFFQSxTQUFTcUIsS0FBS0EsQ0FBQSxFQUFHO0VBQ2Z4QixhQUFhLENBQUMsQ0FBQztFQUNmSixXQUFXLEdBQUcsSUFBSTNELDBEQUFTLENBQUMsQ0FBQztFQUM3QjRELE9BQU8sR0FBRyxJQUFJNUQsMERBQVMsQ0FBQyxDQUFDO0VBQ3pCNkQsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUV0QjJCLGNBQWMsQ0FBQyxDQUFDO0FBQ2xCO0FBRUFELEtBQUssQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tIFwiLi9TaGlwXCI7XG5cbmNvbnN0IFNJWkUgPSAxMDtcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLnNob3RzID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICB0aGlzLmJvYXJkW2ldID0gW107XG4gICAgICB0aGlzLm1pc3NlZFNob3RzW2ldID0gW107XG4gICAgICB0aGlzLnNob3RzW2ldID0gW107XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICB0aGlzLmJvYXJkW2ldW2pdID0gbnVsbDtcbiAgICAgICAgdGhpcy5taXNzZWRTaG90c1tpXVtqXSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3RzW2ldW2pdID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSB7XG4gICAgaWYgKCF0aGlzLmlzUGxhY2VtZW50UG9zc2libGUoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNhbnQgcGxhY2Ugc2hpcCBoZXJlXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2x1bW5dID0gc2hpcDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gKyBpXSA9IHNoaXA7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGBQbGFjZWQgYSBzaGlwICR7c2hpcH0gaW4gcm93ICR7cm93fSBhbmQgY29sICR7Y29sdW1ufWApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcGxhY2VTaGlwc1JhbmRvbWx5KCkge1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHJldHVybjtcblxuICAgIGNvbnN0IHNoaXBzID0gW107XG4gICAgc2hpcHMucHVzaChuZXcgU2hpcCg1KSwgbmV3IFNoaXAoNCksIG5ldyBTaGlwKDMpLCBuZXcgU2hpcCgzKSwgbmV3IFNoaXAoMikpO1xuXG4gICAgbGV0IHN1Y2Nlc2Z1bFBsYWNlbWVudHMgPSAwO1xuICAgIHdoaWxlIChzdWNjZXNmdWxQbGFjZW1lbnRzIDwgNSkge1xuICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogU0laRSk7XG4gICAgICBjb25zdCBjb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBTSVpFKTtcbiAgICAgIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXG4gICAgICBpZiAodGhpcy5wbGFjZVNoaXAoc2hpcHNbc3VjY2VzZnVsUGxhY2VtZW50c10sIHJvdywgY29sdW1uLCBpc1ZlcnRpY2FsKSkge1xuICAgICAgICBzdWNjZXNmdWxQbGFjZW1lbnRzKys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayhyb3csIGNvbHVtbikge1xuICAgIGlmIChyb3cgPCAwIHx8IHJvdyA+PSBTSVpFIHx8IGNvbHVtbiA8IDAgfHwgY29sdW1uID49IFNJWkUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sdW1uXSkge1xuICAgICAgbGV0IGhpdEluZGV4ID0gMDtcbiAgICAgIC8vIGlzIGhvcml6b250YWxcbiAgICAgIGlmIChjb2x1bW4gPiAwICYmIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gLSAxXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChjb2x1bW4gLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3ddW2NvbHVtbiAtIGldKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlzIHZlcnRpY2FsXG4gICAgICBlbHNlIGlmIChyb3cgPiAwICYmIHRoaXMuYm9hcmRbcm93IC0gMV1bY29sdW1uXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChyb3cgLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3cgLSBpXVtjb2x1bW5dKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2x1bW5dLmhpdChoaXRJbmRleCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5taXNzZWRTaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzUGxhY2VtZW50UG9zc2libGUoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpIHtcbiAgICAvLyBwb3NpdGlvbiBvdXQgb2YgZ2FtZWJvYXJkXG4gICAgaWYgKHJvdyA8IDAgfHwgcm93ID49IFNJWkUgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4gPj0gU0laRSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgLy8gICBzaGlwIGRvZXNuJ3QgZml0IGluIHRoZSBnYW1lYm9hcmRcbiAgICAgIGlmIChyb3cgKyBzaGlwLmxlbmd0aCA+IFNJWkUpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vICAgYW55IG9mIHRoZSBmaWVsZHMgaXMgdGFrZW5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3cgKyBpXVtjb2x1bW5dICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBhbnkgb2YgbmVpZ2hib3VycyBjZWxscyBpcyB0YWtlblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAtMTsgeCA8PSAxOyB4KyspIHtcbiAgICAgICAgICBmb3IgKGxldCB5ID0gLTE7IHkgPD0gMTsgeSsrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHJvdyArIHggKyBpIDwgMCB8fFxuICAgICAgICAgICAgICByb3cgKyB4ICsgaSA+PSBTSVpFIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgPCAwIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgPj0gU0laRVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgeCArIGldW2NvbHVtbiArIHldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2x1bW4gKyBzaGlwLmxlbmd0aCA+IFNJWkUpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbHVtbiArIGldICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IC0xOyB4IDw9IDE7IHgrKykge1xuICAgICAgICAgIGZvciAobGV0IHkgPSAtMTsgeSA8PSAxOyB5KyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcm93ICsgeCA8IDAgfHxcbiAgICAgICAgICAgICAgcm93ICsgeCA+PSBTSVpFIHx8XG4gICAgICAgICAgICAgIGNvbHVtbiArIHkgKyBpIDwgMCB8fFxuICAgICAgICAgICAgICBjb2x1bW4gKyB5ICsgaSA+PSBTSVpFXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgeF1bY29sdW1uICsgeSArIGldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICBsZXQgaXNCb2FyZEVtcHR5ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNJWkU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBTSVpFOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0pIHtcbiAgICAgICAgICBpc0JvYXJkRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoIXRoaXMuYm9hcmRbaV1bal0uaXNTdW5rKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICFpc0JvYXJkRW1wdHk7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSAhPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldEVtcHR5RmllbGRzQW1vdW50KCkge1xuICAgIGxldCByZXN1bHQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSA9PT0gbnVsbCkgcmVzdWx0Kys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuaGl0cyA9IFtdO1xuICB9XG5cbiAgaGl0KHBvcykge1xuICAgIGlmICh0aGlzLmhpdHMuaW5jbHVkZXMocG9zKSB8fCBwb3MgPCAwIHx8IHBvcyA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmhpdHMucHVzaChwb3MpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLmhpdHMubGVuZ3RoID09PSB0aGlzLmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnRcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCb2FyZEVsZW1lbnQobmFtZSkge1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiKTtcbiAgYm9hcmQuaWQgPSBgYm9hcmQke25hbWV9YDtcbiAgLy8gQ3JlYXRlIHRoZSByb3dzIGFuZCBjb2x1bW5zXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcm93LmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29sLmNsYXNzTGlzdC5hZGQoXCJmaWVsZFwiKTtcbiAgICAgIGlmIChuYW1lID09PSBcIlBcIikge1xuICAgICAgICBjb2wuY2xhc3NMaXN0LmFkZChcInBsYXllckZpZWxkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sLmNsYXNzTGlzdC5hZGQoXCJhaUZpZWxkXCIpO1xuICAgICAgfVxuICAgICAgY29sLmlkID0gYCR7bmFtZX0ke2l9JHtqfWA7XG5cbiAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG4gIHJldHVybiBib2FyZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQm9hcmRzKCkge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCBjdXJyZW50Q2VsbCA9IGNlbGw7XG4gICAgY3VycmVudENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlCb2FyZChnYW1lYm9hcmQsIG5hbWUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke25hbWV9JHtpfSR7an1gKTtcbiAgICAgIC8vICAgZWwudGV4dENvbnRlbnQgPSBgJHtuYW1lfSR7aX0ke2p9YDtcbiAgICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbaV1bal0gJiYgIWdhbWVib2FyZC5zaG90c1tpXVtqXSAmJiBuYW1lID09PSBcIlBcIikge1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyYXlcIjtcbiAgICAgIH1cbiAgICAgIGlmIChnYW1lYm9hcmQubWlzc2VkU2hvdHNbaV1bal0pIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJsaWdodGdyYXlcIjtcbiAgICAgIH1cbiAgICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbaV1bal0gJiYgZ2FtZWJvYXJkLnNob3RzW2ldW2pdKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZGFya3JlZFwiO1xuICAgICAgfVxuICAgICAgaWYgKGdhbWVib2FyZC5ib2FyZFtpXVtqXSAmJiBnYW1lYm9hcmQuYm9hcmRbaV1bal0uaXNTdW5rKCkpIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vbW9kdWxlcy9HYW1lYm9hcmRcIjtcbmltcG9ydCB7IGNsZWFyQm9hcmRzLCBjcmVhdGVCb2FyZEVsZW1lbnQsIGRpc3BsYXlCb2FyZCB9IGZyb20gXCIuL21vZHVsZXMvZG9tXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9tb2R1bGVzL1NoaXBcIjtcblxubGV0IGJvYXJkUGxheWVyO1xubGV0IGJvYXJkQWk7XG5sZXQgbGVucztcbmxldCBib3Q7XG5mdW5jdGlvbiBpbml0aWFsaXplRG9tKCkge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkc1wiKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUJvYXJkRWxlbWVudChcIlBcIikpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRFbGVtZW50KFwiQVwiKSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNoaXAoZSkge1xuICBjb25zdCBpZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpLnNwbGl0KFwiXCIpO1xuICBpZC5zaGlmdCgpO1xuICBjb25zdCBjb29yZHMgPSBpZC5tYXAoKGkpID0+IHBhcnNlSW50KGksIDEwKSk7XG4gIC8vIFRPRE86IG9yaWVudGFjaW9uIGRlIGxvcyBiYXJjb3NcbiAgaWYgKFxuICAgIGxlbnMubGVuZ3RoID4gMCAmJlxuICAgIGJvYXJkUGxheWVyLnBsYWNlU2hpcChuZXcgU2hpcChsZW5zWzBdKSwgY29vcmRzWzBdLCBjb29yZHNbMV0sIHRydWUpXG4gICkge1xuICAgIGlmIChsZW5zLmxlbmd0aCA9PT0gMSkgYWxsb3dQbGF5ZXJBdHRhY2soKTtcbiAgICBkaXNwbGF5Qm9hcmQoYm9hcmRQbGF5ZXIsIFwiUFwiKTtcbiAgICBsZW5zLnNoaWZ0KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb3dQbGF5ZXJBdHRhY2soKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gIGNvbnRlbnQudGV4dENvbnRlbnQgPSBcInNpbmsgeW91ciBvcHBvbmVudFwiO1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWlGaWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoZWNrQXR0YWNrU3VjY2Vzcyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0F0dGFja1N1Y2Nlc3MoZSkge1xuICBjb25zdCBpZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpLnNwbGl0KFwiXCIpO1xuICBpZC5zaGlmdCgpO1xuICBjb25zdCBjb29yZHMgPSBpZC5tYXAoKGkpID0+IHBhcnNlSW50KGksIDEwKSk7XG5cbiAgaWYgKGJvYXJkQWkuaGl0W2Nvb3Jkc1swXV1bY29vcmRzWzFdXSkgcmV0dXJuO1xuXG4gIGJvYXJkQWkucmVjZWl2ZUF0dGFjayhjb29yZHNbMF0sIGNvb3Jkc1sxXSk7XG4gIGRpc3BsYXlCb2FyZChib2FyZEFpLCBcIkFcIik7XG4gIGlmIChib2FyZEFpLmlzR2FtZU92ZXIoKSkge1xuICAgIGRpc3BsYXlXaW5uZXIoXCJodW1hblwiKTtcbiAgfVxuXG4gIGFsbG93Qm90QXR0YWNrKCk7XG59XG5cbmZ1bmN0aW9uIGFsbG93Qm90QXR0YWNrKCkge1xuICBib3QucmFuZG9tQXR0YWNrKGJvYXJkUGxheWVyKTtcbiAgZGlzcGxheUJvYXJkKGJvYXJkUGxheWVyLCBcIlBcIik7XG4gIGlmIChib2FyZFBsYXllci5pc0dhbWVPdmVyKCkpIHtcbiAgICBkaXNwbGF5V2lubmVyKFwicGxheWVyXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xuICBsZXQgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXllckZpZWxkXCIpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYWRkU2hpcCk7XG4gIH0pO1xuICBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWlGaWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoZWNrQXR0YWNrU3VjY2Vzcyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5V2lubmVyKHdpbm5lcikge1xuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICBjb250ZW50LnRleHRDb250ZW50ID0gYCR7d2lubmVyfSBpcyB0aGUgd2lubmVyIWA7XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgY2xlYXJCb2FyZHMoKTtcbiAgICBzZXR1cCgpO1xuICB9LCA1MDAwKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGxheWVyTW92ZXMoKSB7XG4gIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5ZXJGaWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZFNoaXApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGluaXRpYWxpemVEb20oKTtcbiAgYm9hcmRQbGF5ZXIgPSBuZXcgR2FtZWJvYXJkKCk7XG4gIGJvYXJkQWkgPSBuZXcgR2FtZWJvYXJkKCk7XG4gIGxlbnMgPSBbMiwgMywgMywgNCwgNV07XG5cbiAgZ2V0UGxheWVyTW92ZXMoKTtcbn1cblxuc2V0dXAoKTtcbiJdLCJuYW1lcyI6WyJTaGlwIiwiU0laRSIsIkdhbWVib2FyZCIsImNvbnN0cnVjdG9yIiwiYm9hcmQiLCJtaXNzZWRTaG90cyIsInNob3RzIiwiaW5pdGlhbGl6ZSIsImkiLCJqIiwicGxhY2VTaGlwIiwic2hpcCIsInJvdyIsImNvbHVtbiIsImlzVmVydGljYWwiLCJpc1BsYWNlbWVudFBvc3NpYmxlIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInBsYWNlU2hpcHNSYW5kb21seSIsImlzRW1wdHkiLCJzaGlwcyIsInB1c2giLCJzdWNjZXNmdWxQbGFjZW1lbnRzIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicmVjZWl2ZUF0dGFjayIsImhpdEluZGV4IiwiaGl0IiwieCIsInkiLCJpc0dhbWVPdmVyIiwiaXNCb2FyZEVtcHR5IiwiaXNTdW5rIiwiZ2V0RW1wdHlGaWVsZHNBbW91bnQiLCJyZXN1bHQiLCJoaXRzIiwicG9zIiwiaW5jbHVkZXMiLCJjcmVhdGVCb2FyZEVsZW1lbnQiLCJuYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiaWQiLCJjb2wiLCJhcHBlbmRDaGlsZCIsImNsZWFyQm9hcmRzIiwiY2VsbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImNlbGwiLCJjdXJyZW50Q2VsbCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZGlzcGxheUJvYXJkIiwiZ2FtZWJvYXJkIiwiZWwiLCJxdWVyeVNlbGVjdG9yIiwiYm9hcmRQbGF5ZXIiLCJib2FyZEFpIiwibGVucyIsImJvdCIsImluaXRpYWxpemVEb20iLCJjb250YWluZXIiLCJnZXRFbGVtZW50QnlJZCIsImFkZFNoaXAiLCJlIiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJzaGlmdCIsImNvb3JkcyIsIm1hcCIsInBhcnNlSW50IiwiYWxsb3dQbGF5ZXJBdHRhY2siLCJjb250ZW50IiwidGV4dENvbnRlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY2hlY2tBdHRhY2tTdWNjZXNzIiwiZGlzcGxheVdpbm5lciIsImFsbG93Qm90QXR0YWNrIiwicmFuZG9tQXR0YWNrIiwicmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwid2lubmVyIiwic2V0VGltZW91dCIsInNldHVwIiwiZ2V0UGxheWVyTW92ZXMiXSwic291cmNlUm9vdCI6IiJ9
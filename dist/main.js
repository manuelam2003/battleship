/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/Dom.js":
/*!****************************!*\
  !*** ./src/modules/Dom.js ***!
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

/***/ }),

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
const NUM_SHIPS = 5;
const SHIP_LENGTHS = [5, 4, 3, 3, 2];
class Gameboard {
  constructor() {
    this.board = [];
    this.missedShots = [];
    this.shots = [];
    this.initialize();
  }
  initialize() {
    for (let i = 0; i < SIZE; i++) {
      this.board[i] = Array(SIZE).fill(null);
      this.missedShots[i] = Array(SIZE).fill(false);
      this.shots[i] = Array(SIZE).fill(false);
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
    return true;
  }
  placeShipsRandomly() {
    if (!this.isEmpty()) return;
    const ships = SHIP_LENGTHS.map(length => new _Ship__WEBPACK_IMPORTED_MODULE_0__["default"](length));
    let succesfulPlacements = 0;
    while (succesfulPlacements < NUM_SHIPS) {
      const row = Math.floor(Math.random() * SIZE);
      const column = Math.floor(Math.random() * SIZE);
      const isVertical = Math.random() < 0.5;
      if (this.placeShip(ships[succesfulPlacements], row, column, isVertical)) {
        succesfulPlacements++;
      }
    }
  }
  receiveAttack(row, column) {
    if (!this.isValidPosition(row, column)) {
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
    if (!this.isValidPosition(row, column)) {
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
            if (!this.isValidPosition(row + x + i, column + y)) {
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
            if (!this.isValidPosition(row + x, column + y + i)) continue;
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
  isValidPosition(row, column) {
    return row >= 0 && row < SIZE && column >= 0 && column < SIZE;
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
      [posX, posY] = probableSpots.shift();
    } else {
      [posX, posY] = this.generateRandomPosition();
    }
    while (this.hasAlreadyHit(posX, posY)) {
      if (probableSpots.length > 0) {
        [posX, posY] = probableSpots.shift();
      } else {
        [posX, posY] = this.generateRandomPosition();
      }
    }
    if (this.attack(posX, posY, gameboard)) {
      this.lastHit = [posX, posY];
    }
  }

  // update so it keeps looking in the found ship direction and not all the squares around it
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
    return arrayOfPos;
  }
  hasAlreadyHit(posX, posY) {
    return this.alreadyHit.some(_ref => {
      let [x, y] = _ref;
      return x === posX && y === posY;
    });
  }
  generateRandomPosition() {
    const posX = Math.floor(Math.random() * 10);
    const posY = Math.floor(Math.random() * 10);
    return [posX, posY];
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
/* harmony import */ var _modules_Dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Dom */ "./src/modules/Dom.js");
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
  container.appendChild((0,_modules_Dom__WEBPACK_IMPORTED_MODULE_1__.createBoardElement)("P"));
  container.appendChild((0,_modules_Dom__WEBPACK_IMPORTED_MODULE_1__.createBoardElement)("A"));
}
function addShip(e) {
  const id = e.target.getAttribute("id").split("");
  id.shift();
  const coords = id.map(i => parseInt(i, 10));
  if (lens.length > 0 && boardPlayer.placeShip(new _modules_Ship__WEBPACK_IMPORTED_MODULE_2__["default"](lens[0]), coords[0], coords[1], orientationIsVertical)) {
    if (lens.length === 1) allowPlayerAttack();
    (0,_modules_Dom__WEBPACK_IMPORTED_MODULE_1__.displayBoard)(boardPlayer, "P");
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
  (0,_modules_Dom__WEBPACK_IMPORTED_MODULE_1__.displayBoard)(boardAi, "A");
  if (boardAi.isGameOver()) {
    displayWinner("human");
  }
  allowBotAttack();
}
function allowBotAttack() {
  bot.randomAttack(boardPlayer);
  (0,_modules_Dom__WEBPACK_IMPORTED_MODULE_1__.displayBoard)(boardPlayer, "P");
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
    (0,_modules_Dom__WEBPACK_IMPORTED_MODULE_1__.clearBoards)();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDTyxTQUFTQSxrQkFBa0JBLENBQUNDLElBQUksRUFBRTtFQUN2QyxNQUFNQyxLQUFLLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUMzQ0YsS0FBSyxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxPQUFPLENBQUM7RUFDNUJKLEtBQUssQ0FBQ0ssRUFBRSxHQUFJLFFBQU9OLElBQUssRUFBQztFQUN6QjtFQUNBLEtBQUssSUFBSU8sQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLEVBQUUsRUFBRUEsQ0FBQyxFQUFFLEVBQUU7SUFDM0IsTUFBTUMsR0FBRyxHQUFHTixRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDekNLLEdBQUcsQ0FBQ0osU0FBUyxDQUFDQyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3hCLEtBQUssSUFBSUksQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLEVBQUUsRUFBRUEsQ0FBQyxFQUFFLEVBQUU7TUFDM0IsTUFBTUMsR0FBRyxHQUFHUixRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDekNPLEdBQUcsQ0FBQ04sU0FBUyxDQUFDQyxHQUFHLENBQUMsT0FBTyxDQUFDO01BQzFCLElBQUlMLElBQUksS0FBSyxHQUFHLEVBQUU7UUFDaEJVLEdBQUcsQ0FBQ04sU0FBUyxDQUFDQyxHQUFHLENBQUMsYUFBYSxDQUFDO01BQ2xDLENBQUMsTUFBTTtRQUNMSyxHQUFHLENBQUNOLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFNBQVMsQ0FBQztNQUM5QjtNQUNBSyxHQUFHLENBQUNKLEVBQUUsR0FBSSxHQUFFTixJQUFLLEdBQUVPLENBQUUsR0FBRUUsQ0FBRSxFQUFDO01BRTFCRCxHQUFHLENBQUNHLFdBQVcsQ0FBQ0QsR0FBRyxDQUFDO0lBQ3RCO0lBQ0FULEtBQUssQ0FBQ1UsV0FBVyxDQUFDSCxHQUFHLENBQUM7RUFDeEI7RUFDQSxPQUFPUCxLQUFLO0FBQ2Q7QUFFTyxTQUFTVyxXQUFXQSxDQUFBLEVBQUc7RUFDNUIsTUFBTUMsS0FBSyxHQUFHWCxRQUFRLENBQUNZLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztFQUNqREQsS0FBSyxDQUFDRSxPQUFPLENBQUVDLElBQUksSUFBSztJQUN0QixNQUFNQyxXQUFXLEdBQUdELElBQUk7SUFDeEJDLFdBQVcsQ0FBQ0MsS0FBSyxDQUFDQyxlQUFlLEdBQUcsT0FBTztFQUM3QyxDQUFDLENBQUM7QUFDSjtBQUVPLFNBQVNDLFlBQVlBLENBQUNDLFNBQVMsRUFBRXJCLElBQUksRUFBRTtFQUM1QyxLQUFLLElBQUlPLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRyxFQUFFLEVBQUVBLENBQUMsRUFBRSxFQUFFO0lBQzNCLEtBQUssSUFBSUUsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLEVBQUUsRUFBRUEsQ0FBQyxFQUFFLEVBQUU7TUFDM0IsTUFBTWEsRUFBRSxHQUFHcEIsUUFBUSxDQUFDcUIsYUFBYSxDQUFFLElBQUd2QixJQUFLLEdBQUVPLENBQUUsR0FBRUUsQ0FBRSxFQUFDLENBQUM7TUFDckQ7TUFDQSxJQUFJWSxTQUFTLENBQUNwQixLQUFLLENBQUNNLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsSUFBSSxDQUFDWSxTQUFTLENBQUNHLEtBQUssQ0FBQ2pCLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsSUFBSVQsSUFBSSxLQUFLLEdBQUcsRUFBRTtRQUNuRXNCLEVBQUUsQ0FBQ0osS0FBSyxDQUFDQyxlQUFlLEdBQUcsTUFBTTtNQUNuQztNQUNBLElBQUlFLFNBQVMsQ0FBQ0ksV0FBVyxDQUFDbEIsQ0FBQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxFQUFFO1FBQy9CYSxFQUFFLENBQUNKLEtBQUssQ0FBQ0MsZUFBZSxHQUFHLFdBQVc7TUFDeEM7TUFDQSxJQUFJRSxTQUFTLENBQUNwQixLQUFLLENBQUNNLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsSUFBSVksU0FBUyxDQUFDRyxLQUFLLENBQUNqQixDQUFDLENBQUMsQ0FBQ0UsQ0FBQyxDQUFDLEVBQUU7UUFDbERhLEVBQUUsQ0FBQ0osS0FBSyxDQUFDQyxlQUFlLEdBQUcsU0FBUztNQUN0QztNQUNBLElBQUlFLFNBQVMsQ0FBQ3BCLEtBQUssQ0FBQ00sQ0FBQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxJQUFJWSxTQUFTLENBQUNwQixLQUFLLENBQUNNLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsQ0FBQ2lCLE1BQU0sQ0FBQyxDQUFDLEVBQUU7UUFDM0RKLEVBQUUsQ0FBQ0osS0FBSyxDQUFDQyxlQUFlLEdBQUcsS0FBSztNQUNsQztJQUNGO0VBQ0Y7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0FDckQwQjtBQUUxQixNQUFNUyxJQUFJLEdBQUcsRUFBRTtBQUNmLE1BQU1DLFNBQVMsR0FBRyxDQUFDO0FBQ25CLE1BQU1DLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFcEMsTUFBTUMsU0FBUyxDQUFDO0VBQ2RDLFdBQVdBLENBQUEsRUFBRztJQUNaLElBQUksQ0FBQy9CLEtBQUssR0FBRyxFQUFFO0lBQ2YsSUFBSSxDQUFDd0IsV0FBVyxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDRCxLQUFLLEdBQUcsRUFBRTtJQUNmLElBQUksQ0FBQ1MsVUFBVSxDQUFDLENBQUM7RUFDbkI7RUFFQUEsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsS0FBSyxJQUFJMUIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHcUIsSUFBSSxFQUFFckIsQ0FBQyxFQUFFLEVBQUU7TUFDN0IsSUFBSSxDQUFDTixLQUFLLENBQUNNLENBQUMsQ0FBQyxHQUFHMkIsS0FBSyxDQUFDTixJQUFJLENBQUMsQ0FBQ08sSUFBSSxDQUFDLElBQUksQ0FBQztNQUN0QyxJQUFJLENBQUNWLFdBQVcsQ0FBQ2xCLENBQUMsQ0FBQyxHQUFHMkIsS0FBSyxDQUFDTixJQUFJLENBQUMsQ0FBQ08sSUFBSSxDQUFDLEtBQUssQ0FBQztNQUM3QyxJQUFJLENBQUNYLEtBQUssQ0FBQ2pCLENBQUMsQ0FBQyxHQUFHMkIsS0FBSyxDQUFDTixJQUFJLENBQUMsQ0FBQ08sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN6QztFQUNGO0VBRUFDLFNBQVNBLENBQUNDLElBQUksRUFBRTdCLEdBQUcsRUFBRThCLE1BQU0sRUFBRUMsVUFBVSxFQUFFO0lBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUNDLG1CQUFtQixDQUFDSCxJQUFJLEVBQUU3QixHQUFHLEVBQUU4QixNQUFNLEVBQUVDLFVBQVUsQ0FBQyxFQUFFO01BQzVERSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztNQUNuQyxPQUFPLEtBQUs7SUFDZDtJQUVBLElBQUlILFVBQVUsRUFBRTtNQUNkLEtBQUssSUFBSWhDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzhCLElBQUksQ0FBQ00sTUFBTSxFQUFFcEMsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsSUFBSSxDQUFDTixLQUFLLENBQUNPLEdBQUcsR0FBR0QsQ0FBQyxDQUFDLENBQUMrQixNQUFNLENBQUMsR0FBR0QsSUFBSTtNQUNwQztJQUNGLENBQUMsTUFBTTtNQUNMLEtBQUssSUFBSTlCLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzhCLElBQUksQ0FBQ00sTUFBTSxFQUFFcEMsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsSUFBSSxDQUFDTixLQUFLLENBQUNPLEdBQUcsQ0FBQyxDQUFDOEIsTUFBTSxHQUFHL0IsQ0FBQyxDQUFDLEdBQUc4QixJQUFJO01BQ3BDO0lBQ0Y7SUFDQSxPQUFPLElBQUk7RUFDYjtFQUVBTyxrQkFBa0JBLENBQUEsRUFBRztJQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDQyxPQUFPLENBQUMsQ0FBQyxFQUFFO0lBRXJCLE1BQU1DLEtBQUssR0FBR2hCLFlBQVksQ0FBQ2lCLEdBQUcsQ0FBRUosTUFBTSxJQUFLLElBQUloQiw2Q0FBSSxDQUFDZ0IsTUFBTSxDQUFDLENBQUM7SUFFNUQsSUFBSUssbUJBQW1CLEdBQUcsQ0FBQztJQUMzQixPQUFPQSxtQkFBbUIsR0FBR25CLFNBQVMsRUFBRTtNQUN0QyxNQUFNckIsR0FBRyxHQUFHeUMsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBR3ZCLElBQUksQ0FBQztNQUM1QyxNQUFNVSxNQUFNLEdBQUdXLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUd2QixJQUFJLENBQUM7TUFDL0MsTUFBTVcsVUFBVSxHQUFHVSxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRztNQUV0QyxJQUFJLElBQUksQ0FBQ2YsU0FBUyxDQUFDVSxLQUFLLENBQUNFLG1CQUFtQixDQUFDLEVBQUV4QyxHQUFHLEVBQUU4QixNQUFNLEVBQUVDLFVBQVUsQ0FBQyxFQUFFO1FBQ3ZFUyxtQkFBbUIsRUFBRTtNQUN2QjtJQUNGO0VBQ0Y7RUFFQUksYUFBYUEsQ0FBQzVDLEdBQUcsRUFBRThCLE1BQU0sRUFBRTtJQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDZSxlQUFlLENBQUM3QyxHQUFHLEVBQUU4QixNQUFNLENBQUMsRUFBRTtNQUN0QyxPQUFPLEtBQUs7SUFDZDtJQUNBLElBQUksQ0FBQ2QsS0FBSyxDQUFDaEIsR0FBRyxDQUFDLENBQUM4QixNQUFNLENBQUMsR0FBRyxJQUFJO0lBQzlCLElBQUksSUFBSSxDQUFDckMsS0FBSyxDQUFDTyxHQUFHLENBQUMsQ0FBQzhCLE1BQU0sQ0FBQyxFQUFFO01BQzNCLElBQUlnQixRQUFRLEdBQUcsQ0FBQztNQUNoQjtNQUNBLElBQUloQixNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQ3JDLEtBQUssQ0FBQ08sR0FBRyxDQUFDLENBQUM4QixNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDN0MsSUFBSS9CLENBQUMsR0FBRyxDQUFDO1FBQ1QsT0FBTytCLE1BQU0sR0FBRy9CLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDTixLQUFLLENBQUNPLEdBQUcsQ0FBQyxDQUFDOEIsTUFBTSxHQUFHL0IsQ0FBQyxDQUFDLEVBQUU7VUFDckQrQyxRQUFRLEVBQUU7VUFDVi9DLENBQUMsRUFBRTtRQUNMO01BQ0Y7TUFDQTtNQUFBLEtBQ0ssSUFBSUMsR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUNQLEtBQUssQ0FBQ08sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDOEIsTUFBTSxDQUFDLEVBQUU7UUFDL0MsSUFBSS9CLENBQUMsR0FBRyxDQUFDO1FBQ1QsT0FBT0MsR0FBRyxHQUFHRCxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQ04sS0FBSyxDQUFDTyxHQUFHLEdBQUdELENBQUMsQ0FBQyxDQUFDK0IsTUFBTSxDQUFDLEVBQUU7VUFDbERnQixRQUFRLEVBQUU7VUFDVi9DLENBQUMsRUFBRTtRQUNMO01BQ0Y7TUFDQSxJQUFJLENBQUNOLEtBQUssQ0FBQ08sR0FBRyxDQUFDLENBQUM4QixNQUFNLENBQUMsQ0FBQ2lCLEdBQUcsQ0FBQ0QsUUFBUSxDQUFDO01BQ3JDLE9BQU8sSUFBSTtJQUNiO0lBQ0EsSUFBSSxDQUFDN0IsV0FBVyxDQUFDakIsR0FBRyxDQUFDLENBQUM4QixNQUFNLENBQUMsR0FBRyxJQUFJO0lBQ3BDLE9BQU8sS0FBSztFQUNkO0VBRUFFLG1CQUFtQkEsQ0FBQ0gsSUFBSSxFQUFFN0IsR0FBRyxFQUFFOEIsTUFBTSxFQUFFQyxVQUFVLEVBQUU7SUFDakQ7SUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDYyxlQUFlLENBQUM3QyxHQUFHLEVBQUU4QixNQUFNLENBQUMsRUFBRTtNQUN0QyxPQUFPLEtBQUs7SUFDZDtJQUNBLElBQUlDLFVBQVUsRUFBRTtNQUNkO01BQ0EsSUFBSS9CLEdBQUcsR0FBRzZCLElBQUksQ0FBQ00sTUFBTSxHQUFHZixJQUFJLEVBQUUsT0FBTyxLQUFLO01BQzFDO01BQ0EsS0FBSyxJQUFJckIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHOEIsSUFBSSxDQUFDTSxNQUFNLEVBQUVwQyxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFJLElBQUksQ0FBQ04sS0FBSyxDQUFDTyxHQUFHLEdBQUdELENBQUMsQ0FBQyxDQUFDK0IsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1VBQ3hDLE9BQU8sS0FBSztRQUNkO01BQ0Y7TUFDQTtNQUNBLEtBQUssSUFBSS9CLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzhCLElBQUksQ0FBQ00sTUFBTSxFQUFFcEMsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsS0FBSyxJQUFJaUQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFQSxDQUFDLElBQUksQ0FBQyxFQUFFQSxDQUFDLEVBQUUsRUFBRTtVQUM1QixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRUEsQ0FBQyxJQUFJLENBQUMsRUFBRUEsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQ0osZUFBZSxDQUFDN0MsR0FBRyxHQUFHZ0QsQ0FBQyxHQUFHakQsQ0FBQyxFQUFFK0IsTUFBTSxHQUFHbUIsQ0FBQyxDQUFDLEVBQUU7Y0FDbEQ7WUFDRjtZQUNBLElBQUksSUFBSSxDQUFDeEQsS0FBSyxDQUFDTyxHQUFHLEdBQUdnRCxDQUFDLEdBQUdqRCxDQUFDLENBQUMsQ0FBQytCLE1BQU0sR0FBR21CLENBQUMsQ0FBQyxFQUFFLE9BQU8sS0FBSztVQUN2RDtRQUNGO01BQ0Y7SUFDRixDQUFDLE1BQU07TUFDTCxJQUFJbkIsTUFBTSxHQUFHRCxJQUFJLENBQUNNLE1BQU0sR0FBR2YsSUFBSSxFQUFFLE9BQU8sS0FBSztNQUM3QyxLQUFLLElBQUlyQixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUc4QixJQUFJLENBQUNNLE1BQU0sRUFBRXBDLENBQUMsRUFBRSxFQUFFO1FBQ3BDLElBQUksSUFBSSxDQUFDTixLQUFLLENBQUNPLEdBQUcsQ0FBQyxDQUFDOEIsTUFBTSxHQUFHL0IsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1VBQ3hDLE9BQU8sS0FBSztRQUNkO01BQ0Y7TUFDQSxLQUFLLElBQUlBLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzhCLElBQUksQ0FBQ00sTUFBTSxFQUFFcEMsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsS0FBSyxJQUFJaUQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFQSxDQUFDLElBQUksQ0FBQyxFQUFFQSxDQUFDLEVBQUUsRUFBRTtVQUM1QixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRUEsQ0FBQyxJQUFJLENBQUMsRUFBRUEsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQ0osZUFBZSxDQUFDN0MsR0FBRyxHQUFHZ0QsQ0FBQyxFQUFFbEIsTUFBTSxHQUFHbUIsQ0FBQyxHQUFHbEQsQ0FBQyxDQUFDLEVBQUU7WUFDcEQsSUFBSSxJQUFJLENBQUNOLEtBQUssQ0FBQ08sR0FBRyxHQUFHZ0QsQ0FBQyxDQUFDLENBQUNsQixNQUFNLEdBQUdtQixDQUFDLEdBQUdsRCxDQUFDLENBQUMsRUFBRSxPQUFPLEtBQUs7VUFDdkQ7UUFDRjtNQUNGO0lBQ0Y7SUFDQSxPQUFPLElBQUk7RUFDYjtFQUVBbUQsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsSUFBSUMsWUFBWSxHQUFHLElBQUk7SUFDdkIsS0FBSyxJQUFJcEQsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHcUIsSUFBSSxFQUFFckIsQ0FBQyxFQUFFLEVBQUU7TUFDN0IsS0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdtQixJQUFJLEVBQUVuQixDQUFDLEVBQUUsRUFBRTtRQUM3QixJQUFJLElBQUksQ0FBQ1IsS0FBSyxDQUFDTSxDQUFDLENBQUMsQ0FBQ0UsQ0FBQyxDQUFDLEVBQUU7VUFDcEJrRCxZQUFZLEdBQUcsS0FBSztVQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDMUQsS0FBSyxDQUFDTSxDQUFDLENBQUMsQ0FBQ0UsQ0FBQyxDQUFDLENBQUNpQixNQUFNLENBQUMsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sS0FBSztVQUNkO1FBQ0Y7TUFDRjtJQUNGO0lBQ0EsT0FBTyxDQUFDaUMsWUFBWTtFQUN0QjtFQUVBZCxPQUFPQSxDQUFBLEVBQUc7SUFDUixLQUFLLElBQUl0QyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdxQixJQUFJLEVBQUVyQixDQUFDLEVBQUUsRUFBRTtNQUM3QixLQUFLLElBQUlFLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR21CLElBQUksRUFBRW5CLENBQUMsRUFBRSxFQUFFO1FBQzdCLElBQUksSUFBSSxDQUFDUixLQUFLLENBQUNNLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsT0FBTyxLQUFLO01BQzdDO0lBQ0Y7SUFDQSxPQUFPLElBQUk7RUFDYjtFQUVBbUQsb0JBQW9CQSxDQUFBLEVBQUc7SUFDckIsSUFBSUMsTUFBTSxHQUFHLENBQUM7SUFDZCxLQUFLLElBQUl0RCxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdxQixJQUFJLEVBQUVyQixDQUFDLEVBQUUsRUFBRTtNQUM3QixLQUFLLElBQUlFLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR21CLElBQUksRUFBRW5CLENBQUMsRUFBRSxFQUFFO1FBQzdCLElBQUksSUFBSSxDQUFDUixLQUFLLENBQUNNLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUVvRCxNQUFNLEVBQUU7TUFDekM7SUFDRjtJQUNBLE9BQU9BLE1BQU07RUFDZjtFQUVBUixlQUFlQSxDQUFDN0MsR0FBRyxFQUFFOEIsTUFBTSxFQUFFO0lBQzNCLE9BQU85QixHQUFHLElBQUksQ0FBQyxJQUFJQSxHQUFHLEdBQUdvQixJQUFJLElBQUlVLE1BQU0sSUFBSSxDQUFDLElBQUlBLE1BQU0sR0FBR1YsSUFBSTtFQUMvRDtBQUNGO0FBRUEsaUVBQWVHLFNBQVM7Ozs7Ozs7Ozs7Ozs7O0FDMUt4QixNQUFNK0IsTUFBTSxDQUFDO0VBQ1g5QixXQUFXQSxDQUFDaEMsSUFBSSxFQUFFO0lBQ2hCLElBQUksQ0FBQ0EsSUFBSSxHQUFHQSxJQUFJO0lBQ2hCLElBQUksQ0FBQytELFVBQVUsR0FBRyxFQUFFO0lBQ3BCLElBQUksQ0FBQ0MsT0FBTyxHQUFHLElBQUk7RUFDckI7RUFFQUMsTUFBTUEsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLEVBQUU5QyxTQUFTLEVBQUU7SUFDNUIsSUFBSSxJQUFJLENBQUMrQyxhQUFhLENBQUNGLElBQUksRUFBRUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxLQUFLO0lBQ2hELElBQUksQ0FBQ0osVUFBVSxDQUFDTSxJQUFJLENBQUMsQ0FBQ0gsSUFBSSxFQUFFQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxPQUFPOUMsU0FBUyxDQUFDK0IsYUFBYSxDQUFDYyxJQUFJLEVBQUVDLElBQUksQ0FBQztFQUM1QztFQUVBRyxZQUFZQSxDQUFDakQsU0FBUyxFQUFFO0lBQ3RCLElBQUksSUFBSSxDQUFDMEMsVUFBVSxDQUFDcEIsTUFBTSxLQUFLLEdBQUcsRUFBRTtJQUNwQyxJQUFJdUIsSUFBSTtJQUNSLElBQUlDLElBQUk7SUFDUixJQUFJSSxhQUFhLEdBQUcsRUFBRTtJQUN0QixJQUFJLElBQUksQ0FBQ1AsT0FBTyxFQUFFO01BQ2hCTyxhQUFhLEdBQUcsSUFBSSxDQUFDQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUNSLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUNBLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN6RSxDQUFDRSxJQUFJLEVBQUVDLElBQUksQ0FBQyxHQUFHSSxhQUFhLENBQUNFLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUMsTUFBTTtNQUNMLENBQUNQLElBQUksRUFBRUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDTyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzlDO0lBQ0EsT0FBTyxJQUFJLENBQUNOLGFBQWEsQ0FBQ0YsSUFBSSxFQUFFQyxJQUFJLENBQUMsRUFBRTtNQUNyQyxJQUFJSSxhQUFhLENBQUM1QixNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzVCLENBQUN1QixJQUFJLEVBQUVDLElBQUksQ0FBQyxHQUFHSSxhQUFhLENBQUNFLEtBQUssQ0FBQyxDQUFDO01BQ3RDLENBQUMsTUFBTTtRQUNMLENBQUNQLElBQUksRUFBRUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDTyxzQkFBc0IsQ0FBQyxDQUFDO01BQzlDO0lBQ0Y7SUFDQSxJQUFJLElBQUksQ0FBQ1QsTUFBTSxDQUFDQyxJQUFJLEVBQUVDLElBQUksRUFBRTlDLFNBQVMsQ0FBQyxFQUFFO01BQ3RDLElBQUksQ0FBQzJDLE9BQU8sR0FBRyxDQUFDRSxJQUFJLEVBQUVDLElBQUksQ0FBQztJQUM3QjtFQUNGOztFQUVBO0VBQ0FLLGtCQUFrQkEsQ0FBQ04sSUFBSSxFQUFFQyxJQUFJLEVBQUU7SUFDN0IsTUFBTVEsVUFBVSxHQUFHLENBQ2pCLENBQUNULElBQUksRUFBRUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUNoQixDQUFDRCxJQUFJLEVBQUVDLElBQUksR0FBRyxDQUFDLENBQUMsRUFDaEIsQ0FBQ0QsSUFBSSxHQUFHLENBQUMsRUFBRUMsSUFBSSxDQUFDLEVBQ2hCLENBQUNELElBQUksR0FBRyxDQUFDLEVBQUVDLElBQUksQ0FBQyxDQUNqQjtJQUNELElBQUlELElBQUksS0FBSyxDQUFDLEVBQUU7TUFDZFMsVUFBVSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QjtJQUNBLElBQUlULElBQUksS0FBSyxDQUFDLEVBQUU7TUFDZFEsVUFBVSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QjtJQUNBLElBQUlWLElBQUksS0FBSyxDQUFDLEVBQUU7TUFDZFMsVUFBVSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QjtJQUNBLElBQUlULElBQUksS0FBSyxDQUFDLEVBQUU7TUFDZFEsVUFBVSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QjtJQUNBLE9BQU9ELFVBQVU7RUFDbkI7RUFFQVAsYUFBYUEsQ0FBQ0YsSUFBSSxFQUFFQyxJQUFJLEVBQUU7SUFDeEIsT0FBTyxJQUFJLENBQUNKLFVBQVUsQ0FBQ2MsSUFBSSxDQUFDQyxJQUFBO01BQUEsSUFBQyxDQUFDdEIsQ0FBQyxFQUFFQyxDQUFDLENBQUMsR0FBQXFCLElBQUE7TUFBQSxPQUFLdEIsQ0FBQyxLQUFLVSxJQUFJLElBQUlULENBQUMsS0FBS1UsSUFBSTtJQUFBLEVBQUM7RUFDbkU7RUFFQU8sc0JBQXNCQSxDQUFBLEVBQUc7SUFDdkIsTUFBTVIsSUFBSSxHQUFHakIsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0MsTUFBTWdCLElBQUksR0FBR2xCLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNDLE9BQU8sQ0FBQ2UsSUFBSSxFQUFFQyxJQUFJLENBQUM7RUFDckI7QUFDRjtBQUVBLGlFQUFlTCxNQUFNOzs7Ozs7Ozs7Ozs7OztBQ3RFckIsTUFBTW5DLElBQUksQ0FBQztFQUNUSyxXQUFXQSxDQUFDVyxNQUFNLEVBQUU7SUFDbEIsSUFBSSxDQUFDQSxNQUFNLEdBQUdBLE1BQU07SUFDcEIsSUFBSSxDQUFDb0MsSUFBSSxHQUFHLEVBQUU7RUFDaEI7RUFFQXhCLEdBQUdBLENBQUN5QixHQUFHLEVBQUU7SUFDUCxJQUFJLElBQUksQ0FBQ0QsSUFBSSxDQUFDRSxRQUFRLENBQUNELEdBQUcsQ0FBQyxJQUFJQSxHQUFHLEdBQUcsQ0FBQyxJQUFJQSxHQUFHLElBQUksSUFBSSxDQUFDckMsTUFBTSxFQUFFO01BQzVEO0lBQ0Y7SUFDQSxJQUFJLENBQUNvQyxJQUFJLENBQUNWLElBQUksQ0FBQ1csR0FBRyxDQUFDO0VBQ3JCO0VBRUF0RCxNQUFNQSxDQUFBLEVBQUc7SUFDUCxPQUFPLElBQUksQ0FBQ3FELElBQUksQ0FBQ3BDLE1BQU0sS0FBSyxJQUFJLENBQUNBLE1BQU07RUFDekM7QUFDRjtBQUVBLGlFQUFlaEIsSUFBSTs7Ozs7O1VDbEJuQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDNEM7QUFDa0M7QUFDNUM7QUFDSTtBQUV0QyxJQUFJdUQsV0FBVztBQUNmLElBQUlDLE9BQU87QUFDWCxJQUFJQyxJQUFJO0FBQ1IsSUFBSUMsV0FBVyxHQUFHLElBQUk7QUFDdEIsSUFBSUMscUJBQXFCLEdBQUcsSUFBSTtBQUNoQyxNQUFNQyxHQUFHLEdBQUcsSUFBSXpCLHVEQUFNLENBQUMsQ0FBQztBQUV4QixTQUFTMEIsYUFBYUEsQ0FBQSxFQUFHO0VBQ3ZCLE1BQU1DLFNBQVMsR0FBR3ZGLFFBQVEsQ0FBQ3dGLGNBQWMsQ0FBQyxRQUFRLENBQUM7RUFDbkRELFNBQVMsQ0FBQzlFLFdBQVcsQ0FBQ1osZ0VBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDOUMwRixTQUFTLENBQUM5RSxXQUFXLENBQUNaLGdFQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hEO0FBRUEsU0FBUzRGLE9BQU9BLENBQUNDLENBQUMsRUFBRTtFQUNsQixNQUFNdEYsRUFBRSxHQUFHc0YsQ0FBQyxDQUFDQyxNQUFNLENBQUNDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQztFQUNoRHpGLEVBQUUsQ0FBQ21FLEtBQUssQ0FBQyxDQUFDO0VBQ1YsTUFBTXVCLE1BQU0sR0FBRzFGLEVBQUUsQ0FBQ3lDLEdBQUcsQ0FBRXhDLENBQUMsSUFBSzBGLFFBQVEsQ0FBQzFGLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUM3QyxJQUNFNkUsSUFBSSxDQUFDekMsTUFBTSxHQUFHLENBQUMsSUFDZnVDLFdBQVcsQ0FBQzlDLFNBQVMsQ0FDbkIsSUFBSVQscURBQUksQ0FBQ3lELElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNqQlksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNUQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ1RWLHFCQUNGLENBQUMsRUFDRDtJQUNBLElBQUlGLElBQUksQ0FBQ3pDLE1BQU0sS0FBSyxDQUFDLEVBQUV1RCxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDOUUsMERBQVksQ0FBQzhELFdBQVcsRUFBRSxHQUFHLENBQUM7SUFDOUJFLElBQUksQ0FBQ1gsS0FBSyxDQUFDLENBQUM7RUFDZDtBQUNGO0FBRUEsU0FBU3lCLGlCQUFpQkEsQ0FBQSxFQUFHO0VBQzNCLE1BQU1DLE9BQU8sR0FBR2pHLFFBQVEsQ0FBQ3FCLGFBQWEsQ0FBQyxVQUFVLENBQUM7RUFDbEQ0RSxPQUFPLENBQUNDLFdBQVcsR0FBRyxvQkFBb0I7RUFDMUMsTUFBTXZGLEtBQUssR0FBR1gsUUFBUSxDQUFDWSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7RUFDbkRELEtBQUssQ0FBQ0UsT0FBTyxDQUFFQyxJQUFJLElBQUs7SUFDdEJBLElBQUksQ0FBQ3FGLGdCQUFnQixDQUFDLE9BQU8sRUFBRUMsa0JBQWtCLENBQUM7RUFDcEQsQ0FBQyxDQUFDO0FBQ0o7QUFFQSxTQUFTQSxrQkFBa0JBLENBQUNWLENBQUMsRUFBRTtFQUM3QixNQUFNdEYsRUFBRSxHQUFHc0YsQ0FBQyxDQUFDQyxNQUFNLENBQUNDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQztFQUNoRHpGLEVBQUUsQ0FBQ21FLEtBQUssQ0FBQyxDQUFDO0VBQ1YsTUFBTXVCLE1BQU0sR0FBRzFGLEVBQUUsQ0FBQ3lDLEdBQUcsQ0FBRXhDLENBQUMsSUFBSzBGLFFBQVEsQ0FBQzFGLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUU3QyxJQUFJNEUsT0FBTyxDQUFDM0QsS0FBSyxDQUFDd0UsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0VBRXpDYixPQUFPLENBQUMvQixhQUFhLENBQUM0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUVBLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMzQzVFLDBEQUFZLENBQUMrRCxPQUFPLEVBQUUsR0FBRyxDQUFDO0VBQzFCLElBQUlBLE9BQU8sQ0FBQ3pCLFVBQVUsQ0FBQyxDQUFDLEVBQUU7SUFDeEI2QyxhQUFhLENBQUMsT0FBTyxDQUFDO0VBQ3hCO0VBQ0FDLGNBQWMsQ0FBQyxDQUFDO0FBQ2xCO0FBRUEsU0FBU0EsY0FBY0EsQ0FBQSxFQUFHO0VBQ3hCakIsR0FBRyxDQUFDakIsWUFBWSxDQUFDWSxXQUFXLENBQUM7RUFDN0I5RCwwREFBWSxDQUFDOEQsV0FBVyxFQUFFLEdBQUcsQ0FBQztFQUM5QixJQUFJQSxXQUFXLENBQUN4QixVQUFVLENBQUMsQ0FBQyxFQUFFO0lBQzVCNkMsYUFBYSxDQUFDLElBQUksQ0FBQztFQUNyQjtBQUNGO0FBRUEsU0FBU0Usb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUIsSUFBSTVGLEtBQUssR0FBR1gsUUFBUSxDQUFDWSxnQkFBZ0IsQ0FBQyxjQUFjLENBQUM7RUFDckRELEtBQUssQ0FBQ0UsT0FBTyxDQUFFQyxJQUFJLElBQUs7SUFDdEJBLElBQUksQ0FBQzBGLG1CQUFtQixDQUFDLE9BQU8sRUFBRWYsT0FBTyxDQUFDO0VBQzVDLENBQUMsQ0FBQztFQUNGOUUsS0FBSyxHQUFHWCxRQUFRLENBQUNZLGdCQUFnQixDQUFDLFVBQVUsQ0FBQztFQUM3Q0QsS0FBSyxDQUFDRSxPQUFPLENBQUVDLElBQUksSUFBSztJQUN0QkEsSUFBSSxDQUFDMEYsbUJBQW1CLENBQUMsT0FBTyxFQUFFSixrQkFBa0IsQ0FBQztFQUN2RCxDQUFDLENBQUM7QUFDSjtBQUVBLFNBQVNDLGFBQWFBLENBQUNJLE1BQU0sRUFBRTtFQUM3QixNQUFNUixPQUFPLEdBQUdqRyxRQUFRLENBQUNxQixhQUFhLENBQUMsVUFBVSxDQUFDO0VBQ2xENEUsT0FBTyxDQUFDQyxXQUFXLEdBQUksR0FBRU8sTUFBTyxpQkFBZ0I7RUFFaERGLG9CQUFvQixDQUFDLENBQUM7RUFDdEJHLFVBQVUsQ0FBQyxNQUFNO0lBQ2ZoRyx5REFBVyxDQUFDLENBQUM7SUFDYmlHLEtBQUssQ0FBQyxDQUFDO0VBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQztBQUNWO0FBRUEsU0FBU0MsY0FBY0EsQ0FBQSxFQUFHO0VBQ3hCLE1BQU1qRyxLQUFLLEdBQUdYLFFBQVEsQ0FBQ1ksZ0JBQWdCLENBQUMsY0FBYyxDQUFDO0VBQ3ZERCxLQUFLLENBQUNFLE9BQU8sQ0FBRUMsSUFBSSxJQUFLO0lBQ3RCQSxJQUFJLENBQUNxRixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVWLE9BQU8sQ0FBQztFQUN6QyxDQUFDLENBQUM7QUFDSjtBQUVBLFNBQVNrQixLQUFLQSxDQUFBLEVBQUc7RUFDZixJQUFJeEIsV0FBVyxFQUFFO0lBQ2ZHLGFBQWEsQ0FBQyxDQUFDO0lBQ2ZILFdBQVcsR0FBRyxLQUFLO0VBQ3JCO0VBQ0FILFdBQVcsR0FBRyxJQUFJbkQsMERBQVMsQ0FBQyxDQUFDO0VBQzdCb0QsT0FBTyxHQUFHLElBQUlwRCwwREFBUyxDQUFDLENBQUM7RUFDekJvRCxPQUFPLENBQUN2QyxrQkFBa0IsQ0FBQyxDQUFDO0VBRTVCSCxPQUFPLENBQUNDLEdBQUcsQ0FBQ3lDLE9BQU8sQ0FBQ2xGLEtBQUssQ0FBQztFQUMxQm1GLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsTUFBTWUsT0FBTyxHQUFHakcsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLFVBQVUsQ0FBQztFQUNsRDRFLE9BQU8sQ0FBQ0MsV0FBVyxHQUFHLDBCQUEwQjtFQUVoRCxNQUFNVyxNQUFNLEdBQUc3RyxRQUFRLENBQUNxQixhQUFhLENBQUMsUUFBUSxDQUFDO0VBQy9Dd0YsTUFBTSxDQUFDVixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUNyQyxJQUFJZixxQkFBcUIsRUFBRTtNQUN6QnlCLE1BQU0sQ0FBQ1gsV0FBVyxHQUFHLFVBQVU7TUFDL0JkLHFCQUFxQixHQUFHLEtBQUs7SUFDL0IsQ0FBQyxNQUFNO01BQ0x5QixNQUFNLENBQUNYLFdBQVcsR0FBRyxZQUFZO01BQ2pDZCxxQkFBcUIsR0FBRyxJQUFJO0lBQzlCO0VBQ0YsQ0FBQyxDQUFDO0VBQ0Z3QixjQUFjLENBQUMsQ0FBQztBQUNsQjtBQUVBRCxLQUFLLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9Eb20uanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbW9kdWxlcy9TaGlwLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnRcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCb2FyZEVsZW1lbnQobmFtZSkge1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiKTtcbiAgYm9hcmQuaWQgPSBgYm9hcmQke25hbWV9YDtcbiAgLy8gQ3JlYXRlIHRoZSByb3dzIGFuZCBjb2x1bW5zXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcm93LmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29sLmNsYXNzTGlzdC5hZGQoXCJmaWVsZFwiKTtcbiAgICAgIGlmIChuYW1lID09PSBcIlBcIikge1xuICAgICAgICBjb2wuY2xhc3NMaXN0LmFkZChcInBsYXllckZpZWxkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sLmNsYXNzTGlzdC5hZGQoXCJhaUZpZWxkXCIpO1xuICAgICAgfVxuICAgICAgY29sLmlkID0gYCR7bmFtZX0ke2l9JHtqfWA7XG5cbiAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG4gIHJldHVybiBib2FyZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQm9hcmRzKCkge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCBjdXJyZW50Q2VsbCA9IGNlbGw7XG4gICAgY3VycmVudENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlCb2FyZChnYW1lYm9hcmQsIG5hbWUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke25hbWV9JHtpfSR7an1gKTtcbiAgICAgIC8vICAgZWwudGV4dENvbnRlbnQgPSBgJHtuYW1lfSR7aX0ke2p9YDtcbiAgICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbaV1bal0gJiYgIWdhbWVib2FyZC5zaG90c1tpXVtqXSAmJiBuYW1lID09PSBcIlBcIikge1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyYXlcIjtcbiAgICAgIH1cbiAgICAgIGlmIChnYW1lYm9hcmQubWlzc2VkU2hvdHNbaV1bal0pIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJsaWdodGdyYXlcIjtcbiAgICAgIH1cbiAgICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbaV1bal0gJiYgZ2FtZWJvYXJkLnNob3RzW2ldW2pdKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZGFya3JlZFwiO1xuICAgICAgfVxuICAgICAgaWYgKGdhbWVib2FyZC5ib2FyZFtpXVtqXSAmJiBnYW1lYm9hcmQuYm9hcmRbaV1bal0uaXNTdW5rKCkpIHtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcblxuY29uc3QgU0laRSA9IDEwO1xuY29uc3QgTlVNX1NISVBTID0gNTtcbmNvbnN0IFNISVBfTEVOR1RIUyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLnNob3RzID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICB0aGlzLmJvYXJkW2ldID0gQXJyYXkoU0laRSkuZmlsbChudWxsKTtcbiAgICAgIHRoaXMubWlzc2VkU2hvdHNbaV0gPSBBcnJheShTSVpFKS5maWxsKGZhbHNlKTtcbiAgICAgIHRoaXMuc2hvdHNbaV0gPSBBcnJheShTSVpFKS5maWxsKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpIHtcbiAgICBpZiAoIXRoaXMuaXNQbGFjZW1lbnRQb3NzaWJsZShzaGlwLCByb3csIGNvbHVtbiwgaXNWZXJ0aWNhbCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBwbGFjZSBzaGlwIGhlcmVcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJvYXJkW3JvdyArIGldW2NvbHVtbl0gPSBzaGlwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbHVtbiArIGldID0gc2hpcDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwbGFjZVNoaXBzUmFuZG9tbHkoKSB7XG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2hpcHMgPSBTSElQX0xFTkdUSFMubWFwKChsZW5ndGgpID0+IG5ldyBTaGlwKGxlbmd0aCkpO1xuXG4gICAgbGV0IHN1Y2Nlc2Z1bFBsYWNlbWVudHMgPSAwO1xuICAgIHdoaWxlIChzdWNjZXNmdWxQbGFjZW1lbnRzIDwgTlVNX1NISVBTKSB7XG4gICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBTSVpFKTtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIFNJWkUpO1xuICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7XG5cbiAgICAgIGlmICh0aGlzLnBsYWNlU2hpcChzaGlwc1tzdWNjZXNmdWxQbGFjZW1lbnRzXSwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpKSB7XG4gICAgICAgIHN1Y2Nlc2Z1bFBsYWNlbWVudHMrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKHJvdywgY29sdW1uKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbihyb3csIGNvbHVtbikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sdW1uXSkge1xuICAgICAgbGV0IGhpdEluZGV4ID0gMDtcbiAgICAgIC8vIGlzIGhvcml6b250YWxcbiAgICAgIGlmIChjb2x1bW4gPiAwICYmIHRoaXMuYm9hcmRbcm93XVtjb2x1bW4gLSAxXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChjb2x1bW4gLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3ddW2NvbHVtbiAtIGldKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlzIHZlcnRpY2FsXG4gICAgICBlbHNlIGlmIChyb3cgPiAwICYmIHRoaXMuYm9hcmRbcm93IC0gMV1bY29sdW1uXSkge1xuICAgICAgICBsZXQgaSA9IDE7XG4gICAgICAgIHdoaWxlIChyb3cgLSBpID49IDAgJiYgdGhpcy5ib2FyZFtyb3cgLSBpXVtjb2x1bW5dKSB7XG4gICAgICAgICAgaGl0SW5kZXgrKztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2x1bW5dLmhpdChoaXRJbmRleCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5taXNzZWRTaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzUGxhY2VtZW50UG9zc2libGUoc2hpcCwgcm93LCBjb2x1bW4sIGlzVmVydGljYWwpIHtcbiAgICAvLyBwb3NpdGlvbiBvdXQgb2YgZ2FtZWJvYXJkXG4gICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbihyb3csIGNvbHVtbikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIC8vICAgc2hpcCBkb2Vzbid0IGZpdCBpbiB0aGUgZ2FtZWJvYXJkXG4gICAgICBpZiAocm93ICsgc2hpcC5sZW5ndGggPiBTSVpFKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyAgIGFueSBvZiB0aGUgZmllbGRzIGlzIHRha2VuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgaV1bY29sdW1uXSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gYW55IG9mIG5laWdoYm91cnMgY2VsbHMgaXMgdGFrZW5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCB4ID0gLTE7IHggPD0gMTsgeCsrKSB7XG4gICAgICAgICAgZm9yIChsZXQgeSA9IC0xOyB5IDw9IDE7IHkrKykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbihyb3cgKyB4ICsgaSwgY29sdW1uICsgeSkpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3cgKyB4ICsgaV1bY29sdW1uICsgeV0pIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbHVtbiArIHNoaXAubGVuZ3RoID4gU0laRSkgcmV0dXJuIGZhbHNlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sdW1uICsgaV0gIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCB4ID0gLTE7IHggPD0gMTsgeCsrKSB7XG4gICAgICAgICAgZm9yIChsZXQgeSA9IC0xOyB5IDw9IDE7IHkrKykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbihyb3cgKyB4LCBjb2x1bW4gKyB5ICsgaSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcm93ICsgeF1bY29sdW1uICsgeSArIGldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICBsZXQgaXNCb2FyZEVtcHR5ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNJWkU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBTSVpFOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0pIHtcbiAgICAgICAgICBpc0JvYXJkRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoIXRoaXMuYm9hcmRbaV1bal0uaXNTdW5rKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICFpc0JvYXJkRW1wdHk7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSAhPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldEVtcHR5RmllbGRzQW1vdW50KCkge1xuICAgIGxldCByZXN1bHQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNJWkU7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtqXSA9PT0gbnVsbCkgcmVzdWx0Kys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpc1ZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4pIHtcbiAgICByZXR1cm4gcm93ID49IDAgJiYgcm93IDwgU0laRSAmJiBjb2x1bW4gPj0gMCAmJiBjb2x1bW4gPCBTSVpFO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuYWxyZWFkeUhpdCA9IFtdO1xuICAgIHRoaXMubGFzdEhpdCA9IG51bGw7XG4gIH1cblxuICBhdHRhY2socG9zWCwgcG9zWSwgZ2FtZWJvYXJkKSB7XG4gICAgaWYgKHRoaXMuaGFzQWxyZWFkeUhpdChwb3NYLCBwb3NZKSkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYWxyZWFkeUhpdC5wdXNoKFtwb3NYLCBwb3NZXSk7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHBvc1gsIHBvc1kpO1xuICB9XG5cbiAgcmFuZG9tQXR0YWNrKGdhbWVib2FyZCkge1xuICAgIGlmICh0aGlzLmFscmVhZHlIaXQubGVuZ3RoID09PSAxMDApIHJldHVybjtcbiAgICBsZXQgcG9zWDtcbiAgICBsZXQgcG9zWTtcbiAgICBsZXQgcHJvYmFibGVTcG90cyA9IFtdO1xuICAgIGlmICh0aGlzLmxhc3RIaXQpIHtcbiAgICAgIHByb2JhYmxlU3BvdHMgPSB0aGlzLmF0dGFja3NBcm91bmRQb2ludCh0aGlzLmxhc3RIaXRbMF0sIHRoaXMubGFzdEhpdFsxXSk7XG4gICAgICBbcG9zWCwgcG9zWV0gPSBwcm9iYWJsZVNwb3RzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFtwb3NYLCBwb3NZXSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21Qb3NpdGlvbigpO1xuICAgIH1cbiAgICB3aGlsZSAodGhpcy5oYXNBbHJlYWR5SGl0KHBvc1gsIHBvc1kpKSB7XG4gICAgICBpZiAocHJvYmFibGVTcG90cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIFtwb3NYLCBwb3NZXSA9IHByb2JhYmxlU3BvdHMuc2hpZnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFtwb3NYLCBwb3NZXSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21Qb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5hdHRhY2socG9zWCwgcG9zWSwgZ2FtZWJvYXJkKSkge1xuICAgICAgdGhpcy5sYXN0SGl0ID0gW3Bvc1gsIHBvc1ldO1xuICAgIH1cbiAgfVxuXG4gIC8vIHVwZGF0ZSBzbyBpdCBrZWVwcyBsb29raW5nIGluIHRoZSBmb3VuZCBzaGlwIGRpcmVjdGlvbiBhbmQgbm90IGFsbCB0aGUgc3F1YXJlcyBhcm91bmQgaXRcbiAgYXR0YWNrc0Fyb3VuZFBvaW50KHBvc1gsIHBvc1kpIHtcbiAgICBjb25zdCBhcnJheU9mUG9zID0gW1xuICAgICAgW3Bvc1gsIHBvc1kgLSAxXSxcbiAgICAgIFtwb3NYLCBwb3NZICsgMV0sXG4gICAgICBbcG9zWCAtIDEsIHBvc1ldLFxuICAgICAgW3Bvc1ggKyAxLCBwb3NZXSxcbiAgICBdO1xuICAgIGlmIChwb3NYID09PSAwKSB7XG4gICAgICBhcnJheU9mUG9zLnNwbGljZSgyLCAxKTtcbiAgICB9XG4gICAgaWYgKHBvc1kgPT09IDApIHtcbiAgICAgIGFycmF5T2ZQb3Muc3BsaWNlKDAsIDEpO1xuICAgIH1cbiAgICBpZiAocG9zWCA9PT0gOSkge1xuICAgICAgYXJyYXlPZlBvcy5zcGxpY2UoMywgMSk7XG4gICAgfVxuICAgIGlmIChwb3NZID09PSA5KSB7XG4gICAgICBhcnJheU9mUG9zLnNwbGljZSgxLCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5T2ZQb3M7XG4gIH1cblxuICBoYXNBbHJlYWR5SGl0KHBvc1gsIHBvc1kpIHtcbiAgICByZXR1cm4gdGhpcy5hbHJlYWR5SGl0LnNvbWUoKFt4LCB5XSkgPT4geCA9PT0gcG9zWCAmJiB5ID09PSBwb3NZKTtcbiAgfVxuXG4gIGdlbmVyYXRlUmFuZG9tUG9zaXRpb24oKSB7XG4gICAgY29uc3QgcG9zWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICBjb25zdCBwb3NZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIHJldHVybiBbcG9zWCwgcG9zWV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuaGl0cyA9IFtdO1xuICB9XG5cbiAgaGl0KHBvcykge1xuICAgIGlmICh0aGlzLmhpdHMuaW5jbHVkZXMocG9zKSB8fCBwb3MgPCAwIHx8IHBvcyA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmhpdHMucHVzaChwb3MpO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLmhpdHMubGVuZ3RoID09PSB0aGlzLmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11c2UtYmVmb3JlLWRlZmluZSAqL1xuaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9tb2R1bGVzL0dhbWVib2FyZFwiO1xuaW1wb3J0IHsgY2xlYXJCb2FyZHMsIGNyZWF0ZUJvYXJkRWxlbWVudCwgZGlzcGxheUJvYXJkIH0gZnJvbSBcIi4vbW9kdWxlcy9Eb21cIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL21vZHVsZXMvU2hpcFwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9tb2R1bGVzL1BsYXllclwiO1xuXG5sZXQgYm9hcmRQbGF5ZXI7XG5sZXQgYm9hcmRBaTtcbmxldCBsZW5zO1xubGV0IGluaXRpYWxHYW1lID0gdHJ1ZTtcbmxldCBvcmllbnRhdGlvbklzVmVydGljYWwgPSB0cnVlO1xuY29uc3QgYm90ID0gbmV3IFBsYXllcigpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplRG9tKCkge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkc1wiKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUJvYXJkRWxlbWVudChcIlBcIikpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRFbGVtZW50KFwiQVwiKSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNoaXAoZSkge1xuICBjb25zdCBpZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImlkXCIpLnNwbGl0KFwiXCIpO1xuICBpZC5zaGlmdCgpO1xuICBjb25zdCBjb29yZHMgPSBpZC5tYXAoKGkpID0+IHBhcnNlSW50KGksIDEwKSk7XG4gIGlmIChcbiAgICBsZW5zLmxlbmd0aCA+IDAgJiZcbiAgICBib2FyZFBsYXllci5wbGFjZVNoaXAoXG4gICAgICBuZXcgU2hpcChsZW5zWzBdKSxcbiAgICAgIGNvb3Jkc1swXSxcbiAgICAgIGNvb3Jkc1sxXSxcbiAgICAgIG9yaWVudGF0aW9uSXNWZXJ0aWNhbFxuICAgIClcbiAgKSB7XG4gICAgaWYgKGxlbnMubGVuZ3RoID09PSAxKSBhbGxvd1BsYXllckF0dGFjaygpO1xuICAgIGRpc3BsYXlCb2FyZChib2FyZFBsYXllciwgXCJQXCIpO1xuICAgIGxlbnMuc2hpZnQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvd1BsYXllckF0dGFjaygpIHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IFwic2luayB5b3VyIG9wcG9uZW50XCI7XG4gIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5haUZpZWxkXCIpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tBdHRhY2tTdWNjZXNzKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQXR0YWNrU3VjY2VzcyhlKSB7XG4gIGNvbnN0IGlkID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaWRcIikuc3BsaXQoXCJcIik7XG4gIGlkLnNoaWZ0KCk7XG4gIGNvbnN0IGNvb3JkcyA9IGlkLm1hcCgoaSkgPT4gcGFyc2VJbnQoaSwgMTApKTtcblxuICBpZiAoYm9hcmRBaS5zaG90c1tjb29yZHNbMF1dW2Nvb3Jkc1sxXV0pIHJldHVybjtcblxuICBib2FyZEFpLnJlY2VpdmVBdHRhY2soY29vcmRzWzBdLCBjb29yZHNbMV0pO1xuICBkaXNwbGF5Qm9hcmQoYm9hcmRBaSwgXCJBXCIpO1xuICBpZiAoYm9hcmRBaS5pc0dhbWVPdmVyKCkpIHtcbiAgICBkaXNwbGF5V2lubmVyKFwiaHVtYW5cIik7XG4gIH1cbiAgYWxsb3dCb3RBdHRhY2soKTtcbn1cblxuZnVuY3Rpb24gYWxsb3dCb3RBdHRhY2soKSB7XG4gIGJvdC5yYW5kb21BdHRhY2soYm9hcmRQbGF5ZXIpO1xuICBkaXNwbGF5Qm9hcmQoYm9hcmRQbGF5ZXIsIFwiUFwiKTtcbiAgaWYgKGJvYXJkUGxheWVyLmlzR2FtZU92ZXIoKSkge1xuICAgIGRpc3BsYXlXaW5uZXIoXCJBSVwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgbGV0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5ZXJGaWVsZFwiKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZFNoaXApO1xuICB9KTtcbiAgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFpRmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGVja0F0dGFja1N1Y2Nlc3MpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVdpbm5lcih3aW5uZXIpIHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IGAke3dpbm5lcn0gaXMgdGhlIHdpbm5lciFgO1xuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNsZWFyQm9hcmRzKCk7XG4gICAgc2V0dXAoKTtcbiAgfSwgNTAwMCk7XG59XG5cbmZ1bmN0aW9uIGdldFBsYXllck1vdmVzKCkge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyRmllbGRcIik7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhZGRTaGlwKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBpZiAoaW5pdGlhbEdhbWUpIHtcbiAgICBpbml0aWFsaXplRG9tKCk7XG4gICAgaW5pdGlhbEdhbWUgPSBmYWxzZTtcbiAgfVxuICBib2FyZFBsYXllciA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgYm9hcmRBaSA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgYm9hcmRBaS5wbGFjZVNoaXBzUmFuZG9tbHkoKTtcblxuICBjb25zb2xlLmxvZyhib2FyZEFpLmJvYXJkKTtcbiAgbGVucyA9IFsyLCAzLCAzLCA0LCA1XTtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgY29udGVudC50ZXh0Q29udGVudCA9IFwicGxhY2UgeW91ciA1IHNoaXBzIGJlbG93XCI7XG5cbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaWYgKG9yaWVudGF0aW9uSXNWZXJ0aWNhbCkge1xuICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gXCJWZXJ0aWNhbFwiO1xuICAgICAgb3JpZW50YXRpb25Jc1ZlcnRpY2FsID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiSG9yaXpvbnRhbFwiO1xuICAgICAgb3JpZW50YXRpb25Jc1ZlcnRpY2FsID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBnZXRQbGF5ZXJNb3ZlcygpO1xufVxuXG5zZXR1cCgpO1xuIl0sIm5hbWVzIjpbImNyZWF0ZUJvYXJkRWxlbWVudCIsIm5hbWUiLCJib2FyZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImlkIiwiaSIsInJvdyIsImoiLCJjb2wiLCJhcHBlbmRDaGlsZCIsImNsZWFyQm9hcmRzIiwiY2VsbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImNlbGwiLCJjdXJyZW50Q2VsbCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZGlzcGxheUJvYXJkIiwiZ2FtZWJvYXJkIiwiZWwiLCJxdWVyeVNlbGVjdG9yIiwic2hvdHMiLCJtaXNzZWRTaG90cyIsImlzU3VuayIsIlNoaXAiLCJTSVpFIiwiTlVNX1NISVBTIiwiU0hJUF9MRU5HVEhTIiwiR2FtZWJvYXJkIiwiY29uc3RydWN0b3IiLCJpbml0aWFsaXplIiwiQXJyYXkiLCJmaWxsIiwicGxhY2VTaGlwIiwic2hpcCIsImNvbHVtbiIsImlzVmVydGljYWwiLCJpc1BsYWNlbWVudFBvc3NpYmxlIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInBsYWNlU2hpcHNSYW5kb21seSIsImlzRW1wdHkiLCJzaGlwcyIsIm1hcCIsInN1Y2Nlc2Z1bFBsYWNlbWVudHMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJyZWNlaXZlQXR0YWNrIiwiaXNWYWxpZFBvc2l0aW9uIiwiaGl0SW5kZXgiLCJoaXQiLCJ4IiwieSIsImlzR2FtZU92ZXIiLCJpc0JvYXJkRW1wdHkiLCJnZXRFbXB0eUZpZWxkc0Ftb3VudCIsInJlc3VsdCIsIlBsYXllciIsImFscmVhZHlIaXQiLCJsYXN0SGl0IiwiYXR0YWNrIiwicG9zWCIsInBvc1kiLCJoYXNBbHJlYWR5SGl0IiwicHVzaCIsInJhbmRvbUF0dGFjayIsInByb2JhYmxlU3BvdHMiLCJhdHRhY2tzQXJvdW5kUG9pbnQiLCJzaGlmdCIsImdlbmVyYXRlUmFuZG9tUG9zaXRpb24iLCJhcnJheU9mUG9zIiwic3BsaWNlIiwic29tZSIsIl9yZWYiLCJoaXRzIiwicG9zIiwiaW5jbHVkZXMiLCJib2FyZFBsYXllciIsImJvYXJkQWkiLCJsZW5zIiwiaW5pdGlhbEdhbWUiLCJvcmllbnRhdGlvbklzVmVydGljYWwiLCJib3QiLCJpbml0aWFsaXplRG9tIiwiY29udGFpbmVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRTaGlwIiwiZSIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInNwbGl0IiwiY29vcmRzIiwicGFyc2VJbnQiLCJhbGxvd1BsYXllckF0dGFjayIsImNvbnRlbnQiLCJ0ZXh0Q29udGVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjaGVja0F0dGFja1N1Y2Nlc3MiLCJkaXNwbGF5V2lubmVyIiwiYWxsb3dCb3RBdHRhY2siLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ3aW5uZXIiLCJzZXRUaW1lb3V0Iiwic2V0dXAiLCJnZXRQbGF5ZXJNb3ZlcyIsImJ1dHRvbiJdLCJzb3VyY2VSb290IjoiIn0=
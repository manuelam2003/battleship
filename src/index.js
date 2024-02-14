/* eslint-disable no-use-before-define */
import Gameboard from "./modules/Gameboard";
import { clearBoards, createBoardElement, displayBoard } from "./modules/dom";
import Ship from "./modules/Ship";

let boardPlayer;
let boardAi;
let lens;
let bot;
function initializeDom() {
  const container = document.getElementById("boards");
  container.appendChild(createBoardElement("P"));
  container.appendChild(createBoardElement("A"));
}

function addShip(e) {
  const id = e.target.getAttribute("id").split("");
  id.shift();
  const coords = id.map((i) => parseInt(i, 10));
  // TODO: orientacion de los barcos
  if (
    lens.length > 0 &&
    boardPlayer.placeShip(new Ship(lens[0]), coords[0], coords[1], true)
  ) {
    if (lens.length === 1) allowPlayerAttack();
    displayBoard(boardPlayer, "P");
    lens.shift();
  }
}

function allowPlayerAttack() {
  const content = document.querySelector("#content");
  content.textContent = "sink your opponent";
  const cells = document.querySelectorAll(".aiField");
  cells.forEach((cell) => {
    cell.addEventListener("click", checkAttackSuccess);
  });
}

function checkAttackSuccess(e) {
  const id = e.target.getAttribute("id").split("");
  id.shift();
  const coords = id.map((i) => parseInt(i, 10));

  if (boardAi.hit[coords[0]][coords[1]]) return;

  boardAi.receiveAttack(coords[0], coords[1]);
  displayBoard(boardAi, "A");
  if (boardAi.isGameOver()) {
    displayWinner("human");
  }

  allowBotAttack();
}

function allowBotAttack() {
  bot.randomAttack(boardPlayer);
  displayBoard(boardPlayer, "P");
  if (boardPlayer.isGameOver()) {
    displayWinner("player");
  }
}

function removeEventListeners() {
  let cells = document.querySelectorAll(".playerField");
  cells.forEach((cell) => {
    cell.removeEventListener("click", addShip);
  });
  cells = document.querySelectorAll(".aiField");
  cells.forEach((cell) => {
    cell.removeEventListener("click", checkAttackSuccess);
  });
}

function displayWinner(winner) {
  const content = document.querySelector("#content");
  content.textContent = `${winner} is the winner!`;

  removeEventListeners();
  setTimeout(() => {
    clearBoards();
    setup();
  }, 5000);
}

function getPlayerMoves() {
  const cells = document.querySelectorAll(".playerField");
  cells.forEach((cell) => {
    cell.addEventListener("click", addShip);
  });
}

function setup() {
  initializeDom();
  boardPlayer = new Gameboard();
  boardAi = new Gameboard();
  lens = [2, 3, 3, 4, 5];

  getPlayerMoves();
}

setup();

// eslint-disable-next-line import/prefer-default-export
export function createBoardElement(name) {
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

export function clearBoards() {
  const cells = document.querySelectorAll(".field");
  cells.forEach((cell) => {
    const currentCell = cell;
    currentCell.style.backgroundColor = "white";
  });
}

export function displayBoard(gameboard, name) {
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

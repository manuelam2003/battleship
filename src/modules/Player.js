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

export default Player;

/* eslint-disable class-methods-use-this */
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
    const arrayOfPos = [
      [posX, posY - 1],
      [posX, posY + 1],
      [posX - 1, posY],
      [posX + 1, posY],
    ];
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
    return this.alreadyHit.some(([x, y]) => x === posX && y === posY);
  }

  generateRandomPosition() {
    const posX = Math.floor(Math.random() * 10);
    const posY = Math.floor(Math.random() * 10);
    return [posX, posY];
  }
}

export default Player;

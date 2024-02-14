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

export default Ship;

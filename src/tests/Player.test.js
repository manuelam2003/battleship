import Gameboard from "../modules/Gameboard";
import Player from "../modules/Player";
import Ship from "../modules/Ship";

describe("Player", () => {
  let player;
  let gameboard;
  let ship;

  beforeEach(() => {
    player = new Player("p1");
    gameboard = new Gameboard();
    ship = new Ship(3);
  });

  test("creates and initializes an object", () => {
    expect(player).toEqual({ name: "p1", alreadyHit: [], lastHit: null });
  });

  test("attacks", () => {
    gameboard.placeShip(ship, 1, 1, true);
    player.attack(1, 1, gameboard);
    player.attack(2, 1, gameboard);
    player.attack(3, 1, gameboard);
    expect(gameboard.isGameOver()).toBe(true);
  });

  test("randomly attacks", () => {
    gameboard.placeShip(ship, 1, 1, true);
    for (let i = 0; i < 100; i++) {
      player.randomAttack(gameboard);
    }
    expect(gameboard.isGameOver()).toBe(true);
  });
});

// 0 Floor
// 1 Wall
// 2 Key
// 3 Door
// S Player start
const GAME_MAP = [
  "111111111111",
  "110000002001",
  "110111111111",
  "100103030001",
  "101111111101",
  "101010001001",
  "101010101011",
  "101000001001",
  "101010000001",
  "101010P00P01",
  "100000000001",
  "111111111111"
];
const TILE_SIZE = 30;


class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.inventory = [];
  }
  pos() {
    return [this.x, this.y];
  }
  move(x, y) {
    this.x += x;
    this.y += y;
  }
  grabItem(item) {
    this.inventory.push(item);
  }
  hasItem(item) {
    return this.inventory.includes(item);
  }
  show() {
    fill(100, 100, 255);
    rect(this.x * TILE_SIZE + 5, this.y * TILE_SIZE + 5, TILE_SIZE - 10, TILE_SIZE - 10);
  }
}


class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visible = true;
  }
  show(x, y) {}
  update() {}
  pushAgainst() {}
  standOn() {}
}


class Floor extends Tile {
  constructor(x, y) {
    super(x, y);
    this.color = 40;
  }
  show(x, y) {
    fill(this.color);
    rect(x * TILE_SIZE,
      y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE);
  }
  pushAgainst(tile, direction) {
    return true; // Always move into empty floor tile.
  }
}


class Wall extends Tile {
  constructor(x, y) {
    super(x, y);
    this.color = 200;
  }
  show(x, y) {
    fill(this.color);
    rect(x * TILE_SIZE,
      y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE);
  }
  pushAgainst(tile, direction) {
    return false; // Never move through walls
  }
}


class Door extends Tile {
  constructor(x, y) {
    super(x, y);
    this.color = color(0, 150, 150);
    this.isOpen = false;
  }
  show(x, y) {
    if (this.isOpen == false) {
      fill(this.color);
      rect(x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE);
    }
  }
  pushAgainst(tile, direction) {
    if (this.isOpen) {
      return true;
    } else if (player.hasItem("Key")) {
      this.isOpen = true;
      return false;
    }
    return false;
  }
}


class Key extends Tile {
  constructor(x, y) {
    super(x, y);
    this.color = color(245, 239, 66);
    this.isObtained = false;
  }
  show(x, y) {
    if (this.isObtained == false) {
      fill(this.color);
      rect(x * TILE_SIZE + 10,
        y * TILE_SIZE + 10,
        TILE_SIZE - 20,
        TILE_SIZE - 20);
    }
  }
  pushAgainst() {
    this.isObtained = true;
    if (!player.hasItem("Key")) {
      player.grabItem("Key");
    }
    return true;
  }
}


class PushBlock extends Tile {
  constructor(x, y) {
    super(x, y);
    this.color = color(255, 150, 100);
  }
  show(x, y) {
      fill(this.color);
      rect(x * TILE_SIZE + 10,
        y * TILE_SIZE + 10,
        TILE_SIZE - 20,
        TILE_SIZE - 20);
  }
  pushAgainst(moveDir) {
    let nextTile = createVector(this.x + moveDir.x, this.y + moveDir.y);
	let isMovable = game_map.pushAgainst(nextTile, moveDir);
	console.log(nextTile)
	if (isMovable) {
	  game_map.swapTiles({x:this.x,y:this.y},nextTile)
      this.y += moveDir.x;
	  this.x += moveDir.y;
	  return true;
    }
    return false;
  }
}


class Game_Map {
  constructor() {
    //this.tile_array;
  }
  set(tile_array) {
    this.tile_array = tile_array;
  }
  load_map(map_data){
	  
  }
  update() {
    //for each tile, run tile.update() 
  }
  pushAgainst(tile, direction) {
	console.log(this.tile_array[tile.y][tile.x].pushAgainst(direction));
    return this.tile_array[tile.x][tile.y].pushAgainst(direction);
  }
  swapTiles(t1, t2){
	  let tempTile = this.tile_array[t1.y][t1.x];
	  this.tile_array[t1.y][t1.x] = this.tile_array[t2.y][t2.x];
	  this.tile_array[t2.y][t2.x] = tempTile;
  }
  show() {
    for (let i = 0; i < this.tile_array[0].length; i++) {
      for (let j = 0; j < this.tile_array.length; j++) {
        this.tile_array[j][i].show(j, i);
      }
    }
  }
}


let game_map = new Game_Map();
let player = new Player(10, 10);

function setup() {
  createCanvas(480, 480);

  // Load Map function
  let temp_map = [];
  for (let x = 0; x < GAME_MAP[0].length; x++) {
    temp_map.push([]);
    for (let y = 0; y < GAME_MAP.length; y++) {
      switch (GAME_MAP[y][x]) {
        case '0':
          temp_map[x].push(new Floor(x, y));
          break;
        case '1':
          temp_map[x].push(new Wall(x, y));
          break;
        case '2':
          temp_map[x].push(new Key(x, y));
          break;
        case '3':
          temp_map[x].push(new Door(x, y));
          break;
        case 'P':
          temp_map[x].push(new PushBlock(x, y));
          break;
        default:
          temp_map[x].push(new Floor(x, y));
          break;
      }
    }
  }
  game_map.set(temp_map)

}

function draw() {
  background(0);
  game_map.show();
  player.show();
}


function keyPressed() {
  let moveDir = {x : 0, y : 0}

  switch (keyCode) {
    case LEFT_ARROW:
      moveDir.x = -1;
      break;
    case RIGHT_ARROW:
      moveDir.x = 1;
      break;
    case UP_ARROW:
      moveDir.y = -1;
      break;
    case DOWN_ARROW:
      moveDir.y = 1;
      break;
  }

  let standTile = createVector(player.y, player.x);
  let pushedTile = createVector(player.y + moveDir.y, player.x + moveDir.x)

  //game_map.standOn(standTile);
  let isMovable = game_map.pushAgainst(pushedTile, moveDir);

  if (isMovable) {
    player.move(moveDir.x, moveDir.y);
  }
}
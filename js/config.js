let background = new Image(1024, 640);
background.src = './assets/background.png';
let tiles = new Image(1024, 64);
tiles.src = './assets/tiles.png';
let inserterSlide = new Image(1024, 640);
inserterSlide.src = './assets/inserterSlide.png';
let inserterImg = new Image(96, 96);
inserterImg.src = './assets/inserter.png';
let playerImg = new Image(384, 64);
playerImg.src = './assets/player.png';
let cards = new Image(768, 160);
cards.src = './assets/cards.png';
let items = new Image(128, 64);
items.src = './assets/items.png';
let gameOver = new Image(448, 200);
gameOver.src = './assets/gameOver.png';
let count = 0;
let playerFrame = 0;
let lanes = ['a','b','c','d'];
let laneHeight = [128,192,256,320];
let waitingKeys = [];
let level = 'game';
let percent = 10;

function getRandom(min,max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomTile(hazardPercent) {
  if ( getRandom(0,100) <= hazardPercent) {
    return getRandom(16,18);
  } else {
    return getRandom(0,16);
  }
}

let platform = {
  a : [],
  b : [],
  c : [],
  d : []
};

let player = {x:54,lane:getRandom(0,4)};

let hand = [getRandom(0,4),getRandom(0,4),getRandom(0,4),getRandom(0,4)];

let inserter = {x:304,lane:getRandom(0,4)};

for (let i = 0; i < lanes.length; i++) {
  for (let j = 0; j <= 960; j+=64) {
    platform[lanes[i]].push({x:j,y:laneHeight[i],tilePos:getRandom(0,16),item:null});
  }
}

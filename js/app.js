let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/10;
let windowedWidth = 1024;
let windowedHeight = 640;
canvas.width = windowedWidth;
canvas.height = windowedHeight;

function update() {
  if (level == 'game') {
    ctx.drawImage(background,0,0);
    //add new tile at begining of each lane
    if (count % 32 === 0) {
      for (let i = 0; i < lanes.length; i++) {
        platform[lanes[i]].push({x:1024,y:laneHeight[i],tilePos:getRandomTile(percent),item:null});
      }
    }
    //shift tiles left and draw them
    for (lane in platform) {
      platform[lane].forEach(tile => {
        ctx.drawImage(tiles,tile.tilePos*64,0,64,64,tile.x,tile.y,64,64);
        if (tile.item != null) {
          ctx.drawImage(items,tile.item*64,0,64,64,tile.x,tile.y,64,64);
        }
        tile.x-=2;
        if(tile.x < -128) {
          platform[lane].shift();
        }
      });
    }
    ctx.drawImage(inserterSlide,0,0);
    ctx.drawImage(inserterImg,inserter.x,laneHeight[inserter.lane]-16);
    ctx.drawImage(playerImg,playerFrame*64,0,64,64,player.x,laneHeight[player.lane],64,64);
    for (let i = 0; i < hand.length; i++) {
      if (hand[i] != null) {
        ctx.drawImage(cards,hand[i]*128,0,128,160,160+(192*i),416,128,160);
      }
    }
    count++;
    ctx.font = "30px Arial";
    ctx.fillText(Math.floor(count/10),776,48);
    if (count % 4 === 0) {
      playerFrame < 5 ? playerFrame++ : playerFrame = 0;
    }
    if (count % 2000 === 0) {
      percent+=1;
    }
    if (platform[lanes[player.lane]][2].item == 0) {
      player.lane--;
    }
    if (platform[lanes[player.lane]][2].item == 1) {
      player.lane++;
    }
    if (player.lane < 0 || player.lane > 3 ||
      (platform[lanes[player.lane]][2].tilePos == 16 && platform[lanes[player.lane]][2].item != 3) ||
      (platform[lanes[player.lane]][2].tilePos == 17 && platform[lanes[player.lane]][2].item != 2)
    ) {
      level = 'end';
    }
  }
  if (level == 'end') {
    ctx.drawImage(gameOver,288,180);
    if (waitingKeys.includes(32)) {
      location.reload();
    }
  }
  requestAnimationFrame(update);
}

window.addEventListener("load", function() {
  update();
});

document.addEventListener("keydown", function(e) {
  //up
  if(e.keyCode === 38 && !waitingKeys.includes(38) && inserter.lane > 0) {
    inserter.lane -= 1;
  }
  //down
  if(e.keyCode === 40 && !waitingKeys.includes(40) && inserter.lane < 3) {
    inserter.lane += 1;
  }

  //Q W E R
  let cardCodes = [81,87,69,82];
  for ( let i = 0; i < cardCodes.length; i++) {
    if(e.keyCode === cardCodes[i] && !waitingKeys.includes(cardCodes[i])) {
      let curLane = platform[lanes[inserter.lane]];
      for (let j = 0; j < curLane.length; j++) {
        curTile = curLane[j];
        if (curTile.x > 288) {
          if((curTile.tilePos <= 15 ||
          (curTile.tilePos == 16 && hand[i] == 3) ||
          (curTile.tilePos == 17 && hand[i] == 2)) &&
          curTile.item == null
          ) {
            curTile.item = hand[i];
            hand[i] = null;
            setTimeout(()=> {
              hand[i] = getRandom(0,4);
            }, 1000);
          }
          break;
        }
      }
    }
  }
  if(!waitingKeys.includes(e.keyCode)) {
    waitingKeys.push(e.keyCode);
  }
}, false);

document.addEventListener("keyup", function(e) {
  if(waitingKeys.includes(e.keyCode)) {
    waitingKeys.splice(waitingKeys.indexOf(e.keyCode),1);
  }
}, false);

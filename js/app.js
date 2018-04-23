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
    ctx.drawImage(inserterImg,inserter.x,laneHeight[inserter.lane]-20);
    ctx.drawImage(jumping?playerJump:playerImg,playerFrame*64,0,64,64,player.x,laneHeight[player.lane],64,64);
    for (let i = 0; i < hand.length; i++) {
      if (hand[i] != null) {
        ctx.drawImage(cards,hand[i]*128,0,128,160,160+(192*i),416,128,160);
      }
    }
    count++;
    ctx.font = "24px Arial";
    ctx.fillText(Math.floor(count/10),784,50);
    if (count % 3 === 0) {
      if (jumping) {
        if (landingCount > 4) {
          if (playerFrame < 4) {
            playerFrame++;
          }
        } else {
          playerFrame++;
        }
        landingCount--;
      } else {
        playerFrame < 13 ? playerFrame++ : playerFrame = 0;
      }
    }
    if (landingCount === 0) {
      jumping = false;
    }

    if (count % 1000 === 0) {
      percent+=1;
    }
    //Player Tile
    let pt = platform[lanes[player.lane]][2];

    if(pt.item == 4 && !jumping) {
      jumping = true;
      playerFrame = 0;
      landingCount = 44;
    }

    if(pt.item == 5 && !jumping) {
      jumping = true;
      playerFrame = 0;
      landingCount = 23;
    }

    if (pt.item == 0 && !jumping) {
      player.lane--;
    }
    if (platform[lanes[player.lane]] && pt.item == 1 && !jumping) {
      player.lane++;
    }
    if (player.lane < 0 || player.lane > 3 || (pt.tilePos > 15 && !placementRules[pt.tilePos].includes(pt.item) && !jumping)) {
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
  //Card Placement
  for ( let i = 0; i < cardCodes.length; i++) {
    if(e.keyCode === cardCodes[i] && !waitingKeys.includes(cardCodes[i]) && hand[i] != null) {
      let curTile;
      if (platform[lanes[inserter.lane]][6].x > 288) {
        curTile = platform[lanes[inserter.lane]][6];
      } else {
        curTile = platform[lanes[inserter.lane]][7];
      }
      if ( (curTile.tilePos <= 15 || placementRules[curTile.tilePos].includes(hand[i])) && curTile.item == null)  {
        curTile.item = hand[i];
        hand[i] = null;
        setTimeout(()=> {
          hand[i] = getRandom(0,6);
        }, 1000);
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

/* global players: false, myId: false, bullets: false */

let kill = false;

const isCollision = (rect1, rect2) => {
  if (
    rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
  ) {
    return true;
  }
  return false;
};

const translateCanvas = (x, y, width, height, canvasWidth, canvasHeight, ctx) => {
  const xToTranslate = Math.round(-(x + (width / 2) - (canvasWidth / 2)));
  const yToTranslate = Math.round(-(y + (height / 2) - (canvasHeight / 2)));
  ctx.translate(xToTranslate, yToTranslate);
};

const game = (map) => {//eslint-disable-line no-unused-vars
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const setSize = () => {
    canvas.setAttribute("width", innerWidth.toString());
    canvas.setAttribute("height", innerHeight.toString());
  };
  onresize = setSize;
  setSize();

  let hasLived = false;

  const draw = function(){
    let player = players.filter(player => player.id === myId)[0];
    if(!player){
      if(hasLived){
        ctx.clearRect(0, 0, 3000, 5000);
        alert("YOU ARE DEAD");
        location.reload();
        return;
      }else{
        console.log("none", players);
      }
    }else{
      hasLived = true;

      ctx.clearRect(0, 0, 3000, 5000);
      ctx.save();
      translateCanvas(player.x, player.y, player.width, player.height, innerWidth, innerHeight, ctx);
      map.blocks.forEach(block => {
        if(!isCollision({
          x: block[0],
          y: block[1],
          width: block[2],
          height: block[3]
        }, {
          x: Math.round(player.x + (player.width / 2) - (innerWidth / 2)),
          y:  Math.round(player.y + (player.height / 2) - (innerHeight / 2)),
          width: innerWidth,
          height: innerHeight
        })){
          return;
        }
        ctx.fillStyle = "black";
        ctx.fillRect(block[0], block[1], block[2], block[3]);
      });
      bullets.forEach(bullet => {
        ctx.fillStyle = bullet.fillStyle;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2, true);
        ctx.fill();
      });
      players.forEach(player => {
        ctx.fillStyle = player.fillColor;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = "gray";
        const slice = 3;
        switch(player.direction){
        case "up":
          ctx.fillRect(player.x, player.y, player.width, player.height / slice);
          break;
        case "down":
          ctx.fillRect(player.x, player.y + (player.height - player.height / slice), player.width, player.height / slice);
          break;
        case "left":
          ctx.fillRect(player.x, player.y, player.width / slice, player.height);
          break;
        case "right":
          ctx.fillRect(player.x + (player.width - player.width / slice), player.y, player.width / slice, player.height);
          break;
        }
      });

      ctx.restore();
    }

    if(!kill) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
};

/*const drawBullet = (ctx, x, y, radius) => {
  ctx.fillStyle = "gray";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  console.log(x, player.y);
  ctx.fill();
};

const translateCanvas = (ctx, x, y, width, height) => {
  ctx.translate(Math.round(-(x + (width / 2) - (ctx.canvas.offsetWidth / 2))), Math.round(-(y + (height / 2) - (ctx.canvas.offsetHeight / 2))));
};
*/

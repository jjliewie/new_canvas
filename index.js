const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player{
  constructor(x, y, rad, color){
    this.x = x
    this.y = y
    this.rad = rad
    this.color = color
  }

  draw(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.rad, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

class Projectile{

  constructor(x, y, rad, color, vel){
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.color = color;
    this.vel = vel;
  }

  draw(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.rad, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update(){
    this.draw()
    this.y += this.vel
  }
}

class Meteor{

  constructor(x, y, rad, color, vel){
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.color = color;
    this.vel = vel;
  }

  draw(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.rad, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update(){
    this.draw()
    this.y += this.vel
  }
}

const projectiles = []
const meteors = []
var canvasPos = getPosition(canvas);
var mouseX = 0;
var mouseY = 0;
var score = 0

function color_score(score){
  if (score <= 180){
    return score
  }
  else{
    return color_score(score-180)
  }
}

canvas.addEventListener("mousemove", setMousePosition, false);

function setMousePosition(e) {
  mouseX = e.clientX - canvasPos.x;
  mouseY = e.clientY - canvasPos.y;
}

function createpm(){
  setInterval(()=>{
    const vel = -10
    const radian = (Math.random() * 24) + 6
    const xCoor = ((canvas.width-(radian*2)) * Math.random()) + radian
    // const y = canvas.height - rad
    const yCoor = radian
    const velocity = 5 + Math.floor(score/10);
    const color = `hsl(${color_score(score)*4}, 50%, 50%)`

    const random = Math.random()*10

    if(random > (9-((Math.floor(score/10))/4))){
      meteors.push(new Meteor(xCoor, yCoor, radian, color, velocity))
    }
    projectiles.push(new Projectile((mouseX),(mouseY -30), 5, 'white', vel))

  }, 100)
}

let animationId
function animate(){
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = "25px Courier"
  ctx.fillStyle = "white"
  ctx.fillText("Score: " + score, 30, 50)

  const player = new Player(mouseX, mouseY, 30, 'white');
  player.draw()
  ctx.fillStyle = "black"
  ctx.fillText("YOU", mouseX-22, mouseY+5)

  meteors.forEach((meteor, idx) => {
    meteor.update()

    const distance = Math.hypot(mouseX - meteor.x,
      mouseY - meteor.y)

      if((distance - meteor.rad - player.rad < -2) || meteor.y - meteor.rad > canvas.height){
        setTimeout(()=>{
          cancelAnimationFrame(animationId)
          console.log('endgame');
          alert('you died')
        }, 0)
      }

    projectiles.forEach((projectile, index) => {
      const distance = Math.hypot(projectile.x - meteor.x, projectile.y - meteor.y)
      if(distance - meteor.rad - projectile.rad < 1){
        score ++;
        setTimeout(()=>{
          meteors.splice(idx, 1)
          projectiles.splice(index, 1)
        }, 0)
      }
    });
  });

  projectiles.forEach((projectile, idx) => {
    projectile.update()

    if(projectile.y + projectile.rad < 0){
      setTimeout(()=>{
        projectiles.splice(idx, 1)
      }, 0)
    }
  })
}

animate()
createpm()

function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;

  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}

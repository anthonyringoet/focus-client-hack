var inherits = require('inherits');
var Game = require('crtrdg-gameloop');
var Entity = require('crtrdg-entity');
var Keyboard = require('crtrdg-keyboard');
var Time = require('crtrdg-time');
var Enemy = require('./enemy');
var player, game, time, keyboard;
var start = document.getElementById('start');
var overlay = document.getElementById('overlay');


window.gameRunning = false;



start.addEventListener('click', function(e){
  e.preventDefault();
  e.currentTarget.style.display = 'none';
  overlay.style.display = 'none';

  window.gameRunning = true;
  time = new Time(game);
});


inherits(Player, Entity);

function Player(options){
  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.velocity = {
    x: options.velocity.x,
    y: options.velocity.y
  };

  this.speed = options.speed;
  this.friction = options.friction;
  this.color = options.color;
}

Player.prototype.move = function(velocity){
  // this.position.x += velocity.x;
  this.position.y += velocity.y;
};

Player.prototype.checkBoundaries = function(){
  if (this.position.x <= 0){
    this.position.x = 0;
  }

  if (this.position.x >= this.game.width - this.size.x){
    this.position.x = this.game.width - this.size.x;
  }

  if (this.position.y <= 0){
    this.position.y = 0;
  }

  if (this.position.y >= this.game.height - this.size.y){
    this.position.y = this.game.height - this.size.y;
  }
};

Player.prototype.keyboardInput = function(){
  if ('A' in keyboard.keysDown){
    this.velocity.x = -this.speed;
  }

  if ('D' in keyboard.keysDown){
    this.velocity.x = this.speed;
  }

  if ('W' in keyboard.keysDown){
    this.velocity.y = -this.speed;
  }

  if ('S' in keyboard.keysDown){
    this.velocity.y = this.speed;
  }
};


console.log('start');

game = new Game({
  canvasId: 'game',
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#E187B8'
});

keyboard = new Keyboard(game);

player = new Player({
  position: { x: 50, y: window.innerHeight / 2 },
  size: { x: 50, y: 50 },
  velocity: { x: 0, y: 0 },
  speed: 4,
  friction: 0.9,
  color: '#fff'
});

player.addTo(game);

player.on('update', function(interval) {
  this.keyboardInput(keyboard);

  this.move(this.velocity);
  this.velocity.x *= this.friction;
  this.velocity.y *= this.friction;

  // console.log('velocity ', this.velocity)

  this.checkBoundaries();
});

player.on('draw', function(draw){
  draw.fillStyle = this.color;
  draw.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
});



game.on('update', function (context) {
  // console.log('Milliseconds: %d, Seconds: %d, Minutes: %d, Throbber: %f', time.millis, time.seconds(), time.minutes(), time.throb(2000));

  if(time && time.seconds() > 20){
    console.log('ALL DONE! BOOM')
  }
});

console.log("test");

function randomBetween(min, max) {
  return Math.floor(Math.random() * max) + min;
}


var enemies = [];
for (var i = 0; i < 20; i++) {
    newEnemy(i, randomBetween(200,300), 150);
};

function newEnemy(i, y, opening) {
  console.log(arguments);
    enemies.push(new Enemy({
      position: { x: (i*400), y : 0},
      size: { x: 50, y: y },
      speed: 5,
      friction: 0.9,
      color: '#333',
      velocity : {
        x: 0,
        y: 0
      }
    }));

    enemies.push(new Enemy({
      position: { x: i*200, y : y + opening},
      size: { x: 50, y: 30000 },
      speed: 5,
      friction: 0.9,
      color: '#333',
      velocity: {
        x: 0,
        y: 0
      }
    }));
}

console.log(enemies);

enemies.forEach(function(enem){
  enem.addTo(game);
});
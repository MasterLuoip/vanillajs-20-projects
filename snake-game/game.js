import {getSnakeHead, snakeIntersection, update as updateSnake, draw as drawSnake, SNAKE_SPEED} from './snake.js';
import {update as updateFood, draw as drawFood} from './food.js';
import {outsideGrid} from './grid.js';

const gameBoard = document.getElementById('game-board')
let lastRenderTime = 0;
let gameOver = false;
 
function main(currentTime) {
  if(gameOver){
    if(confirm('You lost. Press ok to restart')) {
      window.location = '/'
    }
    return;
  }
  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  // control how fast the game update
  if (secondsSinceLastRender < 1 / SNAKE_SPEED){
    return;
  }
  lastRenderTime = currentTime;
  update();
  draw();
  
}

function update() {
  updateFood();
  updateSnake();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = '';
  drawFood(gameBoard);
  drawSnake(gameBoard);
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}


window.requestAnimationFrame(main);

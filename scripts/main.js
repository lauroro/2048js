const game = document.getElementById('game');
const score = document.getElementById('score').firstChild;
const gridOrder = 4;
const nTiles = gridOrder*gridOrder;
let tiles = [];
let activeTiles = 0;
let updated = false;


// Spawn a new Tile in a free backTile position
function spawn(){
  if(activeTiles < nTiles){
    let position = Math.floor(Math.random() * nTiles);
    let checked = [];
    while (true){
      if (checked.length > 0){
        while(checked.includes(position))
          position = Math.floor(Math.random() * nTiles);
      }
      checked.push(position);
      let tile = document.getElementById(position);
      if(tile.classList.contains("tile0")){
        tile.classList.remove("tile0");
        tile.classList.add("tile2");
        tile.firstChild.textContent = "2";
        break;
      }
    }
    activeTiles++;
  }
}

// Check if updates are made and game needs to spawn a new tile
function isUpdated(){
  let res = updated;
  updated = false;
  return res;
}

//Game Over
function gameOver(){}

//Game Won
function gameWon(){}

//Score
function increaseScore(value){
  let newScore = parseInt(score.textContent) + parseInt(value);
  score.textContent = newScore;
}

// Array Handling
function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

function placeZerosAtEnd(arr) {
  return arr.filter(isntZero).concat(arr.filter(isZero));
}
function isntZero(element) {
  return element > 0;
}
function isZero(element) {
  return element == 0;
}
//TODO: fix hard coding...
function arrayHandler(array){
  let numArray = [];
  for (let i = 0; i < array.length; i++){
    numArray.push(parseInt(array[i].firstChild.textContent));
  }
  let backup = numArray;
  // move tiles
  numArray = placeZerosAtEnd(numArray);
  // merge tiles
  if(numArray[0] == numArray[1]){
    numArray[0] *= 2;
    numArray[1] = 0;
    increaseScore(numArray[0]);
    activeTiles--;
    if(numArray[2] == numArray[3]){
      numArray[2] *= 2;
      numArray[3] = 0;
      increaseScore(numArray[2]);
      activeTiles--;
    }
  }
  else if(numArray[1] == numArray[2]){
    numArray[1] *= 2;
    numArray[2] = 0;
    increaseScore([numArray[1]]);
    activeTiles--;
  }
  else if(numArray[2] == numArray[3]){
    numArray[2] *= 2;
    numArray[3] = 0;
    increaseScore(numArray[2]);
    activeTiles--;
  }
  numArray = placeZerosAtEnd(numArray);
  // write updates
  for(let i = 0; i < numArray.length; i++){
    array[i].classList.remove(...array[i].classList);
    array[i].classList.add("tile"+numArray[i]);
    array[i].classList.add("gen-tile");
    array[i].firstChild.textContent = numArray[i];
  }
  if(!arrayEquals(numArray, backup))
    updated = true;
}

// Arrow key handlers
function upHandler(){
  for(let i = 0; i < gridOrder; i++){
    let column = [];
    for (let j = i; j <= i+3*gridOrder; j+=gridOrder){
      column.push(tiles[j]);
    }
    arrayHandler(column);
  }
}

function downHandler(){
  for(let i = 0; i < gridOrder; i++){
    let column = [];
    for (let j = i+3*gridOrder; j >= i; j-=gridOrder){
      column.push(tiles[j]);
    }
    arrayHandler(column);
  }
}

function leftHandler(){
  for(let i = 0; i <= 3*gridOrder; i+=gridOrder){
    let row = [];
    for (let j = i; j < i+gridOrder; j++){
      row.push(tiles[j]);
    }
    arrayHandler(row);
  }

}

function rightHandler(){
  for(let i = 0; i <= 3*gridOrder; i+=gridOrder){
    let row = [];
    for (let j = i+gridOrder-1; j >= i; j--){
      row.push(tiles[j]);
    }
    arrayHandler(row);
  }
}


document.addEventListener('DOMContentLoaded', function(){
  // Set initial score = 0
  score.textContent = 0;

  // Create the game grid
  for (let i = 0; i < nTiles; i++) {
    let tile = document.createElement('div');
    tile.classList.add("tile0");
    tile.classList.add("gen-tile");
    tile.id = i;
    let span = document.createElement("span");
    span.textContent = "0";
    tile.appendChild(span);
    game.appendChild(tile);
    tiles.push(tile);
  }

  spawn();
  spawn();

  document.onkeydown = function(event) {
    switch (event.key) {
      case "ArrowLeft":
        leftHandler();
        break;
      case "ArrowRight":
        rightHandler();
        break;
      case "ArrowUp":
        upHandler();
        break;
      case "ArrowDown":
        downHandler();
        break;
    }
    if(isUpdated())
      spawn();
  }
})


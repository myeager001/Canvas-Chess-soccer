$(document).ready(function(){
  drawBoard();
})
var selection = false
var turnCount = 0;
var turn = 'white';
var ball = "hold"
var whiteKeeper = new figure("pawn", "white", 3, 8);
var blackKeeper = new figure("pawn", "black", 5, 2);
var strikerOneWhite = new figure("king", "white", 2, 8);
var strikerOneBlack = new figure("king", "black", 6, 2);
var strikerTwoWhite = new figure("king", "white", 6, 8);
var strikerTwoBlack = new figure("king", "black", 2, 2);
var strikerThreeWhite = new figure("king", "white", 4, 7);
var strikerThreeBlack = new figure("king", "black", 4, 3);
var gameObjects = [whiteKeeper , blackKeeper, strikerOneWhite, strikerOneBlack, strikerTwoWhite, strikerTwoBlack, strikerThreeWhite, strikerThreeBlack]
console.log(gameObjects);
var boardSizex = 679;
var boardSizey = 835;
var boardStep = 75;

//draw the board and listen for mouse events
function drawBoard() {

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    //set up goal, keeper box, boundary
  if(!selection){
    for(var i = 0; i < 11; i++){
      if(i === 0 || i === 10){
        for(var j = 0; j < 9; j++){
          if(j > 2 && j < 6){
            colorSquare(i,j,"green")
          }
          else {
            colorSquare(i,j,"black");
          }
        }
      }
      else if(i === 1 || i === 2 || i === 8 || i === 9 ){
        for(var j=0; j<9; j++){
          if(j>2 && j <6){
            colorSquare(i,j,"blue")
          }else {
          colorSquare(i,j,"white")
          }
        }
      }else{
          for(var j=0; j<9; j++){
            colorSquare(i,j,"white")
          }
        }
      }
    }


    for (var x = 0.5; x < boardSizex; x += boardStep) {
        context.moveTo(x, 0.5);
        context.lineTo(x, boardSizey);
    }

    for (var y = 0.5; y < boardSizey; y += boardStep) {
        context.moveTo(0.5, y);
        context.lineTo(boardSizey, y);
    }

    context.strokeStyle = "#eee";
    context.stroke();

    for(i = 0; i<gameObjects.length;i++){
      renderFigure(gameObjects[i]);
    }
    canvas.addEventListener("click", canvasClick, false);
}

//on click
function canvasClick(e) {
    //get location and set it in grid
    var cell = getCursorPosition(e);
    console.log(cell);
    //see if you have and selected objects to move
    for(i = 0; i < gameObjects.length; i++){
      if(gameObjects[i].selected){
        // validate that the object can move where you click
        if(gameObjects[i].row === cell.row && gameObjects[i].column === cell.column){
          gameObjects[i].selected = false
          selection = false
          console.log("deselected");
          drawBoard();
          return
        }
        if(validateMove(gameObjects[i], cell)){
        gameObjects[i].row = cell.row
        gameObjects[i].column = cell.column
        gameObjects[i].selected = false
        selection = false
        drawBoard();
        turnCount++
        console.log(turnCount)
        if(turnCount === 3){
          turnCount = 0;
          console.log('end of turn');
          if(turn === 'white'){
            turn = 'black'
          }else {turn = 'white'}
        }
        return
      }return
    }
    }
    //see if you clicked on game object

    for(i = 0; i < gameObjects.length; i++){
      if(cell.row === gameObjects[i].row && cell.column === gameObjects[i].column){
        if(gameObjects[i].color == turn){
          gameObjects[i].selected = true;
          console.log("you are selected");
          colorSquare(cell.row, cell.column, "red")
          selection = true
        }
      }
    }

    drawBoard();
}
//set to grid system
function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    x = Math.min(x, boardStep * boardStep);
    y = Math.min(y, boardStep * boardStep);
    var cell = new Cell(Math.floor(y / boardStep), Math.floor(x / boardStep));
    return cell;
}
//create cell object related to click
function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function colorSquare(row, column, color) {
  context.fillStyle = color;
  context.fillRect((column * boardStep) + 1, (row * boardStep) + 1, boardStep - 1, boardStep - 1);
}

function figure(type, color, column, row) {
    this.type = type;
    this.image = "images/" + color + "-" + type + ".png";
    this.column = column;
    this.row = row;
    this.color = color;
    this.selected = false;

  }
function renderFigure(figure) {
    if (!figure.imageObj) {
        figure.imageObj = new Image();
        figure.imageObj.src = figure.image;

        figure.imageObj.onload = function () {
            context.drawImage(figure.imageObj, figure.column * boardStep, figure.row * boardStep, boardStep, boardStep);
        };
    }
    else {
        context.drawImage(figure.imageObj, figure.column * boardStep, figure.row * boardStep, boardStep, boardStep);
    }
}
//validate if the move is legal
function validateMove(figure, cell){
  if (figure.type === 'pawn' && figure.color === 'white'){
    if(cell.row < 10 && cell.row > 7){
      if(cell.column < 6 && cell.column > 2){
        return true
      }
    }
    return false
  }
  if (figure.type === 'pawn' && figure.color === 'black'){
    if(cell.row < 3 && cell.row > 0){
      if(cell.column < 6 && cell.column > 2){
        return true
      }
    }
    return false
  }
  if (figure.type === 'king'){
    if(cell.row > 0 && cell.row < 10){
      if((cell.row > 7 && cell.row < 10)&&(cell.column > 2 && cell.column < 6)){
        return false
      }
      if((cell.row > 0 && cell.row < 3)&&(cell.column > 2 && cell.column < 6)){
        return false
      }
      if(Math.abs(figure.row - cell.row)<2 && Math.abs(figure.column - cell.column)<2){
        var isSquareEmpty = true;
        for(var i = 0; i<gameObjects.length;i++){
          if(cell.row === gameObjects[i].row && cell.column === gameObjects[i].column){
            isSquareEmpty = false;
          }
        }return isSquareEmpty;
      }
    }
  }return false

}

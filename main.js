$(document).ready(function(){
  drawBoard();
})
var selection = false
var turnCount = 0;
var turn = 'white';
var ball = new figure("ball", "black", 4, 5);
var whiteKeeper = new figure("pawn", "white", 4, 9);
var blackKeeper = new figure("pawn", "black", 4, 1);
var strikerOneWhite = new figure("king", "white", 5, 7);
var strikerOneBlack = new figure("king", "black", 5, 3);
var strikerTwoWhite = new figure("king", "white", 3, 7);
var strikerTwoBlack = new figure("king", "black", 3, 3);
var strikerThreeWhite = new figure("king", "white", 4, 7);
var strikerThreeBlack = new figure("king", "black", 4, 3);
var gameObjects = [whiteKeeper , blackKeeper, strikerOneWhite, strikerOneBlack, strikerTwoWhite, strikerTwoBlack, strikerThreeWhite, strikerThreeBlack]
var boardSizex = 679;
var boardSizey = 835;
var boardStep = 75;
var whitescore = 0;
var blackscore = 0;

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
    renderFigure(ball)
    for(i = 0; i<gameObjects.length;i++){
      renderFigure(gameObjects[i]);
    }

    //score
    context.fillStyle = "rgb(250, 50, 50)";
    context.font = "24px Helvetica";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("white score:"+ whitescore , 5, 0);

    context.fillStyle = "rgb(250, 50, 50)";
    context.font = "24px Helvetica";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("black score:"+ blackscore , 5, 40);


    canvas.addEventListener("click", canvasClick, false);
}

//on click
function canvasClick(e) {
    //get location and set it in grid
    var cell = getCursorPosition(e);

    //see if you have and selected objects to move
    for(i = 0; i < gameObjects.length; i++){
    //see if you have ball and object selected
      if(gameObjects[i].selected && ball.selected){
        if((cell.row > 0 || (cell.column < 6 && cell.column > 2 ))&&(cell.row < 10 || (cell.column < 6 && cell.column > 2))){
          //deslect if you click the figure
          if(gameObjects[i].row === cell.row && gameObjects[i].column === cell.column){
            gameObjects[i].selected = false
            selection = false
            ball.selected = false
            console.log("deselected");
            drawBoard();
            return
          }
          if(Math.abs(gameObjects[i].row - cell.row) <=1 && Math.abs(gameObjects[i].column - cell.column) <= 1){
            var kicker = gameObjects[i]
            var i = 0
            var trigger = false
            while( i < gameObjects.length){
              if(gameObjects[i].row === cell.row && gameObjects[i].column === cell.column){
                trigger = true
                break
              }
              i++
            }
            if(!trigger){
              ballMovement(cell, kicker)
            }
          }
      }
        return

      }
      //
      if(gameObjects[i].selected){
        // deselect if you reclick the selected game piece
        if(gameObjects[i].row === cell.row && gameObjects[i].column === cell.column){
          gameObjects[i].selected = false
          selection = false
          console.log("deselected");
          drawBoard();
          return
        }
        //see if second click toched ball
        if((cell.row === ball.row && ball.column === cell.column)&&(Math.abs(ball.row-gameObjects[i].row) <2 && Math.abs(ball.column-gameObjects[i].column)<2)){
          colorSquare(cell.row, cell.column, "red")
          ball.selected = true
          drawBoard()
          return
        }
        // validate the move
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
    this.startRow = row;
    this.startColumn = column;

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
function ballMovement(cell, figure){
  ball.row = cell.row
  ball.column = cell.column
  //handle if row is the same
  if(ball.row === figure.row){
    console.log('in row loop')
    if(ball.column > figure.column){
      var testCase = undefined
      var result = undefined
      for(var i =0; i<gameObjects.length; i++){
        if((gameObjects[i].row === ball.row)&&(gameObjects[i].column > ball.column)){
          testCase = gameObjects[i].column - 1
          if(!result){
            result = testCase
          }
          else if(testCase < result){
            result = testCase
          }
        }
      }
    ball.column = result || 8
    }else{
      var testCase = undefined
      var result = undefined
      for(var i =0; i<gameObjects.length; i++){
        if((gameObjects[i].row === ball.row)&&(gameObjects[i].column < ball.column)){
          testCase = gameObjects[i].column + 1
          if(!result){
            result = testCase
          }
          else if(testCase > result){
            result = testCase
          }
        }
      }ball.column = result || 0
    }
  }
  //handle if column is the same
  if(ball.column === figure.column){
    console.log("in column loop")
    if (ball.row > figure.row){
      var defaultRow = 9
      if(ball.column > 2 && ball.column < 6){
        defaultRow = 10
      }
      var testCase = undefined
      var result = undefined
      for(var i =0; i<gameObjects.length; i++){
        if((gameObjects[i].column === ball.column)&&(gameObjects[i].row > ball.row)){
          testCase = gameObjects[i].row - 1
          if(!result){
            result = testCase
          }
          else if(testCase < result){
            result = testCase
          }
        }
      }ball.row = result || defaultRow
    }else{
      var defaultRow = 1
      if(ball.column > 2 && ball.column < 6){
        defaultRow = 0
      }
      var testCase = undefined
      var result = undefined
      for(var i =0; i<gameObjects.length; i++){
        if((gameObjects[i].column === ball.column)&&(gameObjects[i].row < ball.row)){
          testCase = gameObjects[i].row + 1
          if(!result){
            result = testCase
          }
          else if(testCase > result){
            result = testCase
          }
        }
      }ball.row = result || defaultRow
    }
  }
  //handle diagonal less less
  if((ball.column < figure.column)&&(ball.row < figure.row)){
      while(ball.column > 0 && (ball.row > 1 || (ball.row === 1 && (ball.column < 7 && ball.column > 3)))){
        trigger = false
        ball.column--;
        ball.row--;
        for(var i =0; i<gameObjects.length; i++){
          if((ball.row===gameObjects[i].row)&&(ball.column===gameObjects[i].column)){
            trigger = true
            ball.column++;
            ball.row++;
          }
        }if(trigger){break};

      }
  }
  //handle diagonal more more
  if((ball.column > figure.column)&&(ball.row > figure.row)){
      while(ball.column < 8 && (ball.row < 9 || (ball.row === 9 && (ball.column < 5 && ball.column > 1)))){
        trigger = false
        ball.column++;
        ball.row++;
        for(var i =0; i<gameObjects.length; i++){
          if((ball.row===gameObjects[i].row)&&(ball.column===gameObjects[i].column)){
            trigger = true
            ball.column--;
            ball.row--;
          }
        }if(trigger){break};

      }
  }
  //handle diagonal less more
  if((ball.column > figure.column)&&(ball.row < figure.row)){
      while(ball.column < 8 && (ball.row > 1 || (ball.row === 1 && (ball.column < 5 && ball.column > 1)))){
        trigger = false
        ball.column++;
        ball.row--;
        for(var i =0; i<gameObjects.length; i++){
          if((ball.row===gameObjects[i].row)&&(ball.column===gameObjects[i].column)){
            trigger = true
            ball.column--;
            ball.row++;
          }
        }if(trigger){break};

      }
  }
  //handle diagonal more less
  if((ball.column < figure.column)&&(ball.row > figure.row)){
      while(ball.column > 0 && (ball.row < 9 || (ball.row === 9 && (ball.column < 7 && ball.column > 3)))){
        trigger = false
        ball.column--;
        ball.row++;
        for(var i =0; i<gameObjects.length; i++){
          if((ball.row===gameObjects[i].row)&&(ball.column===gameObjects[i].column)){
            trigger = true
            ball.column++;
            ball.row--;
          }
        }if(trigger){break};

      }
  }
  //if black scores
  if(ball.row === 10){
    blackscore += 1;
    turnCount = 0;
    turn = 'white';
    resetBoard();
  }
  //if white scores
  if(ball.row === 0){
    whitescore += 1;
    turn = 'black';
    turnCount = 0;
    resetBoard();
  }
  figure.selected = false
  ball.selected = false
  selection = false
  drawBoard();
  // turnCount++
  // console.log(turnCount)
  // if(turnCount === 3){
  //   turnCount = 0;
  //   console.log('end of turn');
  //   if(turn === 'white'){
  //     turn = 'black'
  //   }else {turn = 'white'}
  // }
  return
}
function resetBoard(){
  for(var i = 0; i < gameObjects.length; i++){
    gameObjects[i].row = gameObjects[i].startRow;
    gameObjects[i].column = gameObjects[i].startColumn;
  }
    ball.row = ball.startRow;
    ball.column = ball.startColumn;
}

function getUser(e){return $.get("https://randomuser.me/api/",function(t){result=t.results[0].user,console.log(result);var o=JSON.stringify(result);localStorage.setItem(e,o)})}function drawBoard(){if(canvas=document.getElementById("canvas"),context=canvas.getContext("2d"),!selection)for(var e=0;11>e;e++)if(0===e||10===e)for(var t=0;9>t;t++)t>2&&6>t?colorSquare(e,t,"green"):colorSquare(e,t,"black");else if(1===e||2===e||8===e||9===e)for(var t=0;9>t;t++)t>2&&6>t?colorSquare(e,t,"rgb(147,255,88)"):colorSquare(e,t,"rgb(184,255,138)");else for(var t=0;9>t;t++)colorSquare(e,t,"rgb(184,255,138)");for(var o=.5;boardSizex>o;o+=boardStep)context.moveTo(o,.5),context.lineTo(o,boardSizey);for(var l=.5;boardSizey>l;l+=boardStep)context.moveTo(.5,l),context.lineTo(boardSizey,l);for(context.strokeStyle="#eee",context.stroke(),renderFigure(ball),e=0;e<gameObjects.length;e++)renderFigure(gameObjects[e]);context.fillStyle="rgb(250, 50, 50)",context.font="24px Helvetica",context.textAlign="left",context.textBaseline="top",context.fillText("moves left: "+turnCount,5,0),context.fillStyle="rgb(250, 50, 50)",context.font="24px Helvetica",context.textAlign="left",context.textBaseline="top",context.fillText("kicks left: "+kickCount,5,40),$("#black-score").text("Score: "+blackscore),$("#white-score").text("Score: "+whitescore),canvas.addEventListener("click",canvasClick,!1)}function canvasClick(e){var t=getCursorPosition(e);for(l=0;l<gameObjects.length;l++){if(gameObjects[l].selected&&ball.selected){if((t.row>0||t.column<6&&t.column>2)&&(t.row<10||t.column<6&&t.column>2)){if(gameObjects[l].row===t.row&&gameObjects[l].column===t.column)return gameObjects[l].selected=!1,selection=!1,ball.selected=!1,console.log("deselected"),void drawBoard();if(Math.abs(gameObjects[l].row-t.row)<=1&&Math.abs(gameObjects[l].column-t.column)<=1){for(var o=gameObjects[l],l=0,r=!1;l<gameObjects.length;){if(gameObjects[l].row===t.row&&gameObjects[l].column===t.column){r=!0;break}l++}r||ballMovement(t,o)}}return}if(gameObjects[l].selected)return gameObjects[l].row===t.row&&gameObjects[l].column===t.column?(gameObjects[l].selected=!1,selection=!1,console.log("deselected"),void drawBoard()):t.row===ball.row&&ball.column===t.column&&Math.abs(ball.row-gameObjects[l].row)<2&&Math.abs(ball.column-gameObjects[l].column)<2?(colorSquare(t.row,t.column,"red"),ball.selected=!0,void drawBoard()):void(validateMove(gameObjects[l],t)&&(gameObjects[l].row=t.row,gameObjects[l].column=t.column,gameObjects[l].selected=!1,selection=!1,"king"===gameObjects[l].type&&turnCount--,drawBoard(),console.log(turnCount),0===turnCount&&endTurn()))}for(l=0;l<gameObjects.length;l++)t.row===gameObjects[l].row&&t.column===gameObjects[l].column&&gameObjects[l].color==turn&&(gameObjects[l].selected=!0,console.log("you are selected"),colorSquare(t.row,t.column,"red"),selection=!0);drawBoard()}function endTurn(){turnCount=3,kickCount=3,console.log("end of turn"),$(".player").toggleClass("active"),turn="white"===turn?"black":"white",drawBoard()}function getCursorPosition(e){var t,o;void 0!=e.pageX&&void 0!=e.pageY?(t=e.pageX,o=e.pageY):(t=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,o=e.clientY+document.body.scrollTop+document.documentElement.scrollTop),t-=canvas.offsetLeft,o-=canvas.offsetTop,t=Math.min(t,boardStep*boardStep),o=Math.min(o,boardStep*boardStep);var l=new Cell(Math.floor(o/boardStep),Math.floor(t/boardStep));return l}function Cell(e,t){this.row=e,this.column=t}function colorSquare(e,t,o){context.fillStyle=o,context.fillRect(t*boardStep+1,e*boardStep+1,boardStep-1,boardStep-1)}function figure(e,t,o,l){this.type=e,this.image="images/"+t+"-"+e+".png",this.column=o,this.row=l,this.color=t,this.selected=!1,this.startRow=l,this.startColumn=o}function renderFigure(e){e.imageObj?context.drawImage(e.imageObj,e.column*boardStep,e.row*boardStep,boardStep,boardStep):(e.imageObj=new Image,e.imageObj.src=e.image,e.imageObj.onload=function(){context.drawImage(e.imageObj,e.column*boardStep,e.row*boardStep,boardStep,boardStep)})}function validateMove(e,t){if("pawn"===e.type&&"white"===e.color)return t.row<10&&t.row>7&&t.column<6&&t.column>2?!0:!1;if("pawn"===e.type&&"black"===e.color)return t.row<3&&t.row>0&&t.column<6&&t.column>2?!0:!1;if("king"===e.type&&t.row>0&&t.row<10){if(t.row>7&&t.row<10&&t.column>2&&t.column<6)return!1;if(t.row>0&&t.row<3&&t.column>2&&t.column<6)return!1;if(Math.abs(e.row-t.row)<2&&Math.abs(e.column-t.column)<2){for(var o=!0,l=0;l<gameObjects.length;l++)t.row===gameObjects[l].row&&t.column===gameObjects[l].column&&(o=!1);return o}}return!1}function ballMovement(e,t){if(ball.row=e.row,ball.column=e.column,ball.row===t.row)if(console.log("in row loop"),ball.column>t.column){for(var o=void 0,l=void 0,r=0;r<gameObjects.length;r++)gameObjects[r].row===ball.row&&gameObjects[r].column>ball.column&&(o=gameObjects[r].column-1,l?l>o&&(l=o):l=o);ball.column=l||8}else{for(var o=void 0,l=void 0,r=0;r<gameObjects.length;r++)gameObjects[r].row===ball.row&&gameObjects[r].column<ball.column&&(o=gameObjects[r].column+1,l?o>l&&(l=o):l=o);ball.column=l||0}if(ball.column===t.column)if(console.log("in column loop"),ball.row>t.row){var a=9;ball.column>2&&ball.column<6&&(a=10);for(var o=void 0,l=void 0,r=0;r<gameObjects.length;r++)gameObjects[r].column===ball.column&&gameObjects[r].row>ball.row&&(o=gameObjects[r].row-1,l?l>o&&(l=o):l=o);ball.row=l||a}else{var a=1;ball.column>2&&ball.column<6&&(a=0);for(var o=void 0,l=void 0,r=0;r<gameObjects.length;r++)gameObjects[r].column===ball.column&&gameObjects[r].row<ball.row&&(o=gameObjects[r].row+1,l?o>l&&(l=o):l=o);ball.row=l||a}if(ball.column<t.column&&ball.row<t.row)for(;ball.column>0&&(ball.row>1||1===ball.row&&ball.column<7&&ball.column>3);){trigger=!1,ball.column--,ball.row--;for(var r=0;r<gameObjects.length;r++)ball.row===gameObjects[r].row&&ball.column===gameObjects[r].column&&(trigger=!0,ball.column++,ball.row++);if(trigger)break}if(ball.column>t.column&&ball.row>t.row)for(;ball.column<8&&(ball.row<9||9===ball.row&&ball.column<5&&ball.column>1);){trigger=!1,ball.column++,ball.row++;for(var r=0;r<gameObjects.length;r++)ball.row===gameObjects[r].row&&ball.column===gameObjects[r].column&&(trigger=!0,ball.column--,ball.row--);if(trigger)break}if(ball.column>t.column&&ball.row<t.row)for(;ball.column<8&&(ball.row>1||1===ball.row&&ball.column<5&&ball.column>1);){trigger=!1,ball.column++,ball.row--;for(var r=0;r<gameObjects.length;r++)ball.row===gameObjects[r].row&&ball.column===gameObjects[r].column&&(trigger=!0,ball.column--,ball.row++);if(trigger)break}if(ball.column<t.column&&ball.row>t.row)for(;ball.column>0&&(ball.row<9||9===ball.row&&ball.column<7&&ball.column>3);){trigger=!1,ball.column--,ball.row++;for(var r=0;r<gameObjects.length;r++)ball.row===gameObjects[r].row&&ball.column===gameObjects[r].column&&(trigger=!0,ball.column++,ball.row--);if(trigger)break}kickCount--,0===kickCount&&endTurn(),10===ball.row&&(blackscore+=1,"black"===turn&&$(".player").toggleClass("active"),turn="white",resetBoard()),0===ball.row&&(whitescore+=1,"white"===turn&&$(".player").toggleClass("active"),turn="black",resetBoard()),t.selected=!1,ball.selected=!1,selection=!1,drawBoard()}function resetBoard(){turnCount=3,kickCount=3;for(var e=0;e<gameObjects.length;e++)gameObjects[e].row=gameObjects[e].startRow,gameObjects[e].column=gameObjects[e].startColumn;ball.row=ball.startRow,ball.column=ball.startColumn}function saveGame(e){var t=[];t.push(gameObjects),t.push(ball),t.push(turnCount),t.push(kickCount),t.push(whitescore),t.push(blackscore),t.push(turn),console.log(t),localStorage.setItem(e,JSON.stringify(t))}function loadGame(e){var t=JSON.parse(localStorage.getItem(e));console.log(t),turn=t.pop(),blackscore=t.pop(),whitescore=t.pop(),kickCount=t.pop(),turnCount=t.pop();var o=t.pop();ball.row=o.row,ball.column=o.column;for(var l=t.pop(),r=0;r<l.length;r++)gameObjects[r].row=l[r].row,gameObjects[r].column=l[r].column;drawBoard()}$(document).ready(function(){function e(e){var o=JSON.parse(localStorage.getItem(e)),l=document.getElementById(e);$(l).prevAll("img").attr("src",o.picture.thumbnail),$(l).prevAll(".name").text(t(o.name.title)+" "+t(o.name.first)+" "+t(o.name.last)),$(l).prevAll(".username").text(o.username)}function t(e){return e.charAt(0).toUpperCase()+e.slice(1)}e("userone"),e("usertwo"),$(".get-player").on("click",function(){var e=$(this).attr("data");$.when(getUser(e)).then(function(){userObject=JSON.parse(localStorage.getItem($(this).attr("data"))),$(this).prevAll("img").attr("src",userObject.picture.thumbnail),$(this).prevAll(".name").text(t(userObject.name.title)+" "+t(userObject.name.first)+" "+t(userObject.name.last)),$(this).prevAll(".username").text(userObject.username)}.bind(this))})}),$(document).ready(function(){drawBoard()}),$(".reset").on("click",function(){resetBoard(),selection=!1,kickCount=3,turnCount=3,turn="white",whitescore=0,blackscore=0,drawBoard()});var selection=!1,turnCount=3,kickCount=3,turn="white",ball=new figure("ball","black",4,5),whiteKeeper=new figure("pawn","white",4,9),blackKeeper=new figure("pawn","black",4,1),strikerOneWhite=new figure("king","white",5,7),strikerOneBlack=new figure("king","black",5,3),strikerTwoWhite=new figure("king","white",3,7),strikerTwoBlack=new figure("king","black",3,3),strikerThreeWhite=new figure("king","white",4,7),strikerThreeBlack=new figure("king","black",4,3),strikerFourWhite=new figure("king","white",6,8),strikerFourBlack=new figure("king","black",6,2),strikerFiveWhite=new figure("king","white",2,8),strikerFiveBlack=new figure("king","black",2,2),gameObjects=[whiteKeeper,blackKeeper,strikerOneWhite,strikerOneBlack,strikerTwoWhite,strikerTwoBlack,strikerThreeWhite,strikerThreeBlack,strikerFourBlack,strikerFourWhite,strikerFiveBlack,strikerFiveWhite],boardSizex=580,boardSizey=710,boardStep=64,whitescore=0,blackscore=0;$(document).ready(function(){function e(e,t){if(e.files&&e.files[0]){var o=new FileReader;o.onload=function(e){$(t).attr("src",e.target.result)},o.readAsDataURL(e.files[0])}}$(".sbmt-plyr").on("click",function(t){t.preventDefault(),$("input[value='white']").is(":checked")?(e(document.getElementById("imgInp"),"#player2"),$(".player2").next().text($("input[id='name']").val()).next().text($("input[id='username']").val())):(e(document.getElementById("imgInp"),"#player1"),$(".player1").next().text($("input[id='name']").val()).next().text($("input[id='username']").val()))}),$(".save").on("click",function(){var e=prompt("Name Game to Save");saveGame(e)}),$(".load").on("click",function(){var e=prompt("Name of Game");loadGame(e)})});
//This is easy mode. The speed does not increase, but instead remains at 
//a steady 120 milliseconds. 

// html elements
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// flag so that code only runs while game is active
let playing = false;

// direction in which the snake is currently expecting to move
let direction = 0;

// flag to lock direction after any valid input
let dirChosen = false;

// previous time variable (for measuring 120 ms)
let then = 0;

// array to hold snake segment elements. Looking back at this,
// I think it could manage with only the first and last couple
// segments instead of all of them. C'est la vie. 
let snake = [[1, 1], [2, 1], [3, 1], [4, 1]];

// apple location holder (used when calculating apple placement)
let apple = [5, 5];

// variable pauses old segment deletion after eating. This
// effectively lengthens the snake
let eaten = 0;

// sets the length of each tick (game update)
let tickLength = 120;

// array to hold the 21x35 grid boxes which make up the game board.
// Boxes are set to reflect what is in them, be it an apple, snake
// segment, or nothing. Used to check collisions
let boxes = [];

// it's a video game after all. Has to have a score. 
let score = 100;

// more html elements
let easy = document.getElementById("easyButton");
let medium = document.getElementById("medButton");
let hard = document.getElementById("hardButton");

// at 20 px, there are 21 blocks to the height and 35 blocks to the width

// starter - click listener for easy mode
easy.onclick = function startEasy() {
    if (playing){
        return;
    }
    tickLength = 120;
    
    // hide buttons during game
    easy.style.display = "none";
    medium.style.display = "none";
    hard.style.display = "none";
    
    // initialize game
    constructBoxes();
    context.clearRect(0, 0, canvas.width, canvas.height);
    playing = true;
    console.log("you picked easy");
    then = performance.now();
    loop();
}


// vitals

// main game loop
function loop(){
    
    // only update game (snake position, etc) after a certain length of time
    // dictated by the current tick length
    let now = performance.now();
    if (now - then > tickLength){
        then = now;
        update();
    }
    
    // A lot of these exist to kill functions that may still be looping/running
    // after the game ends. Keeps functions from throwing errors when they
    // try to edit data that no longer exists (don't have to worry about error
    // handling if your code never throws errors, am I right? heh, hmmm....)
    if (!playing) {
        return;
    }
    window.requestAnimationFrame(loop);
}

function update(){
    // reset direction lock (explanation in listening method)
    dirChosen = false;
    
    // check if the snake is colliding with anything, then move it
    collisionCheck();
    move();
    if (!playing) {
        return;
    }
    
    // clear canvas and repaint
    context.clearRect(0, 0, canvas.width, canvas.height)
    placeApple();
    drawAll();
}

// listeners

window.addEventListener("keypress", listening);

function listening(e) {
    --score; // score decreases for every turn, disincentivizes excessive turns
    console.log("banana");
    
    
    // locking the direction after first (valid) input makes input seem more
    // responsive. If a u-turn is too quick, the second move (currently
    // invalid) would otherwise overwrite the first and also just not happen. This
    // results in the game "eating" both inputs. Locking on that first
    // valid input prevents this. The second input does get eaten, but
    // the snake can't even turn that way yet. 
    if (!playing || dirChosen) {
        return;
    }
    
    // switch to read directional input
    switch (e.key){
        case "a" :
            if (direction % 2 == 0){ // invalid if straight or backwards
                break;
            } else {
                direction = 2;
            }
            dirChosen = true; // set direction lock
            break;
        case "w" :
            if (direction % 2 == 1){
                break;
            } else {
                direction = 3;
            }
            dirChosen = true;
            break;
        case "d" :
            if (direction % 2 == 0){
                break;
            } else {
                direction = 0;
            }
            dirChosen = true;
            break;
        case "s" :
            if (direction % 2 == 1){
                break;
            } else {
                direction = 1;
            }
            dirChosen = true;
        default:
            console.log(e.key);
    }

}


// helpers

// This game moves the snake by adding a new segment on to 
// the front of the snake and removing the one at the end. 
// To make it easy, the tail of the snake is actually the
// first element so that it can be popped easily and new
// segments can be appended as the last element (head). 
function move(){
    let newSeg = [];
    let last = 0;
    if (eaten == 0) {
        // An element will be getting popped, so factor that in
        last = snake.length - 2;
    } else {
        // after you've eaten, no elements are getting popped
        last = snake.length - 1;
    }
    
    // if the snake has not eaten recently, pop the tail
    if (eaten == 0){
        tail = snake.shift();
        boxes[tail[0]][tail[1]] = 0;
    }
    
    // place new segment in correct location
    switch (direction) {
        case 0 :
            // construct segment array and append to 2d snake array
            // remember, the last array element is actually the snake's face
            newSeg.push(snake[last][0] + 1);
            newSeg.push(snake[last][1]);
            snake.push(newSeg)
            boxes[newSeg[0]][newSeg[1]] = 1; // set boxes array with new segment
            break;
        case 1 :
            newSeg.push(snake[last][0]);
            newSeg.push(snake[last][1] + 1);
            snake.push(newSeg)
            boxes[newSeg[0]][newSeg[1]] = 1;
            break;
        case 2 :
            newSeg.push(snake[last][0] - 1);
            newSeg.push(snake[last][1]);
            snake.push(newSeg)
            boxes[newSeg[0]][newSeg[1]] = 1;
            break;
        case 3 :
            newSeg.push(snake[last][0]);
            newSeg.push(snake[last][1] - 1);
            snake.push(newSeg)
            boxes[newSeg[0]][newSeg[1]] = 1;
            break;
    }
    
    // reduce value of eat variable so that eventually the
    // snake stops growing
    if (eaten > 0) {
        --eaten;
    }
}



function collisionCheck() {
    if (!playing) {
        return;
    }

    console.log(tickLength);

    // calculate next snake position based on current head
    // and direction
    let upcomingXval = snake[snake.length - 1][0]
    let upcomingYval = snake[snake.length - 1][1]
    switch (direction) {
        case 0:
            upcomingXval += 1;
            break;
        case 1:
            upcomingYval += 1;
            break;
        case 2:
            upcomingXval -= 1;
            break;
        case 3:
            upcomingYval -= 1;
            break;
    }

    // check for walls
    if (upcomingXval < 0 || upcomingXval > 34
        || upcomingYval < 0 || upcomingYval > 20) {
            console.log("bonk");
            die();
        }

    // check boxes array for segments or apples
    switch (boxes[upcomingXval][upcomingYval]){
        // nothing here
        case 0:
            break;
        // snake segment
        case 1:
            console.log("bonk");
            die();
            break;
        // apple
        case 2:
            eaten = 5; // pause old segment deletion for a few ticks
            score += 100;
            break;
    }

}


// draw all segments, apple
function drawAll() {
    if (!playing) {
        return;
    }

    for (let i = 0; i < boxes.length; ++i) {
        for (let j = 0; j < boxes[i].length; ++j) {
            if (boxes[i][j] == 1) {
                drawSegment(i, j);
            } else if (boxes[i][j] == 2) {
                drawApple(i, j);
            }
        }
    }
}

function drawSegment(x, y) {
    if (!playing) {
        return;
    }
    context.save();
    context.fillStyle = "white";
    context.fillRect(x * 20, y * 20, 20, 20);
    context.restore();
}

function drawApple(x, y){
    if (!playing) {
        return;
    }
    context.save();
    context.fillStyle = "red";
    context.fillRect(x * 20, y * 20, 20, 20);
    context.restore();
}


// randomly decide next position of apple
function placeApple(){
    // only needs to happen when apple has just been eaten
    if (eaten < 4) {
        return;
    }
    
    // calculate where apple can go
    let options = appleOptions();
    
    // randomly pick spot for apple
    let index = Math.floor(options.length * Math.random());
    apple = options[index];
    boxes[apple[0]][apple[1]] = 2;
    
}

// apple cannot be placed over a snake segment, so
// this function scrubs the boxes array for possible spots.
// Might be long, but it's constant rather than risking
// picking invalid spots over and over. 
function appleOptions() {
    options = [];
    for (let i = 0; i < 35; ++i) {
        for (let j = 0; j < 21; ++j) {
            if (boxes[i][j] == 0) {
                options.push([i, j]);
            }
        }
    }
    return options;
}

// initialize boxes array at beginning of game
function constructBoxes(){
    for (let i = 0; i < 35; ++i){
        temp = [];
        for (let j = 0; j < 21; ++j){
            temp.push(0);
        }
        boxes.push(temp);
    }
    
    // beginning snake segments
    boxes[1][1] = 1;
    boxes[2][1] = 1;
    boxes[3][1] = 1;
    boxes[4][1] = 1;
    
    // beginning apple position
    boxes[5][5] = 2;

}

function die(){
    playing = false;
    canvas.style.backgroundColor = "#FF8000";
    peel();
}

// death "animation"
function peel() {
    if (performance.now() - then < 50) {
        
    } else {
        then = performance.now();
        context.save();
        context.fillStyle = "black";

        if (snake.length == 0) {
            cleanup();
            return;
        }


        let i = snake.length - 1;
        context.fillRect(snake[i][0] * 20, snake[i][1] * 20, 20, 20);
        snake.pop();
        context.restore();
    }

    window.requestAnimationFrame(peel);
}

// reset values so that game will function if a user wants to play again
function cleanup() {
    canvas.style.backgroundColor = "black";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.font = "40px Consolas";
    context.fillText("Try Again?", 270, 210);
    context.fillText("Score: " + score, 20, 400);
    snake = [[1, 1], [2, 1], [3, 1], [4, 1]];
    apple = [5, 5]
    direction = 0;
    then = 0;
    boxes = [];
    
    // reveal buttons to the user again
    easy.style.display = "inline";
    medium.style.display = "inline";
    hard.style.display = "inline";
}

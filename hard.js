// this is hard mode. The snake will leave droppings in the place where
// it ate an apple. 

// explanation of the below constants is in the "easy.js" file 

// let canvas = document.getElementById("canvas");
// let context = canvas.getContext("2d");
// let playing = false;
// let direction = 0;
// let dirChosen = false;
// let then = 0;
// let snake = [[1, 1], [2, 1], [3, 1], [4, 1]];
// let apple = [5, 5];
// let eaten = 0;
// let tickLength = 120;
// let boxes = [];
// let score = 100;
// let easy = document.getElementById("easyButton");
// let medium = document.getElementById("medButton");
// let hard = document.getElementById("hardButton");

// blocks at 20 px, there are 21 blocks to the height and 35 blocks to the width


// starter - click listener for hard mode
hard.onclick = function startHard() {
    if (playing){
        return;
    }
    tickLength = 120; 
    
    // hide buttons during game
    easy.style.display = "none";
    medium.style.display = "none";
    hard.style.display = "none";
    
    // initialize game
    constructBoxesHard();
    context.clearRect(0, 0, canvas.width, canvas.height);
    playing = true;
    console.log("you picked hard"); // debug text
    then = performance.now();
    loopHard();
}


// vitals

function loopHard(){
    
    // only update game (snake position, etc) after a certain length of time
    // dictated by the current tick length
    let now = performance.now();
    if (now - then > tickLength){
        then = now;
        updateHard();
    }
    
    // A lot of these exist to kill functions that may still be looping/running
    // after the game ends. Keeps functions from throwing errors when they
    // try to edit data that no longer exists
    if (!playing) {
        return;
    }
    
    // repeat
    window.requestAnimationFrame(loopHard);
}


function updateHard(){
    dirChosen = false;
    
    // check if the snake is colliding with anything, then move it
    collisionCheckHard();
    moveHard();
    if (!playing) {
        return;
    }
    
    // clear canvas and repaint
    context.clearRect(0, 0, canvas.width, canvas.height)
    placeAppleHard();
    drawAllHard();
}

// listeners

window.addEventListener("keypress", listening);

function listeningHard(e) {
    --score; // score decreases for every turn, disincentivizes excessive turns
    console.log("banana"); // debug text
    
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
            dirChosen = true; // lock input
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
            console.log(e.key); // debug output
    }

}





// helpers

// This game moves the snake by adding a new segment on to 
// the front of the snake and removing the one at the end. 
// To make it easy, the tail of the snake is actually the
// first element so that it can be popped easily and new
// segments can be easily appended to the end (head). 
function moveHard(){
    let newSeg = [];
    let last = 0;
    if (eaten == 0) {
        // An element will be getting popped, so factor that in
        last = snake.length - 2; 
    } else {
        // after you've eaten, no elements are getting popped
        last = snake.length - 1; 
    }

    if (eaten == 0){
        // pop the tail
        tail = snake.shift();
        
        // if it's a dropping, it needs to stick around
        if (boxes[tail[0]][tail[1]] != 3) {
            boxes[tail[0]][tail[1]] = 0;
        }
        
    }

    // add new segment in the correct place
    switch (direction) {
        case 0 :

            // construct segment array and append to 2d snake array
            // remember, the last array element is actually the snake's face
            newSeg.push(snake[last][0] + 1);
            newSeg.push(snake[last][1]);
            snake.push(newSeg)
            
            // make the box element a snake segment if it's not a dropping
            if (boxes[newSeg[0]][newSeg[1]] != 3) {
                boxes[newSeg[0]][newSeg[1]] = 1;
            }
            break;
        case 1 :

            newSeg.push(snake[last][0]);
            newSeg.push(snake[last][1] + 1);
            snake.push(newSeg)
            if (boxes[newSeg[0]][newSeg[1]] != 3) {
                boxes[newSeg[0]][newSeg[1]] = 1;
            }
            break;
        case 2 :

            newSeg.push(snake[last][0] - 1);
            newSeg.push(snake[last][1]);
            snake.push(newSeg)
            if (boxes[newSeg[0]][newSeg[1]] != 3) {
                boxes[newSeg[0]][newSeg[1]] = 1;
            }
            break;
        case 3 :

            newSeg.push(snake[last][0]);
            newSeg.push(snake[last][1] - 1);
            snake.push(newSeg)
            if (boxes[newSeg[0]][newSeg[1]] != 3) {
                boxes[newSeg[0]][newSeg[1]] = 1;
            }
            break;
    }
    
    // decrement eat value
    if (eaten > 0) {
        --eaten;
    }
}

function collisionCheckHard() {
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

    // check walls
    if (upcomingXval < 0 || upcomingXval > 34
        || upcomingYval < 0 || upcomingYval > 20) {
            console.log("bonk");
            dieHard();
        }


    // check boxes array for snake segment, droppings,
    // or apples
    switch (boxes[upcomingXval][upcomingYval]){
            
        // nothin
        case 0:
            break;
        // snake segment - rest in pieces
        case 1:
            console.log("bonk");
            dieHard();
            break;
        // apple consumption occurs. Delicious. 
        case 2:
            eaten = 5;
            tickLength -= 2;
            score += 100;
            boxes[upcomingXval][upcomingYval] = 3;
            break;
        // dropping - also rest in pieces
        case 3:
            dieHard();
            break;
    }

}

// draw all snake segments, apple, droppings
function drawAllHard() {
    if (!playing) {
        return;
    }

    for (let i = 0; i < boxes.length; ++i) {
        for (let j = 0; j < boxes[i].length; ++j) {
            if (boxes[i][j] == 1) {
                drawSegmentHard(i, j);
            } else if (boxes[i][j] == 2) {
                drawAppleHard(i, j);
            } else if (boxes[i][j] == 3) {
                drawPingHard(i, j);
            }
        }
    }
}

function drawSegmentHard(x, y) {
    if (!playing) {
        return;
    }
    context.save();
    context.fillStyle = "white";
    context.fillRect(x * 20, y * 20, 20, 20);
    context.restore();
}

function drawAppleHard(x, y){
    if (!playing) {
        return;
    }
    context.save();
    context.fillStyle = "red";
    context.fillRect(x * 20, y * 20, 20, 20);
    context.restore();
}

function drawPingHard(x, y) {
    if (!playing) {
        return;
    }
    context.save();
    context.fillStyle = "green";
    context.fillRect(x * 20, y * 20, 20, 20);
    context.restore();
}

// randomly decide next position of apples
function placeAppleHard(){
    // only needs to happen after apple is eaten
    if (eaten < 4) {
        return;
    }
    
    // calculate where apple can go
    let options = appleOptionsHard();
    
    // randomly pick spot for apple
    let index = Math.floor(options.length * Math.random());
    apple = options[index];
    boxes[apple[0]][apple[1]] = 2;
    
}

// apple cannot be placed over a snake segment or dropping, so
// this function scrubs the boxes array for possible spots
function appleOptionsHard() {
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


// initializer for boxes array
function constructBoxesHard(){
    for (let i = 0; i < 35; ++i){
        temp = [];
        for (let j = 0; j < 21; ++j){
            temp.push(0);
        }
        boxes.push(temp);
    }
    
    // snek
    boxes[1][1] = 1;
    boxes[2][1] = 1;
    boxes[3][1] = 1;
    boxes[4][1] = 1;
    
    // aple
    boxes[5][5] = 2;
    
    // everything else remains 0 for empty space
}

function dieHard(){
    playing = false;
    canvas.style.backgroundColor = "#FF8000";
    peelHard();
}

// cosmetics
function peelHard() {
    if (performance.now() - then < 50) {
        
    } else {
        then = performance.now();
        context.save();
        context.fillStyle = "black";

        if (snake.length == 0) {
            cleanupHard();
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
function cleanupHard() {
    canvas.style.backgroundColor = "black";
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "40px Consolas";
    context.fillText("Try Again?", 270, 210);
    context.fillText("Score: " + score, 20, 400);
    snake = [[1, 1], [2, 1], [3, 1], [4, 1]];
    apple = [5, 5]
    direction = 0;
    then = 0;
    boxes = [];
    
    // reveal buttons to the player once again
    easy.style.display = "inline";
    medium.style.display = "inline";
    hard.style.display = "inline";
}

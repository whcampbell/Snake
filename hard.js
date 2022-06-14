// this is hard mode. The snake will leave droppings in the place where
// it ate an apple. 

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
// let brutal = document.getElementById("brutalButton");
// at 20 px, there are 21 blocks to the height and 35 blocks to the width

// starter
hard.onclick = function startHard() {
    if (playing){
        return;
    }
    tickLength = 120;
    easy.style.display = "none";
    medium.style.display = "none";
    hard.style.display = "none";
    constructBoxesHard();
    context.clearRect(0, 0, canvas.width, canvas.height);
    playing = true;
    console.log("you picked hard");
    then = performance.now();
    loopHard();
}


// vitals

function loopHard(){
    let now = performance.now();
    if (now - then > tickLength){
        then = now;
        updateHard();
    }
    if (!playing) {
        return;
    }
    window.requestAnimationFrame(loopHard);
}

function updateHard(){
    dirChosen = false;
    collisionCheckHard();
    moveHard();
    if (!playing) {
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    placeAppleHard();
    drawAllHard();
}

// listeners

window.addEventListener("keypress", listening);

function listeningHard(e) {
    --score;
    console.log("banana");
    if (!playing || dirChosen) {
        return;
    }
    switch (e.key){
        case "a" :
            if (direction % 2 == 0){
                break;
            } else {
                direction = 2;
            }
            dirChosen = true;
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

function moveHard(){
    let newSeg = [];
    let last = 0;
    if (eaten == 0) {
        last = snake.length - 2;
    } else {
        last = snake.length - 1;
    }

    if (eaten == 0){
        tail = snake.shift();
        if (boxes[tail[0]][tail[1]] != 3) {
            boxes[tail[0]][tail[1]] = 0;
        }
        
    }

    switch (direction) {
        case 0 :

            
            newSeg.push(snake[last][0] + 1);
            newSeg.push(snake[last][1]);
            snake.push(newSeg)
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
    if (eaten > 0) {
        --eaten;
    }
}

function collisionCheckHard() {
    if (!playing) {
        return;
    }
    console.log(tickLength);

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

    if (upcomingXval < 0 || upcomingXval > 34
        || upcomingYval < 0 || upcomingYval > 20) {
            console.log("bonk");
            dieHard();
        }


    switch (boxes[upcomingXval][upcomingYval]){
        case 0:
            break;
        case 1:
            console.log("bonk");
            dieHard();
            break;
        case 2:
            eaten = 5;
            tickLength -= 2;
            score += 100;
            boxes[upcomingXval][upcomingYval] = 3;
            break;
        case 3:
            dieHard();
            break;
    }

}

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

function placeAppleHard(){
    if (eaten < 4) {
        return;
    }
    let options = appleOptionsHard();
    let index = Math.floor(options.length * Math.random());
    apple = options[index];
    boxes[apple[0]][apple[1]] = 2;
    
}

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


function constructBoxesHard(){
    for (let i = 0; i < 35; ++i){
        temp = [];
        for (let j = 0; j < 21; ++j){
            temp.push(0);
        }
        boxes.push(temp);
    }
    boxes[1][1] = 1;
    boxes[2][1] = 1;
    boxes[3][1] = 1;
    boxes[4][1] = 1;
    boxes[5][5] = 2;

}

function dieHard(){
    playing = false;
    canvas.style.backgroundColor = "#FF8000";
    peelHard();
}

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
    easy.style.display = "inline";
    medium.style.display = "inline";
    hard.style.display = "inline";
}

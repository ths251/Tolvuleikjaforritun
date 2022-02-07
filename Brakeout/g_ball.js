//Ball

const bounce = new Audio('audio/bounce.mp3');
const gameOver = new Audio('audio/gameover.mp3');
const powerUpSound = new Audio('audio/powerUp.mp3');
const box = new Audio('audio/box.mp3');


function Ball(descr){
    for(var property in descr){
        this[property] = descr[property];
    }
}

const scoreDisplay = document.querySelector(".high-score");

let multiScore = false;
let multiBalls = false;
let increaseSize = false;
let decreaseSize = false;
let highScore = 0;

ballCounter = 1;
if(multiBalls === true){
    ballCounter =3;
}


scoreDisplay.innerHTML = `High Score: ${highScore}`;

let score = 0;


Ball.prototype.update = function (du) {
    // Remember my previous position
    var prevX = this.cx;
    var prevY = this.cy;
    
    var nextX = prevX + this.xVel*du;
    var nextY = prevY + this.yVel*du;

    //I was having trouble with the collusion detection i used in the pong game so i didn't use the collidesWith function
    //Maybe it was my browser but this works much better.
    if(
        this.cx >= g_paddle.cx-g_paddle.halfWidth &&
        this.cx <= g_paddle.cx-g_paddle.halfWidth + g_paddle.halfWidth+g_paddle.halfWidth &&
        this.cy + this.radius+30 >= g_canvas.height - g_paddle.halfHeight*2

    ){
        this.yVel *=-1;
        box.play();
    }
    
    
    // Bounce off left and right edges
    if (nextX-this.radius < 0 || nextX+this.radius > g_canvas.width) {               
        this.xVel *= -1;
        box.play();

    }
    
    //Hit the top edge
    if(nextY<0+5){
        this.yVel *=-1;
        box.play();
    }

  
    //Reset if we fall of the bottom
    if(nextY+g_ball.radius > g_canvas.height){
            if(score>highScore){
                highScore = score;
                scoreDisplay.innerHTML = `High Score: ${highScore}`;
            }
            score = 0;
            generateBricks();
            counter = 0;
            this.yVel *=-1;
            level = 1;
            multiScore = false;
            multiBalls = false;
            increaseSize = false;
            decreaseSize = false;
            g_paddle.halfWidth = 50;
            g_paddle.halfHeight = 10;
            this.reset();
            gameOver.play();
    }
     
    //Collision with the bricks
    for(let c = columns-1; c>=0; c--){
       for(let r = rows-1; r>=0; r--){
            var b = bricks[c][r];
            if(b.status ===1){
                if(this.cx >= b.x && this.cx <= b.x+brickWidth && this.cy >= b.y && this.cy <= b.y+brickHeight) {
                    this.yVel *=-1;
                    b.status = 0;
                    bounce.play();
                    counter++;
                    //Statements for the powerUps 
                    if(multiScore === true){

                        score+=2;
                    }else{
                        score++;
                    }
                    
                    if(b.powerUp === "sizeUp"){
                        powerUpSound.play();
                        if(increaseSize === false){
                            g_paddle.halfWidth *=2;
                        }
                        increaseSize =true;

                    }
                    if(b.powerUp ==="sizeDown"){
                        powerUpSound.play();
                        if(decreaseSize ===false){
                            g_paddle.halfWidth /=2;
                        }
                        decreaseSize = true;
                    }

                    if(b.powerUp === "multiBalls"){
                        powerUpSound.play();
                        multiBalls = true;
                    }

                    if(b.powerUp === "increaseSpeed"){
                        powerUpSound.play();
                        this.xVel *=1.1;
                        this.yVel *=1.1;
                    }

                    if(b.powerUp ==="doublePoints"){
                        powerUpSound.play();
                        multiScore = true;
                    }
                   
                }
    
            }
        }
    }
    



    this.cx += this.xVel*du;
    this.cy += this.yVel*du;
};

Ball.prototype.reset = function () {
    this.cx = g_canvas.height /2;
    this.cy = g_canvas.height-100;
    this.xVel = 3;
    this.yVel = -3.5;

    
};

Ball.prototype.render = function (ctx) {    
    fillCircle(ctx, this.cx, this.cy, this.radius);

};

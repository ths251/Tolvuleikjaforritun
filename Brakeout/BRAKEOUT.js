//Brakeout game
//Author: Þorsteinn Sigurðsson


"use strict";
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");


//PADDLE

var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var g_paddle = new Paddle({
    cx:300,
    cy: 560,

    GO_LEFT : KEY_A,
    GO_RIGHT: KEY_D
});

var g_ball = new Ball ({
    cx: g_canvas.height /2,
    cy: g_canvas.height - 100,
    radius: 10,

    xVel: 3.0,
    yVel: -3.5
});

var g_ball1 = new Ball ({
    cx: g_canvas.height /2,
    cy: g_canvas.height -100,
    radius: 10,

    xVel: 3.0,
    yVel: -3.5
});







function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

function updateSimulation(du) {
    
    g_ball.update(du);
    g_paddle.update(du);
    if(multiBalls===true){
        g_ball1.update(du);
    }
}

function renderSimulation(ctx) {

    
    g_ball.render(ctx);
    g_paddle.render(ctx);
    drawBricks(ctx);
    drawScore(ctx);
    drawLevel(ctx);

    if(multiBalls===true){
        g_ball1.render(ctx);
        
    }

    levelUp();
   
    

}

generateBricks();
g_main.init();

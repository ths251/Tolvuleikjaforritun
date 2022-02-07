function Paddle(descr){
    for(var property in descr){
        this[property] = descr[property];
    }
}

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

Paddle.prototype.halfWidth = 50;
Paddle.prototype.halfHeight = 10;


Paddle.prototype.update = function(du){
    if(g_keys[this.GO_LEFT]){
        if(this.cx>0+this.halfWidth){
            this.cx -= 7*du;
        }else{
            this.cx -= 0*du;
        }
    }else if(g_keys[this.GO_RIGHT]){
        if(this.cx+this.halfWidth<g_canvas.width){
            this.cx +=7*du;
        }else{
            this.cx +=0*du;
        }
    }    
};

//Rendering the paddle
Paddle.prototype.render = function(ctx){
    ctx.fillStyle = 'pink';
        ctx.fillRect(this.cx - this.halfWidth,
        this.cy - this.halfHeight,
        this.halfWidth*2,
        this.halfHeight*2);
    
};

//Not used
//Object colliding with the paddle
Paddle.prototype.collidesWith = function (prevX, prevY, nextX, nextY, r) {
    var paddleEdge = this.cx;
// Check X coords
    if ((nextX - r < paddleEdge && prevX - r >= paddleEdge) ||(nextX + r > paddleEdge && prevX + r <= paddleEdge)) {
    // Check Y coords
        if (nextY + r >= this.cy - this.halfHeight &&
         nextY - r <= this.cy + this.halfHeight) {
        // It's a hit!
            return true;
        }
    }
    // It's a miss!
    return false;
    

   
        
};


function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "purple";
    ctx.fill();
}

function fillBox(ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

function drawScore(ctx){
    ctx.font = '16px Courier New';
    ctx.fillStyle = 'blue';
    ctx.fillText("Score: "+ score, 8, 20);
}

function drawLevel(ctx){
    ctx.font = '16px Courier New';
    ctx.fillStyle = 'red';
    ctx.fillText("Level: "+ level, 550, 20);
}




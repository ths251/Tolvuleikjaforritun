
let counter = 0;
let level = 1;
let rows = 5;
let columns = 9;

let brickWidth = 70;
let brickWeight = 70;
let brickHeight = 20;
let brickPadding = 2;
let paddingTop = 30;
let bricks = [];



function generateBricks() {
    var powerUps = ["sizeUp", "sizeDown", "multiBalls", "increaseSpeed", "doublePoints"];
    //reverse forloop to slice the powerUps array
    for(let c = columns-1; c>=0; c--) {
        bricks[c] = []
        
        //generate one power up for each column
        //then removing the power up from the array
        let randomPowerUp = Math.floor(Math.random()*powerUps.length);
        console.log(randomPowerUp);
        let powerUp = powerUps[randomPowerUp];
        powerUps.splice(randomPowerUp, 1);
        
        var randomBrickNumber = Math.floor(Math.random()*rows); //frá 0-2
        for(let r = rows-1; r>=0; r--){
            
            //Random powerup for one brick in each row
            if(bricks[c][r] === bricks[c][randomBrickNumber]){
                bricks[c][r] = {x: 0, y: 0, status: 1, color: "" , powerUp: powerUp}               
            }else{
                bricks[c][r] = {x: 0, y: 0, status: 1, color: "" , powerUp: ""}   
            }
        }
    } 
}


function drawBricks(ctx) {
    
    for(let c = columns-1; c>=0; c--){
        for(let r = rows-1; r>=0; r--){
            if(bricks[c][r].status === 1){
                var brickX = c * (brickWidth + brickPadding);
                var brickY = r * (brickHeight+ brickPadding) + paddingTop;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                //TODO klára að setja upp liti
                if(r === 0){
                    bricks[c][r].color = "blue"
                }else if(r === 1){
                    bricks[c][r].color = "red"
                }else if(r === 2){
                    bricks[c][r].color = "purple"
                }else if(r ===3){
                    bricks[c][r].color = "pink"
                }else{
                    bricks[c][r].color = "green"
                }

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
            }
        }
    } 
}


function levelUp(){
    
    if(rows*columns === counter){
        generateBricks();
        level++;
        counter = 0;
        multiScore = false;
        multiBalls = false;
        increaseSize = false;
        decreaseSize = false;
        
    }
    

}





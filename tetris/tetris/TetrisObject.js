// ===================
// TETRIS OBJECT STUFF
// ===================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object


function TetrisObject(descr) {
  // Common inherited setup logic from Entity
  this.setup(descr);
  this.rememberResets();
  this.reRender();
  // Default sprite, if not otherwise specified
  //this.sprite = this.sprite || g_sprites.TetrisObject;

  // calc width and height from tetremino
  this.calcWidthNHeight();

  // Set normal drawing scale, and warp state off
  this._scale = 1;

};

TetrisObject.prototype = new Entity();



TetrisObject.prototype.rememberResets = function () {
  // Remember my reset positions
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
  this.reset_rotation = this.rotation;
};

TetrisObject.prototype.KEY_ROTATE = 'W'.charCodeAt(0);    // Rotate tetromino
TetrisObject.prototype.KEY_DOWN = 'S'.charCodeAt(0);      // Move tetromino down
TetrisObject.prototype.KEY_LEFT = 'A'.charCodeAt(0);      // Move tetromino left
TetrisObject.prototype.KEY_RIGHT = 'D'.charCodeAt(0);     // Move tetromino right
TetrisObject.prototype.KEY_DROP = " ".charCodeAt(0);      // Drop tetromino to the ground
TetrisObject.prototype.KEY_SWITCH = 'C'.charCodeAt(0);    // Hold tetromino

// Initial, inheritable, default values
TetrisObject.prototype.rotation = 0;
TetrisObject.prototype.cx = 4;
TetrisObject.prototype.cy = 0;

// Breytur fyrir tetramino
TetrisObject.prototype.tetromino;
TetrisObject.prototype.tetrominoN = 0;
TetrisObject.prototype.currentTetromino;

TetrisObject.prototype._width = 0;
TetrisObject.prototype._height = 0;

// My state, current = 0, next = 1, being held = 2
TetrisObject.prototype.myState = -1;

//"Gravity"
TetrisObject.prototype.dropRate = 1000 / NOMINAL_UPDATE_INTERVAL;

//Sound globals
const fall = new Audio('audio/fall.wav');
const line = new Audio('audio/line.wav');
const level = new Audio('audio/success.wav');
const gameOver = new Audio('audio/gameover.wav');
const clear = new Audio('audio/clear.wav');
const game = new Audio('audio/tetris-gameboy-02.mp3')
game.volume = 0.1;

TetrisObject.prototype.update = function (du) {
  if (this.myState === 1 && GET_NEXT_TETROMINO) {
    if (!this.old) {
      this.old = true;
    } else {
      GET_NEXT_TETROMINO = false;
      this.myState = 0;
    }
    this.reRender();
  }

  if (SWITCH_HOLDING_TETROMINOS) {
    if (this.myState === 2) {
      if (!this.tetromino) {
        createTetro(1, null, false);
        GET_NEXT_TETROMINO = true;
        this.kill();
        SWITCH_HOLDING_TETROMINOS = false;
        return entityManager.KILL_ME_NOW;
      } else {
        this.myState = 0;
        this.cx = CURRENT_COORDINATES[0];
        this.cy = CURRENT_COORDINATES[1];
        SWITCH_HOLDING_TETROMINOS = false;
      }
    }
  }

  if (this.myState !== 0) return;

  if (eatKey(this.KEY_LEFT)) {
    this.reset();
    this.oneLeft();
  }

  if (eatKey(this.KEY_RIGHT)) {
    this.reset();
    this.oneRight();
  }

  if (eatKey(this.KEY_DOWN)) {
    this.reset();
    this.oneDown();
  }

  if (eatKey(this.KEY_DROP)) {
    this.reset();
    while (true) {
      if ((this.cy + this._height < g_grid.gridRows)) {
        if (!this.objectCollisionDown()) {
          this.cy += 1;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    this.spawnNew();
  }

  if (eatKey(this.KEY_SWITCH)) {
    this.reset();
    this.myState = 2;
    SWITCH_HOLDING_TETROMINOS = true;
    CURRENT_COORDINATES = [this.cx, this.cy];
    this.backToStart();
    return;
  }

  if (eatKey(this.KEY_ROTATE)) {
    if (!this.rotate() && !this.rotateDown()) {
      this.reset();
      this.cx = this.cx;
      this.cy = this.cy;
    }

    // Conditions for rotating the tetromino if there is a vertical or horizontal collision
    if (this.rotate()) {
      this.reset();
      // Create a tetromino and check its width
      let currentRotatedTetromino = this.currentTetromino;
      let rotatedN = this.tetrominoN;
      let rotatedTetromino = this.tetromino;

      rotatedN = (rotatedN + 1) % rotatedTetromino.length;
      currentRotatedTetromino = rotatedTetromino[rotatedN];

      // The width of the new tetromino which has been rotated
      var newWidth = this.calcNewWidth(currentRotatedTetromino);
      this.cx = g_grid.gridColumns - newWidth;
    }

    if (this.rotateDown()) {
      // Get the height of the new tetromino
      this.reset();
      let currentRotatedTetromino = this.currentTetromino;
      let rotatedN = this.tetrominoN;
      let rotatedTetromino = this.tetromino;

      rotatedN = (rotatedN + 1) % rotatedTetromino.length;
      currentRotatedTetromino = rotatedTetromino[rotatedN];
      var newHeight = this.calcNewHeight(currentRotatedTetromino);
      this.cy = g_grid.gridRows - newHeight;
    }

    if (!this.rotateCollision()) {
      // Rotate the tetromino if there is no collistion to another object
      this.reset()
      this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
      this.currentTetromino = this.tetromino[this.tetrominoN];
      this.reRender();
      this.calcWidthNHeight();
    }
  }

  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }

  this.dropRate -= du;
  if (this.dropRate < 0 && this.cy + this._height < g_grid.gridRows + 1) {
    this.reset();
    this.dropRate = g_grid.speed / NOMINAL_UPDATE_INTERVAL;
    this.oneDown();
  }

};

TetrisObject.prototype.reRender = function () {
  if (this.myState === 0) {
    for (let r = 0; r < this.currentTetromino.length; r++) {
      let x = this.currentTetromino[r][0] + this.cx;
      let y = this.currentTetromino[r][1] + this.cy;
      if (g_grid.cells[x][y].status !== 2) {
        g_grid.cells[x][y] = {
          status: 1,
          sprite: this.currentTetroSprite
        }
      }
    }
  }
}

TetrisObject.prototype.calcWidthNHeight = function () {
  var wLargestX = 0;
  var hLargestX = 0;

  // Go through tetremino
  for (var i = 0; i < this.currentTetromino.length; i++) {
    var tetreminoBlock = this.currentTetromino[i];
    // Width
    if (tetreminoBlock[0] > wLargestX) {
      wLargestX = tetreminoBlock[0];
    }
    // Height
    if (tetreminoBlock[1] > hLargestX) {
      hLargestX = tetreminoBlock[1];
    }
  }

  this._width = wLargestX;
  this._height = hLargestX;

}

TetrisObject.prototype.calcNewWidth = function (tetromino) {
  var wLargestX = 0;
  var newWidth;
  // Go through tetremino
  for (var i = 0; i < tetromino.length; i++) {
    var tetreminoBlock = tetromino[i];
    // Width
    if (tetreminoBlock[0] > wLargestX) {
      wLargestX = tetreminoBlock[0];
    }
  }
  newWidth = wLargestX;
  return newWidth;

}

TetrisObject.prototype.calcNewHeight = function (tetromino) {
  var hLargestX = 0;
  var newHeight;
  // Go through tetremino
  for (var i = 0; i < tetromino.length; i++) {
    var tetreminoBlock = tetromino[i];
    // Width
    // Height
    if (tetreminoBlock[1] > hLargestX) {
      hLargestX = tetreminoBlock[1];
    }
  }

  newHeight = hLargestX;
  return newHeight;
}

TetrisObject.prototype.oneDown = function () {
  if ((this.cy + this._height < g_grid.gridRows)) {
    if (!this.objectCollisionDown()) {
      this.cy += 1;
      this.reRender();
    } else {
      this.spawnNew();
    }
  } else {
    this.spawnNew();
  }
}

TetrisObject.prototype.spawnNew = function () {
  // Kill the current tetromino
  this.killTetromino();
  this.kill();

  if (this.cy === 0) {
    // Player lost
    g_grid.lost = true;
  }

  // If player is still playing make new tetromino
  if (!g_grid.lost) {
    g_grid.checkRows();
    createTetro(1, null, false);
    GET_NEXT_TETROMINO = true;
  }
}

TetrisObject.prototype.oneRight = function () {
  if (((this.cx + this._width) < g_grid.gridColumns) && (!this.objectCollisionRight())) {
    this.cx += 1;
  }
  this.reRender();
}

TetrisObject.prototype.oneLeft = function () {
  if (this.cx > 0 && !this.objectCollisionLeft()) {
    this.cx -= 1;
  }
  this.reRender();
}

TetrisObject.prototype.objectCollisionDown = function () {
  let tetrominoCopy = this.currentTetromino;
  for (let i = 0; i < tetrominoCopy.length; i++) {
    let square = tetrominoCopy[i];
    let x = square[0] + this.cx;
    let y = square[1] + this.cy;
    if (g_grid.cells[x][y + 1].status === 2) {
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.objectCollisionRight = function () {
  for (var i = 0; i < this.currentTetromino.length; i++) {
    var square = this.currentTetromino[i];
    var x = square[0] + this.cx;
    var y = square[1] + this.cy;
    x++;
    if (g_grid.cells[x][y].status === 2) {
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.objectCollisionLeft = function () {
  for (var i = 0; i < this.currentTetromino.length; i++) {
    var square = this.currentTetromino[i];
    var x = square[0] + this.cx;
    var y = square[1] + this.cy;
    x--;
    if (g_grid.cells[x][y].status === 2) {
      return true;
    }
  }

  return false;
}

TetrisObject.prototype.rotate = function () {
  var tetromino = this.tetromino;
  var tetrominoCopy = this.currentTetromino;
  var tetrominoNCopy = this.tetrominoN;
  // Rotate the copy object
  tetrominoNCopy = (tetrominoNCopy + 1) % tetromino.length;
  tetrominoCopy = tetromino[tetrominoNCopy];
  this.reRender();
  for (var i = 0; i < tetrominoCopy.length; i++) {
    var square = tetrominoCopy[i];
    var x = square[0] + this.cx;
    if (x >= g_grid.gridColumns) {
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.rotateDown = function () {
  var tetromino = this.tetromino;
  var tetrominoCopy = this.currentTetromino;
  var tetrominoNCopy = this.tetrominoN;
  // Rotate the copy object
  tetrominoNCopy = (tetrominoNCopy + 1) % tetromino.length;
  tetrominoCopy = tetromino[tetrominoNCopy];
  this.reRender();
  for (var i = 0; i < tetrominoCopy.length; i++) {
    var square = tetrominoCopy[i];
    var y = square[1] + this.cy;
    if (y >= g_grid.gridRows) {
      console.log("haha");
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.rotateCollision = function () {
  var tetromino = this.tetromino;
  var tetrominoCopy = this.currentTetromino;
  var tetrominoNCopy = this.tetrominoN;

  // Rotate the copy object
  tetrominoNCopy = (tetrominoNCopy + 1) % tetromino.length;
  tetrominoCopy = tetromino[tetrominoNCopy];

  for (var i = 0; i < tetrominoCopy.length; i++) {
    // Check the x and y on the copy object
    var square = tetrominoCopy[i];
    var x = square[0] + this.cx;
    var y = square[1] + this.cy;
    if (g_grid.cells[x][y].status === 2) {
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.backToStart = function () {
  this.cx = this.reset_cx;
  this.cy = this.reset_cy;
}

TetrisObject.prototype.reset = function () {
  for (let r = 0; r < this.currentTetromino.length; r++) {
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = { status: 0 }
  }
}

TetrisObject.prototype.killTetromino = function () {
  for (let r = 0; r < this.currentTetromino.length; r++) {
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = {
      status: 2,
      sprite: this.currentTetroSprite
    }
  }
}

TetrisObject.prototype.render = function (ctx) {
  const gridRight = g_grid.cx + g_grid.gridWidth / 2;
  const gridTop = g_grid.cy - g_grid.gridHeight / 2;
  const gridMidVertical = g_grid.cy;

  const cellW = g_grid.cellWidth;
  const cellH = g_grid.cellHeight;
  const cellP = g_grid.cellPadding;

  const tetro = this.currentTetromino;

  // Render me as the next tetromino
  if (this.myState === 1) {
    ctx.font = "30px Arial";
    ctx.fillText("Next:", gridRight + 50, gridTop + 50);

    for (let r = 0; r < tetro.length; r++) {
      let x = gridRight + 50 + (tetro[r][0] * cellW + tetro[r][0] * cellP);
      let y = gridTop + 75 + (tetro[r][1] * cellH + tetro[r][1] * cellP);

      this.currentTetroSprite.drawAt(ctx, x, y);
    }
    this.reRender();
  }

  // Render me as the hold tetromino
  if (this.myState === 2) {
    ctx.font = "30px Arial";
    ctx.fillText("Holding:", gridRight + 50, gridMidVertical + 50);
    if (tetro) {
      for (let r = 0; r < tetro.length; r++) {
        let x = gridRight + 50 + (tetro[r][0] * cellW + tetro[r][0] * cellP);
        let y = gridMidVertical + 75 + (tetro[r][1] * cellH + tetro[r][1] * cellP);

        this.currentTetroSprite.drawAt(ctx, x, y);
      }
    }
    this.reRender();
  }

};

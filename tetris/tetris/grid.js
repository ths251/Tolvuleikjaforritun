"use strict";

Grid.prototype - new Entity();

function Grid(descr) {
  for (var property in descr) {
    this[property] = descr[property];
  }

  // dynamic size
  this.cellWidth = Math.floor(this.gridWidth / (this.gridColumns + 1)) - this.cellPadding;
  this.cellHeight = Math.floor(this.gridHeight / (this.gridRows + 1)) - this.cellPadding;
}

// ef leikmaður er búinn að tapa
Grid.prototype.lost = false;
Grid.prototype.lostAnimationToggle = false;
Grid.prototype.lostAnimationDone = false;

// stærðar breytur
Grid.prototype.gridRows = 20;
Grid.prototype.gridColumns = 10;

// staðs. breytur
Grid.prototype.gridWidth = 100;
Grid.prototype.gridHeight = 100;
Grid.prototype.cx = 50;
Grid.prototype.cy = 50;

// cell breytur
Grid.prototype.cellPadding = 2;
Grid.prototype.cellWidth = 30;
Grid.prototype.cellHeight = 30;

//Þetta er þá gridið okkar
Grid.prototype.cells = [];

// Scoring system
Grid.prototype.lines = 0;
Grid.prototype.level = 1;
Grid.prototype.speed = 1000;
Grid.prototype.score = 0;
Grid.prototype.linesElem = document.getElementById('lines');
Grid.prototype.levelElem = document.getElementById('level');
Grid.prototype.scoreElem = document.getElementById('score');

Grid.prototype.highscores = [];
// Ugly variable to only add score to highscores once
Grid.prototype.hasBeenAddedToHighscore = false;

Grid.prototype.generateGrid = function () {
  //createTetro();
  for (var c = 0; c <= this.gridColumns; c++) {
    this.cells[c] = [];
    for (var r = 0; r <= this.gridRows; r++) {
      //merkja 0 ef það er tómt
      this.cells[c][r] = { status: 0 }
    }
  }
}

Grid.prototype.resetGrid = function () {
  for (var c = 0; c <= this.gridColumns; c++) {
    this.cells[c] = [];
    for (var r = 0; r <= this.gridRows; r++) {
      //merkja 0 ef það er tómt
      this.cells[c][r] = { status: 0 }
    }
  }
}

Grid.prototype.drawBoard = function (ctx) {
  for (var c = 0; c <= this.gridColumns; c++) {
    for (var r = 0; r <= this.gridRows; r++) {
      var cellX = this.cx - (this.gridWidth / 2) + c * (this.cellWidth + this.cellPadding);
      var cellY = this.cy - (this.gridHeight / 2) + r * (this.cellHeight + this.cellPadding) + this.cellPadding;
      if (this.lost && !this.lostAnimationToggle) {
        if (this.cells[c][r].status === 3) {
          this.cells[c][r].sprite.drawAt(ctx, cellX, cellY);
        }

        if (this.cells[c][r].status !== 3) {
          this.lostAnimationToggle = true;
          game.pause();
          game.currentTime = 0;
          gameOver.play();
          gameOver.volume = 0.2;
          var keys = Object.keys(g_sprites);

          const index = keys.indexOf("empty");
          if (index > -1) {
            keys.splice(index, 1);
          }

          const theSprite = g_sprites[keys[Math.floor(Math.random() * keys.length)]];

          this.cells[c][r] = { status: 3, sprite: theSprite };
        }

        if (c === this.gridColumns && r === this.gridRows) {
          this.lostAnimationDone = true;
        }
      } else {
        if (this.cells[c][r].status === 0) {
          g_sprites.empty.drawAt(ctx, cellX, cellY);
        } else {
          this.cells[c][r].sprite.drawAt(ctx, cellX, cellY);
        }
      }
    }
  }

  // reset this param for next iteration
  this.lostAnimationToggle = false;

  if (this.lostAnimationDone) {
    game.pause();
    game.currentTime = 0;
    this.drawFinalScore(ctx);
  }

  if (!this.lostAnimationDone && !this.lostAnimationToggle) {
    game.play();
  }

}

Grid.prototype.restartFunction = function () {
  // Restart score, level, lines and speed
  this.score = 0;
  this.scoreElem.innerHTML = this.score;
  this.level = 1;
  this.levelElem.innerHTML = this.level;
  this.lines = 0;
  this.linesElem.innerHTML = this.lines;
  this.speed = 1000;
  entityManager.clear();
  // Restart the game
  this.lost = false;
  this.lostAnimationToggle = false;
  this.lostAnimationDone = false;
  GET_NEXT_TETROMINO = false;
  SWITCH_HOLDING_TETROMINOS = false;
  CURRENT_COORDINATES = [0, 4];
  this.resetGrid();
  createInitialObjects();

  // Next score will be added to highscores
  this.hasBeenAddedToHighscore = false;
}

Grid.prototype.drawFinalScore = function (ctx) {
  // Add to highscore
  if (!this.hasBeenAddedToHighscore) {
    this.highscores.push(this.score);
    this.highscores.sort((a, b) => {
      return b - a;
    });
    this.hasBeenAddedToHighscore = true;
  }

  const startX = this.cx - this.gridWidth * 3 / 8;
  const startY = this.cy - this.gridHeight * 3 / 8;
  const myWidth = 6 / 8 * this.gridWidth;
  const myHeight = 6 / 8 * this.gridHeight;

  util.fillBox(ctx, startX, startY, myWidth, myHeight, "black");

  ctx.save();

  ctx.font = '32px serif';
  ctx.textAlign = "center";
  ctx.fillText('Final score', startX + myWidth / 2, startY + myHeight / 8);

  ctx.font = '48px serif';
  ctx.fillText(`${this.score}`, startX + myWidth / 2, startY + myHeight / 4);

  ctx.font = '32px serif';
  ctx.fillText("Restart", startX + myWidth / 2, startY + myHeight / 2);
  g_canvas.addEventListener("click", function listener(e) {
    g_canvas.removeEventListener("click", listener);
    g_grid.restartFunction();
    console.log(e);
  });

  ctx.fillText("Highscore", startX + myWidth / 2, startY + myHeight / 1.5);

  ctx.font = '24px serif';
  if (this.highscores[0]) {
    ctx.fillText(`${this.highscores[0]}`, startX + myWidth / 2, startY + myHeight / 1.35);
  }
  if (this.highscores[1]) {
    ctx.fillText(`${this.highscores[1]}`, startX + myWidth / 2, startY + myHeight / 1.25);
  }
  if (this.highscores[2]) {
    ctx.fillText(`${this.highscores[2]}`, startX + myWidth / 2, startY + myHeight / 1.15);
  }

  ctx.restore();
}

Grid.prototype.setUpCanvas = function (ctx) {
  this.generateGrid();
}

Grid.prototype._checkLevelUp = function (rows) {
  this.lines += rows;
  if (this.lines >= 10 * this.level) {
    this.level++;
    level.play();
    level.sound = 0.2;
    if (this.speed > 100) {
      this.speed -= 100;
    }
  }

  this.linesElem.innerHTML = this.lines;
  this.levelElem.innerHTML = this.level;
}

Grid.prototype._addScore = function (rows) {
  switch (rows) {
    case 0:
      break;
    case 1:
      this.score += (40 * this.level);
      break;
    case 2:
      this.score += (100 * this.level);
      break;
    case 3:
      this.score += (300 * this.level);
      break;
    default:
      this.score += (1200 * this.level);
      break;
  }
  this.scoreElem.innerHTML = this.score;
}

Grid.prototype.checkRows = function () {
  let rowsFull = 0;
  for (let r = this.gridRows; r >= 0; r--) {
    let rowFull = true;
    for (let c = 0; c <= this.gridColumns; c++) {
      if (this.cells[c][r].status !== 2) {
        rowFull = false;
        //fall.play();
        break;
      }
    }
    if (rowFull) {
      //line.play();
      clear.play();
      rowsFull += 1;
      for (let c = 0; c <= this.gridColumns; c++) {
        this.cells[c][r].status = 0;
      }
      for (let row = r - 1; row >= 0; row--) {
        for (let col = 0; col <= this.gridColumns; col++) {
          if (this.cells[col][row].status === 2) {
            this.cells[col][row].status = 0;
            this.cells[col][row + 1].status = 2;
            this.cells[col][row + 1].sprite = this.cells[col][row].sprite;
          }
        }
      }
      r++;
    } else {
      fall.play();
      fall.sound = 0.2;
    }
  }

  this._checkLevelUp(rowsFull)

  this._addScore(rowsFull);
}

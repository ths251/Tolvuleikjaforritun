// ======
// TETRIS
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var muteButton = document.getElementById("muteButton");
var unmuteButton = document.getElementById("unmutebutton");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ======================
// UGLY GLOBALS
// ======================
const g_grid = new Grid({
  gridWidth: Math.floor(g_canvas.width / 2),
  gridHeight: g_canvas.height,
  cx: Math.floor(g_canvas.width / 4),
  cy: Math.floor(g_canvas.height / 2)
})

var GET_NEXT_TETROMINO = false;
var SWITCH_HOLDING_TETROMINOS = false;
var CURRENT_COORDINATES = [0, 4];

// ======================
// CREATE INITIAL OBJECTS
// ======================

function createInitialObjects() {
  createTetro(0);
  createTetro(1, null, true);
  createTetro(2);
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
  // Nothing to do here!
  // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
  processDiagnostics();
  entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED = keyCode('M');;
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {
  if (eatKey(KEY_MIXED))
    g_allowMixedActions = !g_allowMixedActions;

  if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

  if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
  g_grid.drawBoard(ctx);
  entityManager.render(ctx);
  if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============
var g_images = {};

function requestPreloads() {

  var requiredImages = {
    blue: "./images/blueTile.png",
    green: "./images/greenTile.png",
    orange: "./images/orangeTile.png",
    purple: "./images/purpleTile.png",
    red: "./images/redTile.png",
    turkish: "./images/turkishTile.png",
    yellow: "./images/yellowTile.png",
    empty: "./images/emptyTile.png"
  };

  imagesPreload(requiredImages, g_images, preloadDone);

}

var g_sprites = {};

function preloadDone() {

  g_sprites.blue = new Sprite(g_images.blue);
  g_sprites.green = new Sprite(g_images.green);
  g_sprites.orange = new Sprite(g_images.orange);
  g_sprites.purple = new Sprite(g_images.purple);
  g_sprites.red = new Sprite(g_images.red);
  g_sprites.turkish = new Sprite(g_images.turkish);
  g_sprites.yellow = new Sprite(g_images.yellow);
  g_sprites.empty = new Sprite(g_images.empty);

  createInitialObjects();

  main.init();

}

function startGame() {
  ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
  requestPreloads();
  g_grid.setUpCanvas(g_ctx);
}

function loadStartScreen(ctx) {

  ctx.save();

  // Background color
  util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, "black");

  // Tetromino image
  let startImage = new Image();
  startImage.src = "./images/tetris.png";
  startImage.onload = function () {
    ctx.drawImage(startImage, g_canvas.width / 2 - startImage.width / 2, g_canvas.height / 2 - startImage.height / 2);
  }

  let height = g_canvas.height / 2 - 100;

  // Tetris text
  ctx.font = '64px serif';
  ctx.fillStyle = "red";
  ctx.fillText('T', g_canvas.width / 2 - 130, height);
  ctx.fillStyle = "green";
  ctx.fillText('E', g_canvas.width / 2 - 80, height);
  ctx.fillStyle = "orange";
  ctx.fillText('T', g_canvas.width / 2 - 30, height);
  ctx.fillStyle = "purple";
  ctx.fillText('R', g_canvas.width / 2 + 20, height);
  ctx.fillStyle = "lightblue";
  ctx.fillText('I', g_canvas.width / 2 + 70, height);
  ctx.fillStyle = "yellow";
  ctx.fillText('S', g_canvas.width / 2 + 100, height);

  // Start game text
  ctx.font = '32px serif';
  ctx.textAlign = "center";
  ctx.fillStyle = "blue";
  ctx.fillText('START GAME', g_canvas.width / 2, g_canvas.height - 150);

  ctx.restore();

  // Click the mouse on the canvas to start game
  g_canvas.addEventListener('click', function listener(e) {
    g_canvas.removeEventListener('click', listener);
    startGame();
  });

  muteButton.addEventListener("click", function listener(e){
    game.volume = 0;
  });

  unmuteButton.addEventListener("click", function listener(e){
    game.volume = 0.1;
  });

}

// Kick it off with the start screen
loadStartScreen(g_ctx);

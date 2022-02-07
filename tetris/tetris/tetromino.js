let colors = ['red'];

let tetrominoRotations = 0;

// Give state to say what kind of tetromino
function createTetro(state = -1, coords = null, old = null) {
  // Define all tetrominos
  const TETROMINOS = [
    [T, g_sprites.purple],
    [I, g_sprites.turkish],
    [SQUARE, g_sprites.yellow],
    [L, g_sprites.blue],
    [L2, g_sprites.orange],
    [Z, g_sprites.green],
    [Z2, g_sprites.red]
  ];

  let r = Math.floor(Math.random() * TETROMINOS.length);
  var tetromino = TETROMINOS[r][0];
  var curTetrominoSprite = TETROMINOS[r][1];

  let rNext = Math.floor(Math.random() * TETROMINOS.length);
  var nextTetromino = TETROMINOS[rNext][0];
  var nextColor = TETROMINOS[rNext][1];

  // Making a holding tetromino is only done in the begining
  if (state === 2) {
    entityManager.generateObject({
      tetromino: null,
      tetrominoN: 0,
      currentTetromino: [],
      currentTetroSprite: null,
      myState: state
    });
  }

  if (state === 1) {
    entityManager.generateObject({
      tetromino: tetromino,
      tetrominoN: 0,
      currentTetromino: tetromino[0],
      currentTetroSprite: curTetrominoSprite,
      myState: state,
      old: old
    });
  }

  if (state === 0) {
    entityManager.generateObject({
      tetromino: tetromino,
      tetrominoN: 0,
      currentTetromino: tetromino[0],
      currentTetroSprite: curTetrominoSprite,
      myState: state
    });
  }
}

function createNextTetro() {
  let r = Math.floor(Math.random() * TETROMINOS.length);
  var tetromino = TETROMINOS[r][0];

  entityManager.generateObject({
    nextTetromino: nextTetrominoTEST,
    currNextTetromino: nextTetrominoTEST[0]
  });
}



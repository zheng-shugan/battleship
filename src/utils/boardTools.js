import * as BLOCK_STATE from './blockStates';
import * as SHIPS from './ships';

const ROWS = 8;
const COLS = 8;

export const createEmptyBoard = () => {
  return [...new Array(64)].fill(BLOCK_STATE.EMPTY);
};

/**
 * Coordinate to index
 *
 * @param row the row
 * @param col the col
 * @return { row, col } to index
 * */
export const coordinateToIndex = (row, col) => row * COLS + col;

/**
 * Index to coordinate
 *
 * @param index the index
 * @return index to { row, col }
 * */
export const indexToCoordinate = (index) => {
  return {
    row: Math.floor(index / COLS),
    col: index % COLS,
  };
};

/**
 * Placing ships
 * 
 * @param board the game board
 * @param ship the ship
 * @param placing can placing?
 * 
 * @return placed board
 * */
export const placeShipOnBoard = (board, ship, placing = false) => {
  let boardCopy = [...board];
  if (ship?.position.row != null) {
    const {
      name,
      length,
      direction,
      position: { row, col },
    } = ship;

    switch (direction) {
      case 'HORIZONTAL':
        switch (canBePlaced(boardCopy, length, direction, row, col)) {
          case 'OK':
            for (let i = 0; i < length; i++) {
              boardCopy[coordinateToIndex(row, col + i)] = placing
                ? BLOCK_STATE.PLACING
                : name;
            }
            break;
          case 'OVERFLOW':
            for (let i = 0; i < COLS - col; i++) {
              boardCopy[coordinateToIndex(row, col + i)] =
                BLOCK_STATE.FORBIDDEN;
            }
            break;
          case 'OCCUPIED':
            for (let i = 0; i < length; i++) {
              boardCopy[coordinateToIndex(row, col + i)] =
                BLOCK_STATE.FORBIDDEN;
            }
        }
        break;
      case 'VERTICAL':
        switch (canBePlaced(boardCopy, length, direction, row, col)) {
          case 'OK':
            for (let i = 0; i < length; i++) {
              boardCopy[coordinateToIndex(row + i, col)] = placing
                ? BLOCK_STATE.PLACING
                : name;
            }
            break;
          case 'OVERFLOW':
            for (let i = 0; i < ROWS - row; i++) {
              boardCopy[coordinateToIndex(row + i, col)] =
                BLOCK_STATE.FORBIDDEN;
            }
            break;
          case 'OCCUPIED':
            for (let i = 0; i < length; i++) {
              boardCopy[coordinateToIndex(row + i, col)] =
                BLOCK_STATE.FORBIDDEN;
            }
        }
    }
  }
  return boardCopy;
};

/**
 * Check the coordinate { row, col } can be placing ship?
 * 
 * @param board the game board
 * @param length the ship length
 * @param direction the ship direction
 * @param row coordinate row
 * @param col coordinate col
 * 
 * @return can place?
 * */
export const canBePlaced = (board, length, direction, row, col) => {
  switch (direction) {
    case 'HORIZONTAL':
      // In the game board
      if (col + length <= COLS) {
        // No other ship
        for (let i = 0; i < length; i++) {
          if (board[coordinateToIndex(row, +col + i)] !== BLOCK_STATE.EMPTY)
            // Have other ship
            return 'OCCUPIED';
        }
        return 'OK';
      }
      // Out of board
      return 'OVERFLOW';
    case 'VERTICAL':
      if (row + length <= ROWS) {
        for (let i = 0; i < length; i++) {
          if (board[coordinateToIndex(row + i, col)] !== BLOCK_STATE.EMPTY)
            return 'OCCUPIED';
        }
        return 'OK';
      }
      return 'OVERFLOW';
  }
};

/**
 * Rending attack position
 * 
 * @param board the game board
 * @param position the attack postion
 * 
 * @return attacked board
 * */
export const showSelectionBlock = (board, position) => {
  if (position.row === null) return board;
  const boardCopy = [...board];
  const index = coordinateToIndex(position.row, position.col);
  if (boardCopy[index] === BLOCK_STATE.EMPTY) {
    boardCopy[index] = BLOCK_STATE.SELECTING;
  }
  return boardCopy;
};

/**
 * Check can attack?
 *
 * @param attack the attack
 *
 * @return can attack?
 * */
export const canAttack = (attack) => {
  const { row, col } = attack[0].position;
  const attackCopy = [...attack];
  attackCopy.shift();
  // Is attacked?
  const isAttacked = attackCopy.find(
    (item) => item.position.row === row && item.position.col === col
  );

  return !isAttacked;
};

/**
 * Check attack result
 *
 * @param finalBoard the game board
 * @param position attacked position
 * 
 * @return position attacked?
 * */
export const checkAttack = (finalBoard, position) => {
  const index = coordinateToIndex(position.row, position.col);
  return finalBoard[index] !== BLOCK_STATE.EMPTY;
};

/**
 * Rending attack result
 * 
 * @param board the game board
 * @param attack the attack
 * 
 * @return attacked board
 * */
export const showAttack = (board, attack) => {
  const boardCopy = [...board];
  attack.forEach((item) => {
    const index = coordinateToIndex(item.position.row, item.position.col);
    if (item.state !== BLOCK_STATE.SELECTING) {
      boardCopy[index] = item.state;
    }
  });
  return boardCopy;
};

/**
 * Check the ship sinking?
 *
 * @param attack the attack
 * @param finalBoard the game board
 * @param row the coordinate row
 * @param col the coordinate col
 * @param potentialTarget the potential target
 *
 * @return sink or not sink
 * */
export const checkSink = (
  attack,
  finalBoard,
  row,
  col,
  potentialTarget = null
) => {
  const ship = finalBoard[coordinateToIndex(row, col)];
  if (ship === 'empty') return attack; // 没打中
  const attackCopy = [...attack];
  const length = SHIPS[ship.toUpperCase()].length;
  const amount = attack.filter((item) => item.ship === ship).length;
  if (amount === length) {
    // Sinking
    attackCopy.forEach((item) => {
      if (item.ship === ship) {
        item.state = BLOCK_STATE.SANK;
      }
    });

    // If computer, delete all potential target
    if (potentialTarget) {
      potentialTarget.current = [];
    }
    return attackCopy;
  }
  return attack;
};

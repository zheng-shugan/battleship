import {
  canBePlaced,
  coordinateToIndex,
  createEmptyBoard,
  indexToCoordinate,
  placeShipOnBoard,
} from './boardTools';

export const getRandInt = (min, max) => {
  return Math.floor((max - min + 1) * Math.random() + min);
};

/**
 * Generate a random coordinate 
 * 
 * @return a random coordinate
 * */
export const getRandCoordinate = () => {
  return {
    row: getRandInt(0, 7),
    col: getRandInt(0, 7),
  };
};

/**
 * Return random direction
 * 
 * @return a random direction
 * */
export const getRandDirection = () => {
  return getRandInt(0, 1) ? 'HORIZONTAL' : 'VERTICAL';
};

/**
 * Auto placing ship
 * */
export const computerPlacingShip = (availableShips) => {
  let board = createEmptyBoard();
  const shipsCopy = [...availableShips];
  shipsCopy.forEach((ship) => {
    while (true) {
      const position = getRandCoordinate();
      const direction = getRandDirection();
      const length = ship.length;
      if (
        canBePlaced(board, length, direction, position.row, position.col) ===
        'OK'
      ) {
        // Placing ships
        board = placeShipOnBoard(board, {
          ...ship,
          direction: direction,
          position: position,
        });
        break;
      }
    }
  });
  return board;
};

/**
 * Check can attack?
 *
 * @param attack the attack
 * @param row coordinate row
 * @param col coordinate col
 *
 * @return the coordinate can attack?
 * */
export const canAttack = (attack, row, col) => {
  const attackCopy = [...attack];
  attackCopy.shift();
  // Check coordinate
  const isAttacked = attackCopy.find(
    (item) => item.position.row === row && item.position.col === col
  );
  // If attacked return false
  return !isAttacked;
};

/**
 * Random attack
 *
 * @param attack the attack
 *
 * @return the attack coordinate
 * */
export const randomAttack = (attack) => {
  while (true) {
    const row = getRandInt(0, 7);
    const col = getRandInt(0, 7);
    if (canAttack(attack, row, col)) {
      return { row: row, col: col };
    }
  }
};

/**
 * Add potential target
 *
 * @param position the ship position
 * @param attack the attack
 * @param potentialTarget the potential target
 *
 * @return potential target
 * */
export const addPotentialTarget = (position, attack, potentialTarget) => {
  const { row, col } = position;
  if (row + 1 <= 7 && canAttack(attack, row + 1, col)) {
    potentialTarget.current.push(coordinateToIndex(row + 1, col));
  }
  if (row - 1 >= 0 && canAttack(attack, row - 1, col)) {
    potentialTarget.current.push(coordinateToIndex(row - 1, col));
  }
  if (col + 1 <= 7 && canAttack(attack, row, col + 1)) {
    potentialTarget.current.push(coordinateToIndex(row, col + 1));
  }
  if (col - 1 >= 0 && canAttack(attack, row, col - 1)) {
    potentialTarget.current.push(coordinateToIndex(row, col - 1));
  }
  return potentialTarget.current;
};

/**
 * Attack potential target
 *
 * @param potentialTarget the tagret
 * @param attack the attack
 * */
export const attackPotentialTarget = (potentialTarget, attack) => {
  while (true) {
    const randIndex = getRandInt(0, potentialTarget.current.length - 1);
    const { row, col } = indexToCoordinate(potentialTarget.current[randIndex]);
    if (canAttack(attack, row, col)) {
      // Delete the potential target
      potentialTarget.current.splice(randIndex, 1);
      return {
        row: row,
        col: col,
      };
    } else {
      // Delete can't attack target
      potentialTarget.current.splice(randIndex, 1);
    }
  }
};

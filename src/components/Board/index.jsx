import {
  createEmptyBoard,
  indexToCoordinate,
  placeShipOnBoard,
  coordinateToIndex
} from '../../utils/boardTools.js'
import { computerPlacingShip } from '../../utils/computerTools.js'
import { FormattedMessage } from 'react-intl'
import { P1ATTACK, P2PLACING } from '../../utils/gameState.js'
import { FORBIDDEN } from '../../utils/blockStates.js'


const Board = (
  {
    gameState,
    setGameState,
    formData,
    player,
    name,
    placingShip,
    setPlacingShip,
    placedShips,
    setPlacedShips,
    availableShips,
    setAvailableShips,
    finalBoard,
    comBoard
  }
) => {

  // Is single player?
  const isSingleMode = formData.playMode === 'singlePlayer'
  const isP1 = gameState.includes('p1')

  let board

  if (isSingleMode && !isP1) {
    // Computer
    board = computerPlacingShip(availableShips)
    comBoard.current = board
    setGameState(P1ATTACK)
  } else {
    board = createEmptyBoard()

    // Render placed ships
    if (placedShips.length) {
      placedShips.forEach((ship) => {
        board = placeShipOnBoard(board, ship)
      })
    }

    board = placeShipOnBoard(board, placingShip, true)

    // Update game state
    if (!availableShips.length) {
      finalBoard.current = board
      player === 'p1' ? setGameState(P2PLACING) : setGameState(P1ATTACK)
    }
  }

  /**
   * When move update coordinate
   *
   * @param index the index
   * */
  const handleMove = (index) => {
    if (!placingShip) {
      return
    }
    const { row, col } = indexToCoordinate(index)
    setPlacingShip((prev) => {
      return {
        ...prev,
        position: {
          row: row,
          col: col
        }
      }
    })
  }

  // Place ship
  const handleClick = () => {
    if (placingShip) {
      const { position: { row, col } } = placingShip
      if (board[coordinateToIndex(row, col)] !== FORBIDDEN) {
        // Place ship
        setPlacedShips((prev) => [...prev, placingShip])
        // Remove available ships
        setAvailableShips((prev) =>
          prev.filter((ship) => ship.name !== placingShip.name)
        )
        //
        setPlacingShip(null)
      }
    }
  }

  /**
   * Right-click change ship direction
   *
   * @param e the mouse event
   * */
  const handleTurn = (e) => {
    // If right-click
    if (e.button === 2 && placingShip) {
      setPlacingShip((prev) => {
        return {
          ...prev,
          direction: prev.direction === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL'
        }
      })
    }
  }

  return (
    <div className='board-container'>
      <h2
        className={`board-title ${
          player === 'p1' ? 'board-title-p1' : 'board-title-p2'
        }`}
      >
        <FormattedMessage id='board.title' values={{ name: <b>{name}</b> }} />
      </h2>
      {!gameState.includes(player) ? (
        <h1 className='waiting-title'>
          <FormattedMessage
            id='board.waitMessage'
            values={{ isP1: <b>{isP1 ? '1' : '2'}</b> }}
            defaultMessage={`Wait for player ${isP1 ? 'one' : 'two'} to place`}
          />
        </h1>
      ) : (
        <div
          className={`board ${player === 'p1' ? 'board-p1' : 'board-p2'}`}
          onContextMenu={(e) => e.preventDefault()}
        >
          {board.map((state, index) => (
            <div
              key={index}
              className={`block ${state}`}
              data-index={index}
              onMouseMove={() => handleMove(index)}
              onMouseDown={handleTurn}
              onClick={handleClick}
            ></div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Board
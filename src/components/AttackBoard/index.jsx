import {
  createEmptyBoard,
  indexToCoordinate,
  coordinateToIndex,
  showSelectionBlock,
  canAttack,
  checkAttack,
  showAttack,
  checkSink
} from '../../utils/boardTools.js'
import {
  randomAttack,
  addPotentialTarget,
  attackPotentialTarget
} from '../../utils/computerTools.js'
import React, { useEffect, useRef } from 'react'
import { P1ATTACK, P1WIN, P2ATTACK, P2WIN, ALL_SHIP_LENGTH } from '../../utils/gameState.js'
import { FormattedMessage } from 'react-intl'
import { HIT, MISS, SANK } from '../../utils/blockStates.js'

const AttackBoard = ({
  player,
  name,
  formData,
  gameState,
  setGameState,
  attack,
  setAttack,
  finalBoard,
  comAttack,
  setComAttack,
  p1FinalBoard
}) => {
  // Use Ref record game state
  const state = useRef(gameState)
  const isMyRound = gameState.includes(player)
  const isSingleMode = formData.playMode === 'singlePlayer'
  // Record potential target
  const potentialTargets = useRef([])

  // Create empty game board
  let board = createEmptyBoard()

  // Rending select block
  board = showSelectionBlock(board, attack[0].position)

  // Rending attacked block
  board = showAttack(board, attack)

  // Computer attack
  useEffect(() => {
    if (isSingleMode && state.current === P2ATTACK) {
      let attackPosition

      if (!potentialTargets.current.length || formData.difficulty === 'easy') {
        // No potential target, random attack
        attackPosition = randomAttack(comAttack)
      } else {
        // Attack potential target
        attackPosition = attackPotentialTarget(potentialTargets, comAttack)
      }

      const isHit = checkAttack(p1FinalBoard.current, attackPosition)
      if (isHit) {
        // If hit, add potential position
        potentialTargets.current = addPotentialTarget(
          attackPosition,
          comAttack,
          potentialTargets
        )
      }

      const { row, col } = attackPosition
      setComAttack((prev) => [
        ...prev,
        {
          position: {
            row: row,
            col: col
          },
          state: isHit ? HIT : MISS,
          // If missing, ship = null
          ship: p1FinalBoard.current[coordinateToIndex(row, col)]
        }
      ])
      // Check sink
      setComAttack((prev) =>
        checkSink(prev, p1FinalBoard.current, row, col, potentialTargets)
      )
      // Switch attack
      setGameState(P1ATTACK)
      state.current = P1ATTACK
    }
  }, [gameState])

  // Who win?
  if (attack.filter((item) => item.state === SANK).length === ALL_SHIP_LENGTH) {
    setGameState(player === 'p1' ? P2WIN : P1WIN)
  }

  /**
   * Select coordinate to attack
   *
   * @param index the index
   * */
  const handleMove = (index) => {
    const { row, col } = indexToCoordinate(index)
    setAttack((prev) => {
      const copy = [...prev]
      copy[0].position = { row: row, col: col }
      return copy
    })
  }

  /**
   *  */
  const handleAttack = () => {
    const { row, col } = attack[0].position
    if (!canAttack(attack)) {
      return
    }
    // Can attack
    const isHit = checkAttack(finalBoard.current, attack[0].position)
    // Add attack data
    setAttack((prev) => [
      ...prev,
      {
        position: {
          row: row,
          col: col
        },
        state: isHit ? HIT : MISS,
        ship: finalBoard.current[coordinateToIndex(row, col)]
      }
    ])
    // Is sinking?
    setAttack((prev) => checkSink(prev, finalBoard.current, row, col))
    // Switch attack
    setGameState(
      gameState.includes('p1') ? P2ATTACK : P2ATTACK
    )
    state.current = gameState.includes('p1') ? P2ATTACK : P1ATTACK
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
      <div
        className={`board ${isMyRound ? 'disabled' : ''} ${player === 'p1' ? 'board-p1' : 'board-p2'}`}
        onContextMenu={(event) => event.preventDefault()}
      >
        {board.map((state, index) => (
          <div
            key={index}
            className={`block ${state}`}
            data-index={index}
            onMouseMove={isMyRound ? () => {
            } : () => handleMove(index)}
            onClick={isMyRound ? () => {
            } : handleAttack}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default AttackBoard
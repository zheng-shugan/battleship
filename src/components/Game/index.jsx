import React, { useState, useRef } from 'react'
import Header from '../Header/index.jsx'
import Board from '../Board/index.jsx'
import Harbour from '../Harbour/index.jsx'
import AttackBoard from '../AttackBoard/index.jsx'
import GameOver from '../GameOver/index.jsx'
import { BATTLESHIP, CARRIER, DESTROYER, PATROL, SUBMARINE } from '../../utils/ships.js'
import { SELECTING } from '../../utils/blockStates.js'
import './game.css'
import Tip from '../Tip/index.jsx'


const Game = ({ gameState, setGameState, formData }) => {
  // Player data
  const [p1AvailableShips, setP1AvailableShips] = useState([
    CARRIER,
    BATTLESHIP,
    SUBMARINE,
    PATROL
  ])
  const [p1PlacingShip, setP1PlacingShip] = useState(null)
  const [p1PlacedShip, setP1PlacedShip] = useState([])
  const [p2AvailableShips, setP2AvailableShips] = useState([
    CARRIER,
    BATTLESHIP,
    DESTROYER,
    SUBMARINE,
    PATROL
  ])
  const [p2PlacingShip, setP2PlacingShip] = useState(null)
  const [p2PlacedShips, setP2PlacedShips] = useState([])
  const [p1Attack, setP1Attack] = useState([
    { position: { row: null, col: null }, state: SELECTING }
  ])
  const [p2Attack, setP2Attack] = useState([
    { position: { row: null, col: null }, state: SELECTING }
  ])
  const p1FinalBoard = useRef(null)
  const p2FinalBoard = useRef(null)

  // Game state
  const isPlacing = gameState.includes('placing')
  const gameOver = gameState.includes('win')

  return (
    <div className='game'>
      <Header />
      {gameOver ? (
        <div className='game-wrapper'>
          <GameOver
            gameState={gameState}
            formData={formData}
            p1FinalBoard={p1FinalBoard}
            p2FinalBoard={p2FinalBoard}
            p1Attack={p1Attack}
            p2Attack={p2Attack}
          />
        </div>
      ) : (
        <div className='game-wrapper'>
          <main className='area game-area'>
            {isPlacing ? (
              <Board
                player='p1'
                formData={formData}
                gameState={gameState}
                setGameState={setGameState}
                name={formData.p1Name}
                setPlacingShip={setP1PlacingShip}
                placingShip={p1PlacingShip}
                placedShips={p1PlacedShip}
                setPlacedShips={setP1PlacedShip}
                availableShips={p1AvailableShips}
                setAvailableShips={setP1AvailableShips}
                finalBoard={p1FinalBoard}
                comBoard={p2FinalBoard}
              />
            ) : (
              <AttackBoard
                player='p1'
                name={formData.p1Name}
                formData={formData}
                gameState={gameState}
                setGameState={setGameState}
                attack={p2Attack}
                comAttack={p2Attack}
                setComAttack={setP2Attack}
                setAttack={setP2Attack}
                finalBoard={p1FinalBoard}
                p1FinalBoard={p1FinalBoard}
              />
            )}
            {isPlacing && (
              <Harbour
                gameState={gameState}
                p1PlacingShip={p1PlacingShip}
                p1AvailableShips={p1AvailableShips}
                setP1PlacingShip={setP1PlacingShip}
                p2PlacingShip={p2PlacingShip}
                p2AvailableShips={p2AvailableShips}
                setP2PlacingShip={setP2PlacingShip}
              />
            )}
            {isPlacing ? (
              <Board
                player='p2'
                formData={formData}
                gameState={gameState}
                setGameState={setGameState}
                name={formData.p2Name}
                setPlacingShip={setP2PlacingShip}
                placingShip={p2PlacingShip}
                placedShips={p2PlacedShips}
                setPlacedShips={setP2PlacedShips}
                availableShips={p2AvailableShips}
                setAvailableShips={setP2AvailableShips}
                finalBoard={p2FinalBoard}
                comBoard={p2FinalBoard}
              />
            ) : (
              <AttackBoard
                player='p2'
                name={formData.p2Name}
                formData={formData}
                gameState={gameState}
                setGameState={setGameState}
                attack={p1Attack}
                comAttack={p2Attack}
                setComAttack={setP2Attack}
                setAttack={setP1Attack}
                finalBoard={p2FinalBoard}
                p1FinalBoard={p1FinalBoard}
              />
            )}
          </main>
          <Tip gameState={gameState} />
        </div>
      )}
    </div>
  )
}

export default Game
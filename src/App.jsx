import { useState } from 'react'
import './App.css'
import Welcome from './components/Welcome/index.jsx'
import Game from './components/Game/index.jsx'
import { WELCOME } from './utils/gameState.js'

const App = () => {
  // Game state
  const [gameState, setGameState] = useState(WELCOME)

  // Form data
  const [formData, setFormData] = useState({
    p1Name: 'Lucky Player',
    p2Name: 'Wei Wei',
    // playMode: 'multiPlayer',
    playMode: 'singlePlayer',
    difficulty: 'normal'
  })

  return (
    <div className='App'>
      {gameState === WELCOME ? (
        <Welcome
          setGameState={setGameState}
          formData={formData}
          setFormData={setFormData}
          />
      ) : (
        <Game
          gameState={gameState}
          setGameState={setGameState}
          formData={formData}
          />
      )}
    </div>
  )
}

export default App

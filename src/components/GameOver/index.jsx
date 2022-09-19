import React from 'react'
import { FormattedMessage } from 'react-intl'
import DataCard from '../DataCard/index.jsx'
import MiniBoard from '../MiniBoard/index.jsx'
import './gameover.css'

const GameBoard = (
  {
    gameState,
    formData,
    p1FinalBoard,
    p2FinalBoard,
    p1Attack,
    p2Attack
  }
) => {
  const winner = gameState.includes('p1') ? formData.p1Name : formData.p2Name

  return (
    <div className='over area'>
      <h1 className='over-title'>
        <FormattedMessage id='over.title' />
      </h1>
      <h2 className='over-winner'>
        <FormattedMessage
          id='over.winner'
          values={{ winner: <b>{winner}</b> }}
        />
      </h2>
      <main className='over-show'>
        <div className='show-data'>
          <DataCard name={formData.p1Name} attack={p1Attack} />
          <MiniBoard
            finalBoard={p1FinalBoard}
            name={formData.p1Name}
            player='p1'
          />
        </div>

        <div className='show-board'>
          <DataCard name={formData.p2Name} attack={p2Attack} />
          <MiniBoard
            finalBoard={p2FinalBoard}
            name={formData.p2Name}
            player='p2'
          />
        </div>
      </main>
    </div>
  )
}

export default GameBoard
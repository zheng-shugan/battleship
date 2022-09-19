import React from 'react'

import Ship from '../Ship'

import { Context } from '../Wrapper/index.jsx'

const Harbour = ({
                   gameState,
                   p1PlacingShip,
                   p1AvailableShips,
                   setP1PlacingShip,
                   p2PlacingShip,
                   p2AvailableShips,
                   setP2PlacingShip
                 }) => {
  const context = React.useContext(Context)

  const isP1 = gameState.includes('p1')
  const placingShip = isP1 ? p1PlacingShip : p2PlacingShip
  const setPlacingShip = isP1 ? setP1PlacingShip : setP2PlacingShip
  const availableShips = isP1 ? p1AvailableShips : p2AvailableShips

  /**
   * Select ship
   *
   * @param ship the selected ship
   * */
  const handleSelect = (ship) => {
    setPlacingShip({
      ...ship,
      direction: 'HORIZONTAL',
      position: {
        row: null,
        col: null
      }
    })
  }

  return (
    <div className='harbour'>
      {availableShips.map((ship) => (
        <div
          key={ship.name}
          className={`ship-container ${
            placingShip?.name === ship.name ? 'ship-selected' : ''
          }`}
          onClick={() => handleSelect(ship)}
        >
          <h3 className='ship-name'>
            {context.locale === 'zh-CN' ? ship.zh : ship.name}
          </h3>
          <Ship length={ship.length} />
        </div>
      ))}
    </div>
  )
}

export default Harbour
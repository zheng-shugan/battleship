import { MISS, HIT } from '../../utils/blockStates.js'
import { FormattedMessage } from 'react-intl'
import { Paper } from '@mui/material'

/**
 * Show player data
 *
 * @param name the player name
 * @param attack the game bard
 * */
const DataCard = ({ name, attack }) => {
  const numberOfAttack = attack.length - 1
  const numberOfHit = attack.filter((item) => item.state !== MISS).length - 1
  const numberOfMiss = attack.filter((item) => item.state !== HIT).length
  const hitRate = ((numberOfHit / numberOfAttack) * 100).toFixed(0)

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 5 }}>
      <div className='data-card'>
        <h1 className='data-player'>{name}</h1>
        <p>
          <FormattedMessage id='over.numberOfAttack' />
          {numberOfAttack}
        </p>
        <p>
          <FormattedMessage id='over.numberOfMiss' />
          {numberOfMiss}
        </p>
        <p>
          <FormattedMessage id='over.numberOfHit' />
          {numberOfHit}
        </p>
        <p>
          <FormattedMessage id='over.hitRate' />
          {hitRate}%
        </p>
      </div>
    </Paper>
  )
}

export default DataCard
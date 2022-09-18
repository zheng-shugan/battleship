import { P1ATTACK, P2ATTACK, P1PLACING, P2PLACING } from '../../utils/gameState.js'
import { FormattedMessage } from 'react-intl'

const Tip = ({ gameState }) => {
  let message

  if (gameState === P1PLACING || gameState === P2PLACING) {
    message = <FormattedMessage id='tip.placing' />
  } else if (gameState === P1ATTACK) {
    message = <FormattedMessage id='tip.p1Attack' />
  } else if (gameState === P2ATTACK) {
    message = <FormattedMessage id='tip.p2Attack' />
  }

  return <p className='tip'>{message}</p>
}

export default Tip
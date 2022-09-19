import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Wrapper from './components/Wrapper/index.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Wrapper>
      <App />
    </Wrapper>
  </React.StrictMode>
)

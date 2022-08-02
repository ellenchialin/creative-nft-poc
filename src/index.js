import React from 'react'
import ReactDOM from 'react-dom'

import { ResetStyle, GlobalStyle } from './globalStyle'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <ResetStyle />
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

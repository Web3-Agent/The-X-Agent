import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Providers } from './providers.jsx'
import './index.css'
import '@coinbase/onchainkit/styles.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
)

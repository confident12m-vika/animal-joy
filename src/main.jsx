import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './i18n/index.js'
import { warmUpConnection } from './lib/supabaseClient.js'

// Fire this immediately, before React even renders, so the database
// connection is already "waking up" while the page is still loading the
// rest of the app. Cuts down the perceived delay from Supabase's free-tier
// cold start on the very first request after a period of inactivity.
warmUpConnection()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

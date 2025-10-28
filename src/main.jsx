import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Render app immediately for faster initial load
const root = createRoot(document.getElementById('root'))
root.render(<App />)

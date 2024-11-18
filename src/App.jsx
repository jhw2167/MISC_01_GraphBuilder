import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GraphBuilder from './GraphBuilder'

function App() {
  const [count, setCount] = useState(0)

  //<img src={viteLogo} className="logo" alt="Vite logo" />

  return (
   <GraphBuilder />
  )
}

export default App

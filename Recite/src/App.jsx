import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MenuAddForm from './Pages/MenuAddForm'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Card from './Pages/Card'
import TableList from './Pages/TableList'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster/>
   <Router>
      <Routes>
        <Route path="/table" element={<TableList />} />
        <Route path="/add" element={<MenuAddForm />} />
        <Route path="/" element={<Card />} />

      </Routes>
    </Router>
    </>
  )
}

export default App

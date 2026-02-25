// import { useState } from 'react'
import Landing from './components/Landing'
import Register from './components/Register'
import {BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

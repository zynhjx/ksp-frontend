// import { useState } from 'react'
import LandingPage from './components/LandingPage'
import Register from './components/Register'
import Login from './components/Login'
import {BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth/register' element={<Register />} />
        <Route path='/auth/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

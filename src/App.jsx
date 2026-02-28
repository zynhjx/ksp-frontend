// import { useState } from 'react'
import LandingPage from './components/LandingPage'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'
import {BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path='/auth/login' element={<PublicRoute><LoginPage /></PublicRoute>}/>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

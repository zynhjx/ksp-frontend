// import { useState } from 'react'
import LandingPage from './components/LandingPage'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'
import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import YouthDashboard from './components/YouthDashboard'
// import SkDashboard from './components/SkDashboard'
import AdminDashboard from './components/AdminDashboard'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import AccessDenied from './components/AccessDenied'
import AppLayout from './components/AppLayout'
import { SidebarProvider } from './contexts/SidebarProvider'
import AdminSkManagement from './components/AdminSkManagement'
import AdminBarangays from './components/AdminBarangays'
import AdminReports from './components/AdminReports'
import AdminSettings from './components/AdminSettings'
import BarangayManagement from './components/BarangayManagement'
import PageSkeleton from './components/PageSkeleton'
import SkDashboard from './components/SkDashboard'
import AdminYouthManagement from './components/AdminYouthManagement'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/skeleton' element={<PageSkeleton />} />
        <Route path='/forbidden' element={<AccessDenied />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path='/auth/login' element={<PublicRoute><LoginPage /></PublicRoute>}/>
        <Route path='/youth' element={<PrivateRoute allowedRoles={["Youth"]}>
            <SidebarProvider >
              <AppLayout role={"Youth"}/>
            </SidebarProvider>
          </PrivateRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<YouthDashboard />} />
        </Route>

        <Route path='/sk' element={<PrivateRoute allowedRoles={["SK"]}>
            <SidebarProvider >
              <AppLayout role={"SK"}/>
            </SidebarProvider>
          </PrivateRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SkDashboard />} />
        </Route>
        
        
        <Route path='/admin' element={<PrivateRoute allowedRoles={["Admin"]}>
            <SidebarProvider >
              <AppLayout role={"Admin"}/>
            </SidebarProvider>
          </PrivateRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="youth-management" element={<AdminYouthManagement />} />
              <Route path="sk-management" element={<AdminSkManagement />} />
              <Route path="barangays" element={<BarangayManagement />} />
              {/* <Route path="reports" element={<AdminReports />} /> */}
              <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

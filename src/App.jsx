// import { useState } from 'react'
import LandingPage from './components/auth/LandingPage'
import RegisterPage from './components/auth/RegisterPage'
import LoginPage from './components/auth/LoginPage'
import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import YouthDashboard from './components/youth/YouthDashboard'
// import SkDashboard from './components/sk/SkDashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import PrivateRoute from './components/common/PrivateRoute'
import PublicRoute from './components/common/PublicRoute'
import AccessDenied from './components/common/AccessDenied'
import AppLayout from './components/layout/AppLayout'
import { SidebarProvider } from './contexts/SidebarProvider'
import AdminSkManagement from './components/admin/AdminSkManagement'
import AdminBarangays from './components/admin/AdminBarangays'
import AdminReports from './components/admin/AdminReports'
import AdminSettings from './components/admin/AdminSettings'
import BarangayManagement from './components/admin/BarangayManagement'
import DashboardSkeleton from './components/common/DashboardSkeleton'
import SkDashboard from './components/sk/SkDashboard'
import SkPrograms from './components/sk/SkPrograms'
import SkYouthProfiles from './components/sk/SkYouthProfiles'
import SkSuggestions from './components/sk/SkSuggestions'
import SkArchived from './components/sk/SkArchived'
import AdminYouthManagement from './components/admin/AdminYouthManagement'
import YouthPrograms from './components/youth/YouthPrograms'
import YouthMyPrograms from './components/youth/YouthMyPrograms'
import YouthSuggestions from './components/youth/YouthSuggestions'
import YouthMyProfile from './components/youth/YouthMyProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/skeleton' element={<DashboardSkeleton />} />
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
              <Route path="programs" element={<YouthPrograms />} />
              {/* <Route path="my-programs" element={<YouthMyPrograms />} /> */}
              <Route path="suggestions" element={<YouthSuggestions />} />
              <Route path="my-profile" element={<YouthMyProfile />} />
        </Route>

        <Route path='/sk' element={<PrivateRoute allowedRoles={["SK"]}>
            <SidebarProvider >
              <AppLayout role={"SK"}/>
            </SidebarProvider>
          </PrivateRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SkDashboard />} />
              <Route path="youth-profiles" element={<SkYouthProfiles />} />
              <Route path="programs" element={<SkPrograms />} />
              <Route path="suggestions" element={<SkSuggestions />} />
              <Route path="archived" element={<SkArchived />} />
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

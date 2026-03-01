
import './AppLayout.css'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { SidebarContext } from '../contexts/SidebarContext'


function AppLayout() {
    const {sidebarOpen} = useContext(SidebarContext)
    const location = useLocation();
    return (
        
        <div className="app-layout">
            
            <Sidebar activePath={location.pathname} />
            <main className={`main-content ${sidebarOpen ? "sidebar-open" : "" }`}>
                <Outlet />
            </main>
            
        </div>
        
    )
}

export default AppLayout
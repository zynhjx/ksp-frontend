
import './AppLayout.css'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { SidebarContext } from '../contexts/SidebarContext'


function AppLayout() {
    const {sidebarOpen, toggleSidebar, setSidebarOpen} = useContext(SidebarContext)
    const location = useLocation();

    const handleBackdropClick = () => {
        setSidebarOpen(false);
    };

    return (
        
        <div className="app-layout">
            
            <Sidebar activePath={location.pathname} />
            
            {/* Mobile Backdrop Overlay */}
            {sidebarOpen && (
                <div 
                    className="sidebar-backdrop"
                    onClick={handleBackdropClick}
                    role="presentation"
                    aria-hidden="true"
                />
            )}

            <main className={`main-content ${sidebarOpen ? "sidebar-open" : "" }`}>
                <Outlet />       
            </main>

            {/* Mobile Menu Toggle Button */}
            <button 
                className="mobile-menu-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar navigation"
                title="Toggle Menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect y="4" width="24" height="2" rx="1" fill="currentColor"/>
                    <rect y="11" width="24" height="2" rx="1" fill="currentColor"/>
                    <rect y="18" width="24" height="2" rx="1" fill="currentColor"/>
                </svg>
            </button>

            
        </div>
        
    )
}

export default AppLayout
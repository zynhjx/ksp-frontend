import './CommonDashboard.css'
import './AdminDashboard.css'
import Header from './Header'
import Sidebar from './Sidebar'
import { SidebarProvider } from '../contexts/SidebarProvider'

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <SidebarProvider>
                <Header />
                <Sidebar />
            </SidebarProvider>
            <main className="main-content"></main>
        </div>
    )
}

export default AdminDashboard
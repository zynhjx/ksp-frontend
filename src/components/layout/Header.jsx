import './Header.css'
import { Link } from 'react-router-dom'
import Logo from "../../assets/pngs/kspLogoWithName.png"
import { useContext } from 'react'
import { SidebarContext } from '../../contexts/SidebarContext'

function Header() {
    const { toggleSidebar } = useContext(SidebarContext)
    return (
        <header className="header">
            <div className="left">
                <button 
                    className="menu-container" 
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar navigation"
                    title="Toggle Menu"
                >
                    <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect y="4" width="24" height="2" rx="1" fill="currentColor"/>
                    <rect y="11" width="24" height="2" rx="1" fill="currentColor"/>
                    <rect y="18" width="24" height="2" rx="1" fill="currentColor"/>
                    </svg>
                </button>
               
                <Link className='logo' to="/" title="Go to home">
                    <img src={Logo} alt="KSP Logo"/>
                </Link>
            </div>
        </header>
    )
}

export default Header
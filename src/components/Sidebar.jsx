import { useContext, useEffect, useState, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import './Sidebar.css'
import Logo from "../assets/pngs/kspLogoWithName.png"
import LogoName from "../assets/pngs/ksp-name.png"
import { SidebarContext } from '../contexts/SidebarContext';
import { AuthContext } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DashboardIcon from '../assets/icons/DashboardIcon';
import SkManagementIcon from '../assets/icons/SkManagementIcon'
import BarangaysIcon from '../assets/icons/BarangayIcon';
import ReportsIcon from '../assets/icons/ReportsIcon';
import ProgramsIcon from '../assets/icons/ProgramsIcon'
import MyProfileIcon from '../assets/icons/MyProfileIcon';
import AnnouncementsIcon from '../assets/icons/AnnouncementsIcon';


function Sidebar({ activePath }) {
    const MySwal = withReactContent(Swal);
    const { user, logout } = useContext(AuthContext)
    const { sidebarOpen, setSidebarOpen, toggleSidebar } = useContext(SidebarContext);
    const location = useLocation();
    // treat both mobile and tablet widths as small screens
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const prevPathname = useRef(location.pathname);

    // Detect mobile screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar after navigating on mobile (only on actual route changes)
    useEffect(() => {
        if (prevPathname.current !== location.pathname) {
            prevPathname.current = location.pathname;
            if (isMobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        }
    }, [location.pathname, isMobile, sidebarOpen, setSidebarOpen]);

    const handleLogout = () =>  {
      MySwal.fire({
        title: 'Are you sure?',
        text: "You will be logged out from your account.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          logout()
          setSidebarOpen(false);
        }
      });
    }

    const getAdminNavs = () => {
      return (
        [
          {title: "Dashboard", path: "/admin/dashboard", svg: <DashboardIcon />},
          {title: "SK Management", path: "/admin/sk-management", svg: <SkManagementIcon />},
          {title: "Barangays", path: "/admin/barangays", svg: <BarangaysIcon />},
          {title: "Reports", path: "/admin/reports", svg: <ReportsIcon />}
        ]
      )
    }

    const getSkNavs = () => {
      return (
        [
          {title: "Dashboard", path: "/sk/dashboard", svg: <DashboardIcon />},
          {title: "Youth Profiles", path: "/sk/sk-management", svg: "YouthProfilesIcon"},
          {title: "Programs", path: "/sk/barangays", svg: "ProgramsIcon"},
          {title: "Reports", path: "/sk/reports", svg: <ReportsIcon />},
          {title: "Announcements", path: "/sk/announcements", svg: "AnnouncementsIcon"}
        ]
      )
    }

    const getYouthNavs = () => {
      return (
        [
          {title: "Dashboard", path: "/youth/dashboard", svg: <DashboardIcon />},
          {title: "My Profile", path: "/youth/my-profile", svg: <MyProfileIcon />},
          {title: "Programs", path: "/youth/programs", svg: <ProgramsIcon />},
          {title: "Announcements", path: "/youth/announcements", svg: <AnnouncementsIcon />}
        ]
      )
    }

    const userNavs = (() => {
      switch (user?.role) {
        case "Youth":
          return getYouthNavs()
        case "Sk":
          return getSkNavs()
        case "Admin":
          return getAdminNavs()
        default:
          return []
      }
    })();

    return (
        <aside className={sidebarOpen ? "sidebar extended" : "sidebar shrinked"}>
            <div className="menu-container">
              <div className="menu-bar" onClick={toggleSidebar}>
                    <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="4" width="24" height="2" rx="1" fill="#fff"/>
                    <rect y="11" width="24" height="2" rx="1" fill="#fff"/>
                    <rect y="18" width="24" height="2" rx="1" fill="#fff"/>
                    </svg>
                </div>
               
                <Link className='logo'>
                    <img src={LogoName} alt="ksp logo"/>
                </Link>
            </div>
            <nav className='main-nav'>
                {userNavs.map((nav) => {
                  return (
                  <Link key={nav.path} to={nav.path} className={`nav-wrapper ${activePath === nav.path ? "active" : ""}`}>
                    <div className="sidebar-item">
                      {nav.svg}
                    </div>
                    <h3>{nav.title}</h3>
                  </Link>
                  )
                })}
            </nav>

            <nav className="lower-nav">
                <Link to="/admin/settings" className={`nav-wrapper ${activePath === "/admin/settings" ? "active" : ""}`}>
                  <div className='sidebar-item'>
                      <svg viewBox="0 0 24 24" width="55" height="55" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0175 19C10.6601 19 10.3552 18.7347 10.297 18.373C10.2434 18.0804 10.038 17.8413 9.76171 17.75C9.53658 17.6707 9.31645 17.5772 9.10261 17.47C8.84815 17.3365 8.54289 17.3565 8.30701 17.522C8.02156 17.7325 7.62943 17.6999 7.38076 17.445L6.41356 16.453C6.15326 16.186 6.11944 15.7651 6.33361 15.458C6.49878 15.2105 6.52257 14.8914 6.39601 14.621C6.31262 14.4332 6.23906 14.2409 6.17566 14.045C6.08485 13.7363 5.8342 13.5051 5.52533 13.445C5.15287 13.384 4.8779 13.0559 4.87501 12.669V11.428C4.87303 10.9821 5.18705 10.6007 5.61601 10.528C5.94143 10.4645 6.21316 10.2359 6.33751 9.921C6.37456 9.83233 6.41356 9.74433 6.45451 9.657C6.61989 9.33044 6.59705 8.93711 6.39503 8.633C6.1424 8.27288 6.18119 7.77809 6.48668 7.464L7.19746 6.735C7.54802 6.37532 8.1009 6.32877 8.50396 6.625L8.52638 6.641C8.82735 6.84876 9.21033 6.88639 9.54428 6.741C9.90155 6.60911 10.1649 6.29424 10.2375 5.912L10.2473 5.878C10.3275 5.37197 10.7536 5.00021 11.2535 5H12.1115C12.6248 4.99976 13.0629 5.38057 13.1469 5.9L13.1625 5.97C13.2314 6.33617 13.4811 6.63922 13.8216 6.77C14.1498 6.91447 14.5272 6.87674 14.822 6.67L14.8707 6.634C15.2842 6.32834 15.8528 6.37535 16.2133 6.745L16.8675 7.417C17.1954 7.75516 17.2366 8.28693 16.965 8.674C16.7522 8.99752 16.7251 9.41325 16.8938 9.763L16.9358 9.863C17.0724 10.2045 17.3681 10.452 17.7216 10.521C18.1837 10.5983 18.5235 11.0069 18.525 11.487V12.6C18.5249 13.0234 18.2263 13.3846 17.8191 13.454C17.4842 13.5199 17.2114 13.7686 17.1083 14.102C17.0628 14.2353 17.0121 14.3687 16.9562 14.502C16.8261 14.795 16.855 15.1364 17.0323 15.402C17.2662 15.7358 17.2299 16.1943 16.9465 16.485L16.0388 17.417C15.7792 17.6832 15.3698 17.7175 15.0716 17.498C14.8226 17.3235 14.5001 17.3043 14.2331 17.448C14.0428 17.5447 13.8475 17.6305 13.6481 17.705C13.3692 17.8037 13.1636 18.0485 13.1099 18.346C13.053 18.7203 12.7401 18.9972 12.3708 19H11.0175Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9747 12C13.9747 13.2885 12.9563 14.333 11.7 14.333C10.4437 14.333 9.42533 13.2885 9.42533 12C9.42533 10.7115 10.4437 9.66699 11.7 9.66699C12.9563 9.66699 13.9747 10.7115 13.9747 12Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      </g>
                    </svg>
                  </div>
                  <h3>Settings</h3>
                </Link>
                <div className="logout-btn" onClick={handleLogout}>
                  <div className="icon-container">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.9999 2C10.2385 2 7.99991 4.23858 7.99991 7C7.99991 7.55228 8.44762 8 8.99991 8C9.55219 8 9.99991 7.55228 9.99991 7C9.99991 5.34315 11.3431 4 12.9999 4H16.9999C18.6568 4 19.9999 5.34315 19.9999 7V17C19.9999 18.6569 18.6568 20 16.9999 20H12.9999C11.3431 20 9.99991 18.6569 9.99991 17C9.99991 16.4477 9.55219 16 8.99991 16C8.44762 16 7.99991 16.4477 7.99991 17C7.99991 19.7614 10.2385 22 12.9999 22H16.9999C19.7613 22 21.9999 19.7614 21.9999 17V7C21.9999 4.23858 19.7613 2 16.9999 2H12.9999Z" fill="white"></path>
                        <path d="M13.9999 11C14.5522 11 14.9999 11.4477 14.9999 12C14.9999 12.5523 14.5522 13 13.9999 13V11Z" fill="white"></path>
                        <path d="M5.71783 11C5.80685 10.8902 5.89214 10.7837 5.97282 10.682C6.21831 10.3723 6.42615 10.1004 6.57291 9.90549C6.64636 9.80795 6.70468 9.72946 6.74495 9.67492L6.79152 9.61162L6.804 9.59454L6.80842 9.58848C6.80846 9.58842 6.80892 9.58778 5.99991 9L6.80842 9.58848C7.13304 9.14167 7.0345 8.51561 6.58769 8.19098C6.14091 7.86637 5.51558 7.9654 5.19094 8.41215L5.18812 8.41602L5.17788 8.43002L5.13612 8.48679C5.09918 8.53682 5.04456 8.61033 4.97516 8.7025C4.83623 8.88702 4.63874 9.14542 4.40567 9.43937C3.93443 10.0337 3.33759 10.7481 2.7928 11.2929L2.08569 12L2.7928 12.7071C3.33759 13.2519 3.93443 13.9663 4.40567 14.5606C4.63874 14.8546 4.83623 15.113 4.97516 15.2975C5.04456 15.3897 5.09918 15.4632 5.13612 15.5132L5.17788 15.57L5.18812 15.584L5.19045 15.5872C5.51509 16.0339 6.14091 16.1336 6.58769 15.809C7.0345 15.4844 7.13355 14.859 6.80892 14.4122L5.99991 15C6.80892 14.4122 6.80897 14.4123 6.80892 14.4122L6.804 14.4055L6.79152 14.3884L6.74495 14.3251C6.70468 14.2705 6.64636 14.1921 6.57291 14.0945C6.42615 13.8996 6.21831 13.6277 5.97282 13.318C5.89214 13.2163 5.80685 13.1098 5.71783 13H13.9999V11H5.71783Z" fill="white"></path>
                    </svg>
                  </div>
                    
                    <h3>Logout</h3>
                </div>
            </nav>

            
        </aside>  
    )
}

export default Sidebar
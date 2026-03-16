import { useContext, useEffect, useState, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import './Sidebar.css'
import LogoName from "../../assets/logo/white-theme-logo.svg"
import { SidebarContext } from '../../contexts/SidebarContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Lightbulb } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DashboardIcon from '../../assets/icons/DashboardIcon';
import SkManagementIcon from '../../assets/icons/SkManagementIcon'
import BarangaysIcon from '../../assets/icons/BarangayIcon';
import ReportsIcon from '../../assets/icons/ReportsIcon';
import ProgramsIcon from '../../assets/icons/ProgramsIcon'
import CalendarIcon from '../../assets/icons/CalendarIcon';


function Sidebar({ activePath }) {
    const MySwal = withReactContent(Swal);
    const { user, logout } = useContext(AuthContext)
    const { sidebarOpen, setSidebarOpen, toggleSidebar } = useContext(SidebarContext);
    const location = useLocation();
    // treat both mobile and tablet widths as small screens
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const prevPathname = useRef(location.pathname);
    const profileTriggerRef = useRef(null);
    const profilePopoverRef = useRef(null);
    const hoverOpenTimeoutRef = useRef(null);
    const hoverCloseTimeoutRef = useRef(null);
    const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
    const [profilePopoverMode, setProfilePopoverMode] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

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

    useEffect(() => {
      if (!isProfilePopoverOpen) return;

      const handleClickOutside = (event) => {
        if (
          profilePopoverRef.current &&
          !profilePopoverRef.current.contains(event.target) &&
          profileTriggerRef.current &&
          !profileTriggerRef.current.contains(event.target)
        ) {
          if (hoverOpenTimeoutRef.current) {
            clearTimeout(hoverOpenTimeoutRef.current);
            hoverOpenTimeoutRef.current = null;
          }

          if (hoverCloseTimeoutRef.current) {
            clearTimeout(hoverCloseTimeoutRef.current);
            hoverCloseTimeoutRef.current = null;
          }

          setIsProfilePopoverOpen(false);
          setProfilePopoverMode(null);
        }
      };

      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          if (hoverOpenTimeoutRef.current) {
            clearTimeout(hoverOpenTimeoutRef.current);
            hoverOpenTimeoutRef.current = null;
          }

          if (hoverCloseTimeoutRef.current) {
            clearTimeout(hoverCloseTimeoutRef.current);
            hoverCloseTimeoutRef.current = null;
          }

          setIsProfilePopoverOpen(false);
          setProfilePopoverMode(null);
        }
      };

      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscape);

      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('keydown', handleEscape);
      };
    }, [isProfilePopoverOpen]);

    useEffect(() => {
      return () => {
        if (hoverOpenTimeoutRef.current) {
          clearTimeout(hoverOpenTimeoutRef.current);
          hoverOpenTimeoutRef.current = null;
        }

        if (hoverCloseTimeoutRef.current) {
          clearTimeout(hoverCloseTimeoutRef.current);
          hoverCloseTimeoutRef.current = null;
        }
      };
    }, []);

    const getDisplayName = () => {
      const firstName = user?.first_name || user?.firstName || '';
      const lastName = user?.last_name || user?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || user?.name || user?.username || 'User';
    };

    const getDisplayRole = () => {
      const normalizedRole = (user?.role || '').toLowerCase();

      switch (normalizedRole) {
        case 'sk':
          return 'SK Official';
        case 'youth':
          return 'Youth';
        case 'admin':
          return 'Admin';
        default:
          return user?.role || 'User';
      }
    };

    const getDisplayBarangay = () => {
      return user?.barangay_name || 'N/A';
    };

    const getProfileImageUrl = () => {
      return user?.profile_picture || user?.profilePicture || user?.avatar || user?.avatar_url || user?.image || '';
    };

    const getInitials = (name) => {
      const words = name.split(' ').filter(Boolean);
      if (words.length === 0) return 'U';
      if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
      return `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`.toUpperCase();
    };

    const displayName = getDisplayName();
    const displayRole = getDisplayRole();
    const displayBarangay = getDisplayBarangay();
    const profileImageUrl = getProfileImageUrl();

    const getProfileNameSizeClass = (name) => {
      const characterCount = name.trim().length;

      if (characterCount > 34) return 'profile-text-xlong';
      if (characterCount > 26) return 'profile-text-long';
      if (characterCount > 18) return 'profile-text-medium';
      return 'profile-text-short';
    };

    const profileNameSizeClass = getProfileNameSizeClass(displayName);

    const handleLogout = async () =>  {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: "You will be logged out from your account.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) return;

      const didLogout = await logout();
      if (didLogout) {
        setSidebarOpen(false);
      }
    }

    const getAdminNavs = () => {
      return (
        [
          {title: "Dashboard", path: "/admin/dashboard", svg: <DashboardIcon />},
          {title: "Youth Management", path: "/admin/youth-management", svg: <ReportsIcon />},
          {title: "SK Management", path: "/admin/sk-management", svg: <SkManagementIcon />},
          {title: "Barangays", path: "/admin/barangays", svg: <BarangaysIcon />},
        ]
      )
    }

    const getSkNavs = () => {
      return (
        [
          {title: "Dashboard", path: "/sk/dashboard", svg: <DashboardIcon />},
          {title: "Youth Profiles", path: "/sk/youth-profiles", svg: <SkManagementIcon />},
          {title: "Programs", path: "/sk/programs", svg: <CalendarIcon />},
          {title: "Suggestions", path: "/sk/suggestions", svg: <Lightbulb size={28} color="white" />},
          {title: "Archived", path: "/sk/archived", svg: <ReportsIcon />}
        ]
      )
    }

    const getYouthNavs = () => {
      return (
        [
          {title: "Dashboard", path: "/youth/dashboard", svg: <DashboardIcon />},
          {title: "Programs", path: "/youth/programs", svg: <ProgramsIcon />},
          // {title: "My Programs", path: "/youth/my-programs", svg: <MyProgramsIcon />},
          {title: "My Suggestions", path: "/youth/suggestions", svg: <Lightbulb size={28} color="white" />}
        ]
      )
    }

    const userNavs = (() => {
      switch (user?.role) {
        case "Youth":
          return getYouthNavs()
        case "SK":
          return getSkNavs()
        case "Admin":
          return getAdminNavs()
        default:
          return []
      }
    })();

    const myProfilePath = user?.role === "Youth" ? "/youth/my-profile" : "/sk/my-profile";
    const editProfilePath = user?.role === "Admin" ? "/admin/settings" : myProfilePath;

    const clearHoverTimers = () => {
      if (hoverOpenTimeoutRef.current) {
        clearTimeout(hoverOpenTimeoutRef.current);
        hoverOpenTimeoutRef.current = null;
      }

      if (hoverCloseTimeoutRef.current) {
        clearTimeout(hoverCloseTimeoutRef.current);
        hoverCloseTimeoutRef.current = null;
      }
    };

    const closeProfilePopover = () => {
      clearHoverTimers();
      setIsProfilePopoverOpen(false);
      setProfilePopoverMode(null);
    };

    const openProfilePopover = (mode = 'click') => {
      if (!profileTriggerRef.current) return;

      const rect = profileTriggerRef.current.getBoundingClientRect();
      const panelWidth = 300;
      const viewportPadding = 10;

      const computedLeft = Math.min(
        rect.right + 12,
        window.innerWidth - panelWidth - viewportPadding
      );

      const computedTop = Math.max(
        viewportPadding,
        Math.min(rect.top, window.innerHeight - 220)
      );

      setPopoverPosition({ top: computedTop, left: computedLeft });
      setIsProfilePopoverOpen(true);
      setProfilePopoverMode(mode);
    };

    const handleProfileTriggerClick = () => {
      clearHoverTimers();

      if (isProfilePopoverOpen && profilePopoverMode === 'click') {
        closeProfilePopover();
        return;
      }

      openProfilePopover('click');
    };

    const handleProfileTriggerKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleProfileTriggerClick();
      }
    };

    const handleProfileTriggerMouseEnter = () => {
      if (profilePopoverMode === 'click') return;

      if (hoverCloseTimeoutRef.current) {
        clearTimeout(hoverCloseTimeoutRef.current);
        hoverCloseTimeoutRef.current = null;
      }

      if (isProfilePopoverOpen) return;

      hoverOpenTimeoutRef.current = setTimeout(() => {
        openProfilePopover('hover');
        hoverOpenTimeoutRef.current = null;
      }, 300);
    };

    const scheduleHoverClose = () => {
      if (profilePopoverMode !== 'hover') return;

      if (hoverCloseTimeoutRef.current) {
        clearTimeout(hoverCloseTimeoutRef.current);
      }

      hoverCloseTimeoutRef.current = setTimeout(() => {
        closeProfilePopover();
      }, 120);
    };

    const handleProfileTriggerMouseLeave = (event) => {
      if (hoverOpenTimeoutRef.current) {
        clearTimeout(hoverOpenTimeoutRef.current);
        hoverOpenTimeoutRef.current = null;
      }

      const nextElement = event.relatedTarget;
      if (profilePopoverRef.current && nextElement && profilePopoverRef.current.contains(nextElement)) {
        return;
      }

      scheduleHoverClose();
    };

    const handleProfilePopoverMouseEnter = () => {
      if (hoverCloseTimeoutRef.current) {
        clearTimeout(hoverCloseTimeoutRef.current);
        hoverCloseTimeoutRef.current = null;
      }
    };

    const handleProfilePopoverMouseLeave = (event) => {
      const nextElement = event.relatedTarget;

      if (profileTriggerRef.current && nextElement && profileTriggerRef.current.contains(nextElement)) {
        return;
      }

      scheduleHoverClose();
    };

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
                  <Link
                    key={nav.path}
                    to={nav.path}
                    className={`nav-wrapper ${activePath === nav.path ? "active" : ""}`}
                    data-label={nav.title}
                    aria-label={nav.title}
                  >
                    <div className="sidebar-item">
                      {nav.svg}
                    </div>
                    <h3>{nav.title}</h3>
                  </Link>
                  )
                })}
            </nav>
            <nav className="lower-nav">
                <button
                  type="button"
                  ref={profileTriggerRef}
                  className="profile-trigger"
                  data-label="Account"
                  aria-label="Open account menu"
                  aria-haspopup="menu"
                  aria-expanded={isProfilePopoverOpen}
                  onClick={handleProfileTriggerClick}
                  onKeyDown={handleProfileTriggerKeyDown}
                  onMouseEnter={handleProfileTriggerMouseEnter}
                  onMouseLeave={handleProfileTriggerMouseLeave}
                >
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt={displayName} className="profile-avatar" />
                  ) : (
                    <span className="profile-avatar profile-avatar-fallback">{getInitials(displayName)}</span>
                  )}
                  <span className={`profile-text ${profileNameSizeClass}`}>{displayName}</span>
                </button>
            </nav>

            {isProfilePopoverOpen && (
              <div
                ref={profilePopoverRef}
                className="profile-popover"
                style={{ top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px` }}
                role="menu"
                aria-label="Account menu"
                onMouseEnter={handleProfilePopoverMouseEnter}
                onMouseLeave={handleProfilePopoverMouseLeave}
              >
                <div className="profile-popover-header">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt={displayName} className="profile-popover-avatar" />
                  ) : (
                    <span className="profile-popover-avatar profile-avatar-fallback">{getInitials(displayName)}</span>
                  )}
                  <div className="profile-popover-meta">
                    <h4>{displayName}</h4>
                    <p>{displayRole}</p>
                    <span>Barangay {displayBarangay}</span>
                  </div>
                </div>

                <div className="profile-popover-actions">
                  <Link to={editProfilePath} className="profile-popover-link" onClick={closeProfilePopover}>
                    Edit Current Profile
                  </Link>

                  <button
                    type="button"
                    className="profile-popover-logout"
                    onClick={() => {
                      closeProfilePopover();
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            
        </aside>  
    )
}

export default Sidebar
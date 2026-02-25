import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
	return (
		<div className="landing-page">
			<header className="landing-header">
                <div className="header-container">
                    <div className="logo">KSP - Kulang sa Pera</div>
                    <nav className="landing-nav">
                        <Link to="/auth/login">
                            <button className="heading-nav-btn primary-btn">Sign In</button>
                        </Link>
                        <Link to="/auth/register">
                            <button className="heading-nav-btn secondary-btn">Get Started</button>
                        </Link>
                    </nav>
                </div>
				
			</header>
			<section className="hero-section">
                <div className="hero-container">
                    <div className="hero-target">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z" stroke="#0057a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="11" r="2.5" stroke="#0057a3" strokeWidth="2"/>
                        </svg>
                        <p>West Coast Barangays</p>
                    </div>
                    <h1 className="hero-title">Kabataan Statistical Profile</h1>
                    <p className="hero-desc">A comprehensive Youth Profiling System
                            and PYDP Implementation Platform for
                            Sangguniang Kabataan officials.
                    </p>
                    <div className="hero-btns">
                        <Link to="/auth/register" className="btns">
                            <button className="primary-btn">
                                Register Now
                                <svg style={{ marginLeft: '8px', verticalAlign: 'middle' }} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </Link>
                        <Link to="/auth/login" className="btns">
                            <button className="secondary-btn">Sign In to Dashboard</button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="section-container feature-container">
                    <h2>System Features</h2>
                    <div className="feature-grid">
                        <div className="grid-card">
                            <div className="grid-flex-card">
                                <div className="feature-icon">
                                    {/* Youth Profiling Icon (Outlined, Curved) */}
                                    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="16" cy="12" r="6" stroke="#0058A3" strokeWidth="2" fill="none"/>
                                        <path d="M6 28c0-4 5-6 10-6s10 2 10 6" stroke="#0058A3" strokeWidth="2" fill="none"/>
                                    </svg>
                                </div>
                                <div className="card-info">
                                    <h3>Youth Profiling</h3>
                                    <p>Comprehensive registration and management of youth profiles with detailed demographic data.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid-card">
                            <div className="grid-flex-card">
                                <div className="feature-icon">
                                    {/* Statistical Analysis Icon (Column Chart) */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0058A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
                                        <path d="M18 17V9"/>
                                        <path d="M13 17V5"/>
                                        <path d="M8 17v-3"/>
                                    </svg>
                                </div>
                                <div className="card-info">
                                    <h3>Statistical Analysis</h3>
                                    <p>Visual dashboards and reports for data-driven decision making and planning.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid-card">
                            <div className="grid-flex-card">
                                <div className="feature-icon">
                                    {/* PYDP Tracking Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0058A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                                        <path d="M8 10v4"/>
                                        <path d="M12 10v2"/>
                                        <path d="M16 10v6"/>
                                    </svg>
                                </div>
                                <div className="card-info">
                                    <h3>PYDP Tracking</h3>
                                    <p>Monitor youth development programs, activities, and participant engagement.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid-card">
                            <div className="grid-flex-card">
                                <div className="feature-icon">
                                    {/* Secure Access Icon */}
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#0058A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="10" rx="2" fill="#0058A3" fillOpacity="0.15"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        <circle cx="12" cy="16" r="2" fill="#fff"/>
                                    </svg>
                                </div>
                                <div className="card-info">
                                    <h3>Secure Access</h3>
                                    <p>Role-based authentication for SK officials with data protection.</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>
            
            <section className="barangay-section">
                <div className="section-container barangay-container">
                    <h2>
                        Participating Barangays
                    </h2>
                    <p>Serving the youth of West Coast municipality</p>
                    <div className="barangay-lists">
                        <div className="barangay">Barangay Simpokan</div>
                        <div className="barangay">Barangay Napsan</div>
                        <div className="barangay">Barangay Bagong Bayan</div>
                    </div>
                </div>
            </section>
            <section className="redirect-reg">
                <div className="redirect-reg-container section-container">
                    <h2>
                        Ready to Get Started?
                    </h2>
                    <p>Join the platform and start managing youth profiles for your barangay.</p>
                    <button>Create Your Account</button>
                </div>
            </section>
            <footer>
                <p id="footer-name">Kabataan Statistical Profile (KSP)</p>
                <p>Sangguniang Kabataan of West Coast Barangays</p>
            </footer>
		</div>
	);
};

export default Landing;

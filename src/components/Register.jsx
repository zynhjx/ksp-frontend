import "./auth.css"
import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const EyeClosed = (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
    const EyeOpen = (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
    
    return (
        <div className="form-page">
            <div className="form-container">
                <img className="image" src="../src/assets/pngs/cydo-logo.png" alt=""/>
                <h2>Create your account</h2>
                <p>Please fill in your details to create an account.</p>
                <form>
    
                    <div className="info-row">
                        <div className="info-col">
                            <label htmlFor="firstname">First Name</label>
                            <input type="text" id="firstname" name="firstname" required placeholder="Juan" />
                        </div>
                        <div className="info-col">
                            <label htmlFor="lastname">Last Name</label>
                            <input type="text" id="lastname" name="lastname" required placeholder="Dela Cruz" />
                        </div>
                    </div>

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="example@example.com" />

                    <label htmlFor="address">Barangay</label>
                    <div className="select-wrapper">
                        <select id="barangay" name="barangay" required style={{ paddingRight: '44px' }}>
                            <option value="" disabled selected hidden>Select Barangay</option>
                            <option value="barangay-simpokan">Barangay Simpokan</option>
                            <option value="barangay-napsan">Barangay Napsan</option>
                            <option value="barangay-bagong-bayan">Barangay Bagong Bayan</option>
                        </select>
                        <div className="select-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M7 10L12 15L17 10" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </g>
                            </svg>
                        </div>
                    </div>


                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="password"
                            id="password"
                            name="password"
                            required
                            placeholder="••••••••••"
                        />
                        <span
                            className="toggle-password"
                            tabIndex="0"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ cursor: "pointer",
                                opacity: showPassword ? 1 : 0.6
                             }}
                        >
                            {showPassword ? EyeOpen : EyeClosed}
                        </span>
                    </div>

                    <label htmlFor="conf-password">Confirm Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showConfPassword ? "text" : "password"}
                            className="password"
                            id="conf-password"
                            name="conf-password"
                            required
                            placeholder="••••••••••"
                        />
                        <span
                            className="toggle-password"
                            tabIndex="0"
                            onClick={() => setShowConfPassword((prev) => !prev)}
                            style={{ cursor: "pointer",
                                opacity: showConfPassword ? 1 : 0.6
                             }}
                        >
                            {showConfPassword ? EyeOpen : EyeClosed}
                        </span>
                    </div>

                    <button type="submit">Submit</button>
                </form>
                <div className="redirect-container">
                    <span>Already have an account? </span>
                    <Link to="/auth/login" className="link">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register;

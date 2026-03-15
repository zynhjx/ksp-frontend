import "./auth.css"
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/pngs/ksp-logo.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../contexts/AuthContext"; 


function RegisterPage() {
    const navigate = useNavigate();
    const { fetchUser } = useContext(AuthContext);
    const apiUrl = import.meta.env.VITE_API_URL;
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

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });
    const [confPassword, setConfPassword] = useState("");
    const [formError, setFormError] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "conf-password") {
            setConfPassword(e.target.value);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setFormError("");
        if (formData.password.length < 8) {
            setFormError("Password must be at least 8 characters long.");
            return;
        }
        if (formData.password !== confPassword) {
            setFormError("Passwords do not match.");
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 🔥 important for cookies!
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.status === 201) {
                toast.success(data.message, data.user || "Account successfully registered!");
                setFormData({ first_name: "", last_name: "", email: "", password: "" });
                setConfPassword("");
                await fetchUser()
                navigate("/youth/dashboard");
            } else if (!response.ok) {
                toast.error(data.error || data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error. Please try again.");
        }
    };
    
    return (
        <div className="form-page">
            <div className="form-container">
                <Link className="logo-container" to="/">
                    <img className="head-logo" src={Logo} alt=""/>
                </Link>
                
                <h2>Create your account</h2>
                <p>Please fill in your details to create an account.</p>
                <form onSubmit={handleSubmit}>
    
                    <div className="info-row">
                        <div className="info-col">
                            <label htmlFor="firstname">First Name</label>
                            <input
                                type="text"
                                id="firstname"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                placeholder="Juan" />
                        </div>
                        <div className="info-col">
                            <label htmlFor="lastname">Last Name</label>
                            <input 
                                type="text" 
                                id="lastname" 
                                name="last_name" 
                                value={formData.last_name}
                                onChange={handleChange}
                                required 
                                placeholder="Dela Cruz" />
                        </div>
                    </div>

                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        placeholder="example@example.com" />     


                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="password"
                            value={formData.password}
                            onChange={handleChange}
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
                    <div className="password-wrapper" style={{ marginBottom: '8px' }}>
                        <input
                            type={showConfPassword ? "text" : "password"}
                            className="password"
                            id="conf-password"
                            name="conf-password"
                            value={confPassword}
                            onChange={handleChange}
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
                    {formError && <div style={{ color: 'red', marginBottom: '16px' }}>{formError}</div>}

                    <button type="submit">Register</button>
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

export default RegisterPage;

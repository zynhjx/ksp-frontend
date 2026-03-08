import "./auth.css"
import { useContext, useState } from "react";
import { Link, Navigate} from "react-router-dom";
import Logo from "../assets/pngs/ksp-logo.png";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

function LoginPage() {
    const {login} = useContext(AuthContext)
    const apiUrl = import.meta.env.VITE_API_URL;
    const [showPassword, setShowPassword] = useState(false);
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
        email: "",
        password: "",
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            const response = await fetch(`${apiUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 🔥 important for cookies!
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.status === 200) {
                login(data.user); // assuming you have a login function in context
                toast.success(data.message || "Successfully Logged In!");

                setFormData({ email: "", password: "" }); // reset login form

                setTimeout(() => {
                    switch (data.user.role) {
                        case "Youth":
                            return <Navigate to="/youth/dashboard" replace />;
                        case "SK":
                            return <Navigate to="/sk/dashboard" replace />;
                        case "Admin":
                            return <Navigate to="/admin/dashboard" replace />;
                        default:
                            return <Navigate to="/" replace />; // fallback if role is unknown
                        }
                }, 2000);
            } else if (!response.ok) {
                toast.error(data.error || data.message || "Login failed");
            }
        } catch (err) {
            
            console.error(err);
            toast.error("Server error. Please try again.");
            toast.error(apiUrl)
        }
    };
    
    return (
        <div className="form-page login">
            <div className="form-container">
                <Link className="logo-container" to="/">
                    <img className="head-logo" src={Logo} alt=""/>
                </Link>
                <h2>Welcome Back</h2>
                <p>Please enter your credentials to continue.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={handleChange} id="email" name="email" required placeholder="example@example.com" />


                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="password"
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
                            style={{
                                cursor: "pointer",
                                opacity: showPassword ? 1 : 0.6,
                            }}
                        >
                            {showPassword ? EyeOpen : EyeClosed}
                        </span>
                    </div>
                    <button type="submit">Log In</button>
                </form>
                <div className="redirect-container">
                    <span>Do not have an account? </span>
                    <Link to="/auth/register" className="link">
                        Register    
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;

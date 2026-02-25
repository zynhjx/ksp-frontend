import "./Register.css"

function Register() {
    
    return (
        <div className="register-page">
            <div className="form-container">
                <h2>Create Account</h2>
                <p>Enter your information to register</p>
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

                    <div className="info-row">
                        <div className="info-col">
                            <label htmlFor="age">Date of Birth</label>
                            <input type="date" id="age" name="age" required placeholder="Select date of birth" />
                        </div>
                        <div className="info-col">
                            <label htmlFor="contact">Contact Number</label>
                            <input type="tel" id="contact" name="contact" required placeholder="09123456789" />
                        </div>
                    </div>

                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" required placeholder="123 Main St, Barangay Bagong Bayan" />

                    <label htmlFor="education">Education</label>
                    <select id="employment" name="employment" required>
                        <option value="" disabled selected hidden>Select Education Level</option>
                        <option value="Elementary Graudate">Elementary Graudate</option>
                        <option value="High School Graduate">High School Graduate</option>
                        <option value="College Undergraduate">College Undergraduate</option>
                        <option value="College Undergraduate">College Graduate</option>
                        <option value="College Undergraduate">Vocational/Technical</option>
                        <option value="College Undergraduate">Others</option>
                    </select>

                    <label htmlFor="skills">Skills</label>
                    <input type="text" id="skills" name="skills" required placeholder="Enter skills" />

                    <label htmlFor="employment">Employment Status</label>
                    <select id="employment" name="employment" required>
                        <option value="" disabled selected hidden>Select employment status</option>
                        <option value="employed">Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="student">Student</option>
                    </select>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="education" name="password" required placeholder="••••••••••" />

                    <label htmlFor="conf-password">Confirm Password</label>
                    <input type="password" id="skills" name="conf-password" required placeholder="••••••••••" />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Register;
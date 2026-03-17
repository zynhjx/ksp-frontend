import "./auth.css"
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/pngs/ksp-logo.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../contexts/AuthContext"; 
import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    Step,
    StepLabel,
    Stepper,
    TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";


function RegisterPage() {
    const navigate = useNavigate();
    const { fetchUser } = useContext(AuthContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeStep, setActiveStep] = useState(0);
    const [formError, setFormError] = useState("");
    const [barangayOptions, setBarangayOptions] = useState([]);
    const [isBarangayLoading, setIsBarangayLoading] = useState(true);

    const steps = ["Personal Info", "Background", "Account"];
    const stepFields = [
        ["first_name", "last_name", "date_of_birth", "contact_number", "barangay"],
        ["school", "education", "employment_status"],
        ["email", "password", "confirm_password"],
    ];

    const {
        control,
        handleSubmit,   
        trigger,
        getValues,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            date_of_birth: "",
            contact_number: "",
            barangay: "",
            school: "",
            education: "",
            employment_status: "",
            email: "",
            password: "",
            confirm_password: "",
        },
        mode: "onTouched",
    });

    useEffect(() => {
        let isMounted = true;

        const fetchBarangays = async () => {
            setIsBarangayLoading(true);

            const endpoints = [
                `${apiUrl}/api/barangays`,
                `${apiUrl}/api/admin/barangays`,
            ];

            try {
                for (const endpoint of endpoints) {
                    const response = await fetch(endpoint, { credentials: "include" });
                    if (!response.ok) {
                        continue;
                    }

                    const data = await response.json();
                    const items = Array.isArray(data?.barangays)
                        ? data.barangays
                        : Array.isArray(data)
                            ? data
                            : [];

                    const normalized = items
                        .map((item) => {
                            if (typeof item === "string") {
                                return { label: item, value: item };
                            }

                            const label = item?.name || item?.barangay_name || item?.barangayName;
                            return label ? { label, value: label } : null;
                        })
                        .filter(Boolean);

                    if (normalized.length > 0) {
                        if (isMounted) {
                            setBarangayOptions(normalized);
                        }
                        break;
                    }
                }
            } catch (err) {
                console.error("Failed to load barangays", err);
            } finally {
                if (isMounted) {
                    setIsBarangayLoading(false);
                }
            }
        };

        fetchBarangays();

        return () => {
            isMounted = false;
        };
    }, [apiUrl]);

    const handleNext = async () => {
        const isStepValid = await trigger(stepFields[activeStep]);
        if (isStepValid) {
            setActiveStep((prev) => prev + 1);
            setFormError("");
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const onSubmit = async (values) => {
        setFormError("");

        const payload = {
            first_name: values.first_name,
            last_name: values.last_name,
            date_of_birth: values.date_of_birth,
            contact_number: values.contact_number,
            barangay: values.barangay,
            school: values.school,
            education: values.education,
            employment_status: values.employment_status,
            email: values.email,
            password: values.password,
        };


        try {
            const response = await fetch(`${apiUrl}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 🔥 important for cookies!
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.status === 201) {
                toast.success(data.message, data.user || "Account successfully registered!");
                reset();
                setActiveStep(0);
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ width: "100%", mb: 1 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Card sx={{ mb: 2, backgroundColor: "transparent", border: "none", boxShadow: "none" }}>
                        <CardContent>
                            {activeStep === 0 && (
                                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                                    <Controller
                                        name="first_name"
                                        control={control}
                                        rules={{ required: "First name is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="First Name"
                                                fullWidth
                                                error={!!errors.first_name}
                                                helperText={errors.first_name?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="last_name"
                                        control={control}
                                        rules={{ required: "Last name is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Last Name"
                                                fullWidth
                                                error={!!errors.last_name}
                                                helperText={errors.last_name?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="date_of_birth"
                                        control={control}
                                        rules={{ required: "Date of birth is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="date"
                                                label="Date of Birth"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.date_of_birth}
                                                helperText={errors.date_of_birth?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="contact_number"
                                        control={control}
                                        rules={{
                                            required: "Contact number is required",
                                            pattern: {
                                                value: /^(?:\+63|0)\d{10}$/,
                                                message: "Use a valid PH number (e.g., 09171234567 or +639171234567)",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Contact Number"
                                                fullWidth
                                                error={!!errors.contact_number}
                                                helperText={errors.contact_number?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="barangay"
                                        control={control}
                                        rules={{ required: "Barangay is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Barangay"
                                                select
                                                fullWidth
                                                sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}
                                                error={!!errors.barangay}
                                                helperText={errors.barangay?.message}
                                                disabled={isBarangayLoading}
                                            >
                                                <MenuItem value="" disabled>
                                                    {isBarangayLoading ? "Loading barangays..." : "Select barangay"}
                                                </MenuItem>
                                                {barangayOptions.map((barangay) => (
                                                    <MenuItem key={barangay.value} value={barangay.value}>
                                                        {barangay.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Box>
                            )}

                            {activeStep === 1 && (
                                <Box sx={{ display: "grid", gap: 2 }}>
                                    <Controller
                                        name="school"
                                        control={control}
                                        rules={{ required: "School is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="School"
                                                fullWidth
                                                error={!!errors.school}
                                                helperText={errors.school?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="education"
                                        control={control}
                                        rules={{ required: "Education is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Education"
                                                select
                                                fullWidth
                                                error={!!errors.education}
                                                helperText={errors.education?.message}
                                            >
                                                <MenuItem value="Elementary">Elementary</MenuItem>
                                                <MenuItem value="High School">High School</MenuItem>
                                                <MenuItem value="Senior High School">Senior High School</MenuItem>
                                                <MenuItem value="College">College</MenuItem>
                                                <MenuItem value="Vocational">Vocational</MenuItem>
                                                <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                    <Controller
                                        name="employment_status"
                                        control={control}
                                        rules={{ required: "Employment status is required" }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Employment Status"
                                                select
                                                fullWidth
                                                error={!!errors.employment_status}
                                                helperText={errors.employment_status?.message}
                                            >
                                                <MenuItem value="Employed">Employed</MenuItem>
                                                <MenuItem value="Unemployed">Unemployed</MenuItem>
                                                <MenuItem value="Self-employed">Self-employed</MenuItem>
                                                <MenuItem value="Student">Student</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                </Box>
                            )}

                            {activeStep === 2 && (
                                <Box sx={{ display: "grid", gap: 2 }}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Enter a valid email address",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="email"
                                                label="Email"
                                                fullWidth
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters long",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="password"
                                                label="Password"
                                                fullWidth
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="confirm_password"
                                        control={control}
                                        rules={{
                                            required: "Confirm password is required",
                                            validate: (value) =>
                                                value === getValues("password") || "Passwords do not match",
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="password"
                                                label="Confirm Password"
                                                fullWidth
                                                error={!!errors.confirm_password}
                                                helperText={errors.confirm_password?.message}
                                            />
                                        )}
                                    />
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {formError && <div style={{ color: 'red', marginBottom: '16px' }}>{formError}</div>}

                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            disabled={activeStep === 0}
                        >
                            Back
                        </Button>

                        {activeStep < steps.length - 1 ? (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        ) : (
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Register"}
                            </Button>
                        )}
                    </Box>
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

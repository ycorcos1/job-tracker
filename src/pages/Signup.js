import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Signup.css';
import Footer from "../components/Footer";

function Signup() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({ 
        first_name: "",
        last_name: "",
        username: "", 
        password: "",
        confirmPassword: ""
      });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess("Signup successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(data.error || "User already exists");
            }
        } catch (error) {
            setError("Error connecting to the server.");
        }
    };
    

    return (
        <>
            <div className="signup-container">
                <h2 className="signup-title">Sign Up</h2>
                {error && <p className="error">{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <form className="signup-form" onSubmit={handleSignup}>
                    <input type="text" name="username" className="signup-input" placeholder="Username" onChange={handleChange} required />
                    <input type="password" name="password" className="signup-input" placeholder="Password" onChange={handleChange} required />
                    <input type="password" name="confirmPassword" className="signup-input" placeholder="Confirm Password" onChange={handleChange} required />
                    <input type="text" name="first_name" className="signup-input" placeholder="First Name" onChange={handleChange} required />
                    <input type="text" name="last_name" className="signup-input" placeholder="Last Name" onChange={handleChange} required />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
            <div className="signup-footer">
                <Footer />
            </div>
        </>
    );
}

export default Signup;

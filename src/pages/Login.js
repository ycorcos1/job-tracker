import '../styles/Login.css';
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import Footer from '../components/Footer';

function Login() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);

    // Redirect logged-in users away from login page
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleLogin = async (formData) => {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.user);  // Save user in context & localStorage
                navigate("/dashboard"); // Redirect after login
            } else {
                setError(data.error || "Login failed.");
            }
        } catch (error) {
            setError("Error connecting to the server.");
        }
    };

    return (
        <>
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {error && <p className="error">{error}</p>}
            <form className="login-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                    username: e.target.username.value,
                    password: e.target.password.value
                };
                handleLogin(formData);
            }}>
                <input type="text" name="username" className="login-input" placeholder="Username" required />
                <input type="password" name="password" className="login-input" placeholder="Password" required />
                <button type="submit" className="login-button">Login</button>
            </form>
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
        <div className="login-footer">
            <Footer />
        </div>
        </>
    );
}

export default Login;

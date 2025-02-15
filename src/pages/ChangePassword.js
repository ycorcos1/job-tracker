import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import '../styles/ChangePassword.css';

function ChangePassword() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const { user } = useContext(AuthContext); // Get user from context
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user?.username,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Password changed successfully!");
            } else {
                setError(data.error || "Password change failed.");
            }
        } catch (error) {
            setError("Error connecting to the server.");
        }
    };

    return (
        <div className="change-password-container">
            <button onClick={() => navigate("/dashboard")} className="go-back-button">
                Go Back to Dashboard
            </button>
            <h2 className="change-password-title">Change Password</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form className="change-password-form" onSubmit={handleChangePassword}>
                <input type="password" name="oldPassword" className="change-password-input" placeholder="Old Password" onChange={handleChange} required />
                <input type="password" name="newPassword" className="change-password-input" placeholder="New Password" onChange={handleChange} required />
                <input type="password" name="confirmNewPassword" className="change-password-input" placeholder="Confirm New Password" onChange={handleChange} required />
                <button type="submit" className="change-password-button">Change Password</button>
            </form>
        </div>
    );
}

export default ChangePassword;

import '../styles/JobForm.css';
import { useState, useContext } from "react";
import AuthContext from "../AuthContext";

function JobForm({ onJobAdded }) {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        job_title: "",
        company_name: "",
        site_used: "",
        date_applied: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, user_id: user.id }),
            });

            const data = await response.json();
            if (response.ok) {
                setFormData({ job_title: "", company_name: "", site_used: "", date_applied: "" });
                onJobAdded();
            } else {
                setError(data.error || "Failed to add job application.");
            }
        } catch (error) {
            setError("Error connecting to server.");
        }
    };

    return (
        <div className="job-form-container">
            <h3>Add Job Application</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="job-form" onSubmit={handleSubmit}>
                <input type="text" name="job_title" className="job-input" placeholder="Job Title" value={formData.job_title} onChange={handleChange} required />
                <input type="text" name="company_name" className="job-input" placeholder="Company Name" value={formData.company_name} onChange={handleChange} required />
                <input type="text" name="site_used" className="job-input" placeholder="Job Site Used" value={formData.site_used} onChange={handleChange} required />
                <input type="date" name="date_applied" className="job-input" value={formData.date_applied} onChange={handleChange} required />
                <button type="submit" className="job-submit-button">Add Job</button>
            </form>
        </div>
    );
}

export default JobForm;

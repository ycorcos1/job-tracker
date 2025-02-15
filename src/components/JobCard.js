import '../styles/JobCard.css';
import { useState } from "react";

function JobCard({ job, onJobUpdated }) {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ ...job });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/${job.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setEditing(false);
                onJobUpdated();
            }
        } catch (error) {
            console.error("Error updating job.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/${job.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onJobUpdated();
            }
        } catch (error) {
            console.error("Error deleting job.");
        }
    };

    return (
        <div className="job-card">
            {editing ? (
                <div className="job-card-edit">
                    <input type="text" name="job_title" className="job-input" value={formData.job_title} onChange={handleChange} />
                    <input type="text" name="company_name" className="job-input" value={formData.company_name} onChange={handleChange} />
                    <input type="text" name="site_used" className="job-input" value={formData.site_used} onChange={handleChange} />
                    <input type="date" name="date_applied" className="job-input" value={formData.date_applied} onChange={handleChange} />
                    <select name="status" className="job-status-dropdown" value={formData.status} onChange={handleChange}>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <div className="job-card-actions">
                        <button className="job-save-button" onClick={handleUpdate}>Save</button>
                        <button className="job-cancel-button" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="job-card-content">
                    <h4 className="job-title">{job.job_title} <span className="company">@ {job.company_name}</span></h4>
                    <div className="job-info">
                        <div className="job-meta">
                            <span className="job-site">{job.site_used}</span>
                            <span className="job-date"><b>Applied: </b>{new Date(job.date_applied).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                        </div>
                        <span className={`job-status ${job.status.toLowerCase()}`}>{job.status}</span>
                    </div>
                    <div className="job-card-actions">
                        <button className="job-edit-button" onClick={() => setEditing(true)}>Edit</button>
                        <button className="job-delete-button" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobCard;

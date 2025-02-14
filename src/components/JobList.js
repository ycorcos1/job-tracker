import '../styles/JobList.css';
import { useEffect, useState, useContext, useCallback } from "react";
import AuthContext from "../AuthContext";
import JobCard from "./JobCard";

function JobList() {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [page, setPage] = useState(() => parseInt(localStorage.getItem("page")) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState(() => localStorage.getItem("sort") || "latest");
    const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem("statusFilter") || "");

    const fetchJobs = useCallback(async () => {
        setError("");
        try {
            const queryParams = new URLSearchParams({
                user_id: user.id,
                page,
                limit: 10,
                sort,
                status: statusFilter || "",
            }).toString();

            const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                setJobs(Array.isArray(data.jobs) ? data.jobs : []);
                setTotalPages(data.totalPages || 1);

                if (page > data.totalPages) {
                    setPage(1);
                    localStorage.setItem("page", 1);
                }
            } else {
                setError(data.error || "Failed to load job applications.");
            }
        } catch (error) {
            setError("Error connecting to server.");
        }
    }, [user.id, page, sort, statusFilter]);;

    useEffect(() => {
        fetchJobs();
    }, [page, sort, statusFilter, fetchJobs]);

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSort(newSort);
        localStorage.setItem("sort", newSort);
        setPage(1);
        localStorage.setItem("page", 1);
    };

    const handleStatusFilterChange = (e) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        localStorage.setItem("statusFilter", newStatus);
        setPage(1);
        localStorage.setItem("page", 1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            localStorage.setItem("page", newPage);
        }
    };
    
    return (
        <div className="job-list-container">
            <h3>Job Applications</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="job-filters">
                <label>Sort by: </label>
                <select className="job-sort" onChange={handleSortChange} value={sort}>
                    <option value="latest">Most Recent</option>
                    <option value="earliest">Oldest First</option>
                </select>
                <label>{" "}Filter by Status: </label>
                <select onChange={handleStatusFilterChange} value={statusFilter}>
                    <option value="">All</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <p>{" "}</p>
            </div>
            {jobs.length === 0 ? <p>No job applications found.</p> : jobs.map((job) => <JobCard key={job.id} job={job} onJobUpdated={fetchJobs} />)}
            <div className="pages">
                <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next</button>
            </div>
        </div>
    );
}

export default JobList;

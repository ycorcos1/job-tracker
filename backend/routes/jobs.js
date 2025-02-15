const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Add a new job application
router.post("/", async (req, res) => {
    const { user_id, job_title, company_name, site_used, date_applied } = req.body;
    
    if (!user_id || !job_title || !company_name || !site_used || !date_applied) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO jobs (user_id, job_title, company_name, site_used, date_applied) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, job_title, company_name, site_used, date_applied]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding job:", error);
        res.status(500).json({ error: "Failed to add job" });
    }
});

// Edit an existing job application
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { job_title, company_name, site_used, date_applied, status } = req.body;

    try {
        const result = await pool.query(
            "UPDATE jobs SET job_title = $1, company_name = $2, site_used = $3, date_applied = $4, status = $5 WHERE id = $6 RETURNING *",
            [job_title, company_name, site_used, date_applied, status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ error: "Failed to update job" });
    }
});

// Delete a job application
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM jobs WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ error: "Failed to delete job" });
    }
});

// Retrieve all jobs for a user (no pagination or filtering)
router.get("/", async (req, res) => {
    let { user_id, status, sort, page = 1, limit = 10 } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Convert page and limit to integers (prevents ReferenceError)
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    let values = [user_id];
    let countValues = [user_id];

    let paramIndex = 2;
    let query = "SELECT * FROM jobs WHERE user_id = $1";
    let countQuery = "SELECT COUNT(*) FROM jobs WHERE user_id = $1";

    // Apply status filter only if status is provided
    if (status && status !== "") {
        query += ` AND status = $${paramIndex}`;
        countQuery += ` AND status = $${paramIndex}`;
        values.push(status);
        countValues.push(status);
        paramIndex++;
    }

    // Apply sorting
    query += sort === "earliest" ? " ORDER BY date_applied ASC" : " ORDER BY date_applied DESC";

    // Pagination logic (Apply LIMIT and OFFSET correctly)
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, (page - 1) * limit);

    try {
        const jobsResult = await pool.query(query, values);
        const totalResult = await pool.query(countQuery, countValues);
        const totalJobs = parseInt(totalResult.rows[0].count, 10);
        const totalPages = Math.max(1, Math.ceil(totalJobs / limit));

        res.json({
            jobs: jobsResult.rows,
            totalPages
        });
    } catch (error) {
        console.error("Error retrieving jobs:", error);
        res.status(500).json({ error: "Failed to retrieve jobs" });
    }
});


module.exports = router;

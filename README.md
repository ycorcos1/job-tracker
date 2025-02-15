# TrackMyJob

TrackMyJob is a web application that allows users to efficiently manage and track their job applications. Users can add, edit, delete, and filter job applications based on status and sorting preferences.

## Features
- **Add, Edit, and Delete Job Applications**
- **Pagination for easy navigation**
- **Sorting by Most Recent or Oldest First**
- **Filtering by Job Status (Applied, Interview, Offer, Rejected)**
- **Local Storage Integration for User Preferences**
- **Responsive UI Design**

## Technologies Used
- **Frontend:** React (useState, useEffect, useContext)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with pg-pool
- **Styling:** CSS (custom styles for UI components)
- **Deployment:** Vercel

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/YOUR_USERNAME/job-tracker.git
   cd job-tracker/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure database credentials:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Run the backend server:
   ```sh
   npm start
   ```
   The backend should now be running on **http://localhost:5000**.

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```
   The frontend should now be running on **http://localhost:3000**.

## API Endpoints
### **Job Management**
#### **Get All Jobs**
```http
GET /api/jobs?user_id={user_id}&page={page}&limit={limit}&sort={sort}&status={status}
```
- Retrieves jobs with pagination, sorting, and filtering.

#### **Add a New Job**
```http
POST /api/jobs
```
**Request Body:**
```json
{
  "user_id": "your_user_id",
  "job_title": "your_job_title",
  "company_name": "your_company_name",
  "site_used": "your_application_site",
  "date_applied": "YYYY-MM-DD"
}
```

#### **Edit a Job**
```http
PATCH /api/jobs/:id
```

#### **Delete a Job**
```http
DELETE /api/jobs/:id
```

## Future Improvements
- **Delete Account Function**
- **Enhanced Job Application Notes & Attachments**
- **Email Reminders for Follow-ups**
- **Export Job Applications as CSV**
- **Mobile App Version**

## License
This project is open-source and available under the **MIT License**.

---
If you have any questions or suggestions, feel free to open an issue or contribute to the project! 🚀


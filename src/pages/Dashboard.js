import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import '../styles/Dashboard.css';
import Footer from "../components/Footer";

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <>
            <div className="dashboard-container">
                <h2 className="dashboard-title">Welcome to Your Dashboard, {user?.first_name}!</h2>
                <button className="logout-button" onClick={logout}>Logout</button>
                <button className="dashboard-button" onClick={() => navigate("/change-password")}>Change Password</button> {/* New button */}
                <JobForm onJobAdded={() => window.location.reload()} />
                <JobList />
            </div>
            <div className="dashboard-footer">
                <Footer />
            </div>
        </>
    );
}

export default Dashboard;

import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from './components/Header';
import ChangePassword from './pages/ChangePassword';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <main>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/change-password" element={<ChangePassword />} />
                        </Route>
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
}

export default App;

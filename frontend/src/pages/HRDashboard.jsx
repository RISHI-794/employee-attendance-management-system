import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HRDashboard.css";

function HRDashboard() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
};

    useEffect(() => {
        const fetchHRDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "https://employee-attendance-management-system-6b2u.onrender.com/api/attendance/hr-dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDashboard(response.data);
            } catch (error) {
                console.error("HR Dashboard error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load HR dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHRDashboard();
    }, []);

    if (loading) {
        return <h2>Loading HR Dashboard...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
    <div className="hr-dashboard">
        <div className="hr-header">
            <h1>HR Dashboard</h1>

            <nav className="hr-nav">
                <button onClick={() => navigate("/hr-dashboard")}>
                    Dashboard
                </button>
                <button onClick={() => navigate("/hr-employees")}>
                    Employee Management
                </button>

                <button onClick={() => navigate("/hr-leaves")}>
                    Leave Management
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        </div>
    
            
            <div className="hr-stats">
    <div className="hr-stat-card">
        <h3>Total Employees</h3>
        <p>{dashboard.totalEmployees}</p>
    </div>

    <div className="hr-stat-card">
        <h3>Present Today</h3>
        <p>{dashboard.presentToday}</p>
    </div>

    <div className="hr-stat-card">
        <h3>Half Day Today</h3>
        <p>{dashboard.halfDayToday}</p>
    </div>

    <div className="hr-stat-card">
        <h3>On Leave Today</h3>
        <p>{dashboard.onLeaveToday}</p>
    </div>

    <div className="hr-stat-card">
        <h3>Pending Leaves</h3>
        <p>{dashboard.pendingLeaves}</p>
    </div>
</div>

            <div className="hr-attendance">
                <h2>Recent Attendance</h2>

                {dashboard.recentAttendance.map((record) => (
                    <div className="attendance-record" key={record._id}>
                        <p>
                            {record.employee
                                ? `${record.employee.name} (${record.employee.employeeId})`
                                : `${record.employeeName} (${record.employeeId})`}
                        </p>

                        <p>
                            Department:{" "}
                            {record.employee?.department ||
                                record.employeeDepartment ||
                                "N/A"}
                        </p>

                    <p>
                        Status: {record.status}
                    </p>
                </div>
            ))}
        </div>
    </div>
    );
}


export default HRDashboard;
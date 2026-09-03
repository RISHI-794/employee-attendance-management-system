import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const [leaveStartDate, setLeaveStartDate] = useState("");
    const [leaveEndDate, setLeaveEndDate] = useState("");
    const [leaveReason, setLeaveReason] = useState("");
    
    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
};

    const handleCheckIn = async () => {
    try {
        setActionLoading(true);

        const token = localStorage.getItem("token");

        await axios.post(
            "http://localhost:5000/api/attendance/check-in",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Check In successful!");

        window.location.reload();

    } catch (error) {
        console.error("Check In error:", error);

        alert(
            error.response?.data?.message ||
            "Unable to check in."
        );
    } finally {
        setActionLoading(false);
    }
};
const handleCheckOut = async () => {
    try {
        setActionLoading(true);

        const token = localStorage.getItem("token");

        await axios.post(
            "http://localhost:5000/api/attendance/check-out",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Check Out successful!");

        window.location.reload();

    } catch (error) {
        console.error("Check Out error:", error);

        alert(
            error.response?.data?.message ||
            "Unable to check out."
        );
    } finally {
        setActionLoading(false);
    }
};

const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    if (!leaveStartDate || !leaveEndDate || !leaveReason) {
        alert("Please fill in all leave details.");
        return;
    }

    try {
        setActionLoading(true);

        const token = localStorage.getItem("token");

        await axios.post(
            "http://localhost:5000/api/leave/apply",
            {
                startDate: leaveStartDate,
                endDate: leaveEndDate,
                reason: leaveReason
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Leave application submitted successfully!");

        setShowLeaveForm(false);
        setLeaveStartDate("");
        setLeaveEndDate("");
        setLeaveReason("");

        window.location.reload();

    } catch (error) {
        console.error("Leave application error:", error);

        alert(
            error.response?.data?.message ||
            "Unable to submit leave application."
        );
    } finally {
        setActionLoading(false);
    }
};

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/attendance/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDashboard(response.data);
            } catch (error) {
                console.error("Dashboard error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>Something went wrong</h2>
                <p>{error}</p>
            </div>
        );
    }

    const today = new Date().toDateString();

    const latestAttendance = dashboard.attendance.find(
        (record) =>
            new Date(record.date).toDateString() === today
    );

    return (
        <div className="dashboard">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-logo">EA</div>
                    <div>
                        <h2>AttendEase</h2>
                        <span>Employee Portal</span>
                    </div>
                </div>

                <nav className="navigation">
                    <button className="nav-item active">
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button className="nav-item" onClick={() => navigate("/employee-attendance")}
            >
                        <span>◷</span>
                        Attendance
                    </button>

                    <button type="button"
                        className="nav-item"
                        onClick={() => navigate("/employee-leave")}>
                        <span>▣</span>
                        Leave
                    </button>

                    <button className="nav-item" onClick={() => navigate("/employee-settings")}>
                        <span>⚙</span>
                        Settings
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

            </aside>

            {/* Main content */}
            <main className="main-content">

                {/* Header */}
                <header className="topbar">

                    <div>
                        <p className="welcome-label">
                            Employee Portal
                        </p>

                        <h1>Good afternoon 👋</h1>
                    </div>

                    <div className="profile">
                        <div className="avatar">
                            E
                        </div>

                        <div>
                            <strong>Employee</strong>
                            <span>My Account</span>
                        </div>
                    </div>

                </header>

                {/* Statistics */}
                <section className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon">✓</div>

                        <div>
                            <p>Attendance Records</p>
                            <h2>{dashboard.attendance.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">◷</div>

                        <div>
                            <p>Leave Days Used</p>
                            <h2>{dashboard.usedLeaveDays}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">▣</div>

                        <div>
                            <p>Leave Requests</p>
                            <h2>{dashboard.leaves.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">●</div>

                        <div>
                            <p>Current Status</p>
                            <h2>
                                {latestAttendance?.status || "Not marked"}
                            </h2>
                        </div>
                    </div>

                </section>

                {/* Today's attendance */}
                <section className="content-grid">

                    <div className="panel attendance-panel">

                        <div className="panel-header">
                            <div>
                                <p className="section-label">
                                    TODAY
                                </p>

                                <h2>Attendance</h2>
                            </div>

                            <span className="status-badge">
                                {latestAttendance?.status || "Not marked"}
                            </span>
                        </div>

                        <div className="attendance-details">

                            <div className="time-box">
                                <span>Check In</span>

                                <strong>
                                    {latestAttendance?.checkIn
                                        ? new Date(
                                            latestAttendance.checkIn
                                        ).toLocaleTimeString()
                                        : "--:--"}
                                </strong>
                            </div>

                            <div className="time-box">
                                <span>Check Out</span>

                                <strong>
                                    {latestAttendance?.checkOut
                                        ? new Date(
                                            latestAttendance.checkOut
                                        ).toLocaleTimeString()
                                        : "--:--"}
                                </strong>
                            </div>

                            <div className="time-box">
                                <span>Working Hours</span>

                                <strong>
                                    {latestAttendance?.workingHours || 0} hrs
                                </strong>
                            </div>

                        </div>

                        <div className="attendance-actions">
                            {!latestAttendance?.checkIn && (
                                <button
                                    className="primary-button"
                                    onClick={handleCheckIn}
                                    disabled={actionLoading}
        >
                                    {actionLoading ? "Checking In..." : "✓ Check In"}
                                </button>
                            )}

                            {latestAttendance?.checkIn && !latestAttendance?.checkOut && (
                                <button
                                    className="secondary-button"
                                    onClick={handleCheckOut}
                                    disabled={actionLoading}
        >
                                    {actionLoading ? "Checking Out..." : "⇥ Check Out"}
                                </button>
                            )}

                        {latestAttendance?.checkIn && latestAttendance?.checkOut && (
                            <div className="completed-message">
                                ✓ Attendance completed for today
                            </div>
                            )}
                        </div>

                    </div>

                    {/* Leave summary */}
                    <div className="panel leave-panel">

                        <div className="panel-header">
                            <div>
                                <p className="section-label">
                                    LEAVE
                                </p>

                                <h2>Leave Summary</h2>
                            </div>
                        </div>

                        <div className="leave-circle">
                            <strong>
                                {dashboard.usedLeaveDays}
                            </strong>

                            <span>Days Used</span>
                        </div>

                        <p className="leave-description">
                            You have used{" "}
                            <strong>
                                {dashboard.usedLeaveDays}
                            </strong>{" "}
                            leave day(s).
                        </p>

                        <button
                            className="primary-button full-width"
                            onClick={() => setShowLeaveForm(true)}
                        >
                            Apply for Leave
                        </button>

                    </div>

                </section>

                {/* Attendance history */}
                <section className="panel history-panel">

                    <div className="panel-header">
                        <div>
                            <p className="section-label">
                                HISTORY
                            </p>

                            <h2>Recent Attendance</h2>
                        </div>

                        <button className="view-button">
                            View All →
                        </button>
                    </div>

                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Working Hours</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {dashboard.attendance.map((record) => (
                                    <tr key={record._id}>

                                        <td>
                                            {new Date(
                                                record.date
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            {record.checkIn
                                                ? new Date(
                                                    record.checkIn
                                                ).toLocaleTimeString()
                                                : "--"}
                                        </td>

                                        <td>
                                            {record.checkOut
                                                ? new Date(
                                                    record.checkOut
                                                ).toLocaleTimeString()
                                                : "--"}
                                        </td>

                                        <td>
                                            {record.workingHours} hrs
                                        </td>

                                        <td>
                                            <span className="table-status">
                                                {record.status}
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </section>

                {showLeaveForm && (
                    <div className="leave-modal">
                        <div className="leave-form-card">
                            <div className="leave-form-header">
                                <div>
                                    <p className="section-label">LEAVE REQUEST</p>
                                        <h2>Apply for Leave</h2>
                                </div>

                                <button
                                    className="close-button"
                                    onClick={() => setShowLeaveForm(false)}
                                    >
                                        ×
                                </button>
                            </div>

                            <form onSubmit={handleLeaveSubmit}>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        value={leaveStartDate}
                                        onChange={(e) => setLeaveStartDate(e.target.value)}
                                    />
                                </div>

                <div className="form-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Reason</label>
                    <textarea
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        placeholder="Enter reason for leave"
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setShowLeaveForm(false)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={actionLoading}
                    >
                        {actionLoading
                            ? "Submitting..."
                            : "Submit Leave Request"}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

            </main>
        </div>
    );
}

export default EmployeeDashboard;
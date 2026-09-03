import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeAttendance.css";

function EmployeeAttendance() {
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "https://employee-attendance-management-system-6b2u.onrender.com/api/attendance/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setAttendance(response.data.attendance || []);
            } catch (error) {
                console.error("Attendance error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load attendance records."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    if (loading) {
        return <h2>Loading Attendance...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="employee-attendance">

            <div className="attendance-header">
                <h1>My Attendance</h1>

                <button
                    className="attendance-back-button"
                    onClick={() => navigate("/employee-dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>

            {attendance.length === 0 ? (
                <div className="no-attendance">
                    <p>No attendance records found.</p>
                </div>
            ) : (
                attendance.map((record) => (
                    <div
                        className="attendance-card"
                        key={record._id}
                    >
                        <h3>
                            {new Date(record.date).toLocaleDateString()}
                        </h3>

                        <div className="attendance-info">

                            <div>
                                <span>Check In</span>
                                <strong>
                                    {record.checkIn
                                        ? new Date(
                                            record.checkIn
                                        ).toLocaleTimeString()
                                        : "-"}
                                </strong>
                            </div>

                            <div>
                                <span>Check Out</span>
                                <strong>
                                    {record.checkOut
                                        ? new Date(
                                            record.checkOut
                                        ).toLocaleTimeString()
                                        : "-"}
                                </strong>
                            </div>

                            <div>
                                <span>Working Hours</span>
                                <strong>
                                    {record.workingHours} hrs
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong className={`attendance-status ${record.status.toLowerCase().replace(" ", "-")}`}>
                                    {record.status}
                                </strong>
                            </div>

                        </div>
                    </div>
                ))
            )}

        </div>
    );
}

export default EmployeeAttendance;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeLeave.css";

function EmployeeLeave() {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/leave/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setLeaves(response.data.leaves || []);
            } catch (error) {
                console.error("Fetch leaves error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load leave requests."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, []);

    const handleApplyLeave = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/leave/apply",
                {
                    startDate,
                    endDate,
                    reason
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                response.data.message ||
                "Leave applied successfully."
            );

            setStartDate("");
            setEndDate("");
            setReason("");

            const updatedLeaves = await axios.get(
                "http://localhost:5000/api/leave/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLeaves(updatedLeaves.data.leaves || []);
        } catch (error) {
            console.error("Apply leave error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to apply for leave."
            );
        }
    };

    return (
        <div className="employee-leave">

            <div className="leave-header">
                <h1>Leave Management</h1>

                <button
                    type="button"
                    className="leave-back-button"
                    onClick={() => navigate("/employee-dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="leave-section">

                <h2>Apply for Leave</h2>

                <form
                    className="leave-form"
                    onSubmit={handleApplyLeave}
                >

                    <div className="leave-field">
                        <label>Start Date</label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="leave-field">
                        <label>End Date</label>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="leave-field">
                        <label>Reason</label>

                        <textarea
                            value={reason}
                            onChange={(e) =>
                                setReason(e.target.value)
                            }
                            placeholder="Enter reason for leave"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="leave-submit-button"
                    >
                        Apply for Leave
                    </button>

                </form>

                {message && (
                    <div className="leave-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="leave-error">
                        {error}
                    </div>
                )}

            </div>

            <div className="leave-section">

                <h2>My Leave Requests</h2>

                {loading ? (
                    <p>Loading leave requests...</p>
                ) : leaves.length === 0 ? (
                    <p className="no-leaves">
                        No leave requests found.
                    </p>
                ) : (
                    leaves.map((leave) => (
                        <div
                            className="leave-card"
                            key={leave._id}
                        >

                            <h3>
                                Leave Request
                            </h3>

                            <div className="leave-details">

                                <div className="leave-detail">
                                    <span>From</span>
                                    <strong>
                                        {new Date(
                                            leave.startDate
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>

                                <div className="leave-detail">
                                    <span>To</span>
                                    <strong>
                                        {new Date(
                                            leave.endDate
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>

                                <div className="leave-detail">
                                    <span>Days</span>
                                    <strong>
                                        {leave.leaveDays}
                                    </strong>
                                </div>

                                <div className="leave-detail">
                                    <span>Status</span>
                                    <strong className={`leave-status ${leave.status.toLowerCase()}`}>
                                        {leave.status}
                                    </strong>
                                </div>

                            </div>

                            <p>
                                <strong>Reason:</strong>{" "}
                                {leave.reason}
                            </p>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default EmployeeLeave;
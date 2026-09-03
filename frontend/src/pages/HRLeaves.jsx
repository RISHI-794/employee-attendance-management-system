import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HRLeaves.css";

function HRLeaves() {
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const updateLeaveStatus = async (leaveId, status) => {
    try {
        const token = localStorage.getItem("token");

        await axios.put(
            `https://employee-attendance-management-system-6b2u.onrender.com/api/leave/${leaveId}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(`Leave request ${status.toLowerCase()} successfully!`);

        fetchLeaves();
    } catch (error) {
        console.error("Update leave status error:", error);

        alert(
            error.response?.data?.message ||
            "Unable to update leave status."
        );
    }
};

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://employee-attendance-management-system-6b2u.onrender.com/api/leave/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLeaves(response.data.leaves);
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

    useEffect(() => {
        fetchLeaves();
    }, []);

    if (loading) {
        return <h2>Loading Leave Requests...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

 return (
    <div className="hr-leaves">

        <div className="hr-leaves-header">
            <h1>Leave Management</h1>

            <button
                className="hr-leaves-back"
                onClick={() => navigate("/hr-dashboard")}
            >
                Back to Dashboard
            </button>
        </div>

        {leaves.length === 0 ? (
            <p>No leave requests found.</p>
        ) : (
            leaves.map((leave) => (
                <div
                    className="hr-leave-card"
                    key={leave._id}
                >
                    <h3>
                        {leave.employee?.name} (
                        {leave.employee?.employeeId})
                    </h3>

                    <p>
                        From:{" "}
                        {new Date(
                            leave.startDate
                        ).toLocaleDateString()}
                    </p>

                    <p>
                        To:{" "}
                        {new Date(
                            leave.endDate
                        ).toLocaleDateString()}
                    </p>

                    <p>Reason: {leave.reason}</p>

                    <p>Days: {leave.leaveDays}</p>

                    <p>Status: {leave.status}</p>

                    {leave.status === "Pending" && (
                        <div className="hr-leave-actions">
                            <button
                                onClick={() =>
                                    updateLeaveStatus(
                                        leave._id,
                                        "Approved"
                                    )
                                }
                            >
                                Approve
                            </button>

                            <button
                                onClick={() =>
                                    updateLeaveStatus(
                                        leave._id,
                                        "Rejected"
                                    )
                                }
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            ))
        )}

    </div>
);
}

export default HRLeaves;
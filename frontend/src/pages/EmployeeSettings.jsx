import { useNavigate } from "react-router-dom";
import "./EmployeeSettings.css";

function EmployeeSettings() {
    const navigate = useNavigate();

    return (
        <div className="employee-settings">
            <div className="settings-header">
                <h1>Settings</h1>

                <button
                    type="button"
                    className="settings-back-button"
                    onClick={() => navigate("/employee-dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="settings-card">
                <h2>Account Settings</h2>

                <div className="settings-item">
                    <span>Profile</span>
                    <strong>Employee Account</strong>
                </div>

                <div className="settings-item">
                    <span>Role</span>
                    <strong>Employee</strong>
                </div>

                <div className="settings-item">
                    <span>Account Status</span>
                    <strong>Active</strong>
                </div>
            </div>
        </div>
    );
}

export default EmployeeSettings;
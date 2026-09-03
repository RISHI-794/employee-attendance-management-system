import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HREmployees.css";

function HREmployees() {
    const navigate = useNavigate();

    const [employeeId, setEmployeeId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [totalLeaveDays, setTotalLeaveDays] = useState(12);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [employeesError, setEmployeesError] = useState("");
    const [editingEmployee, setEditingEmployee] = useState(null);

    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editDepartment, setEditDepartment] = useState("");
    const [editTotalLeaveDays, setEditTotalLeaveDays] = useState(12);
    const [editPassword, setEditPassword] = useState("");

    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://employee-attendance-management-system-6b2u.onrender.com/api/employees/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEmployees(response.data.employees || []);
        } catch (error) {
            console.error("Fetch employees error:", error);

            setEmployeesError(
                error.response?.data?.message ||
                "Unable to load employees."
            );
        } finally {
            setEmployeesLoading(false);
        }
    };

    fetchEmployees();
}, []);

    const handleAddEmployee = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "https://employee-attendance-management-system-6b2u.onrender.com/api/employees/add",
                {
                    employeeId,
                    name,
                    email,
                    password,
                    department,
                    totalLeaveDays: Number(totalLeaveDays)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                response.data.message ||
                "Employee created successfully."
            );

            setEmployeeId("");
            setName("");
            setEmail("");
            setPassword("");
            setDepartment("");
            setTotalLeaveDays(12);

        } catch (error) {
            console.error("Add employee error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to create employee."
            );
        } finally {
            setLoading(false);
        }
    };
    const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);

    setEditName(employee.name || "");
    setEditEmail(employee.email || "");
    setEditDepartment(employee.department || "");
    setEditTotalLeaveDays(employee.totalLeaveDays ?? 12);
    setEditPassword("");
};
const handleSaveEdit = async () => {
    if (!editingEmployee) {
        return;
    }

    setEditLoading(true);

    try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
            `https://employee-attendance-management-system-6b2u.onrender.com/api/employees/${editingEmployee._id}`,
            {
                name: editName,
                email: editEmail,
                department: editDepartment,
                totalLeaveDays: Number(editTotalLeaveDays),
                ...(editPassword
                    ? { password: editPassword }
                    : {})
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setEmployees((currentEmployees) =>
            currentEmployees.map((employee) =>
                employee._id === editingEmployee._id
                    ? response.data.employee
                    : employee
            )
        );

        setEditingEmployee(null);
        setEditPassword("");

        alert(
            response.data.message ||
            "Employee updated successfully."
        );

    } catch (error) {
        console.error("Save edit error:", error);

        alert(
            error.response?.data?.message ||
            "Unable to update employee."
        );
    } finally {
        setEditLoading(false);
    }
};
    const handleDeleteEmployee = async (employeeId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        await axios.delete(
            `https://employee-attendance-management-system-6b2u.onrender.com/api/employees/${employeeId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setEmployees((currentEmployees) =>
            currentEmployees.filter(
                (employee) => employee._id !== employeeId
            )
        );

    } catch (error) {
        console.error("Delete employee error:", error);

        alert(
            error.response?.data?.message ||
            "Unable to delete employee."
        );
    }
};
    return (
        <div className="hr-employees">
            <h1>Employee Management</h1>

            <button
                type="button"
                onClick={() => navigate("/hr-dashboard")}
            >
                Back to Dashboard
            </button>

            <h2>Add Employee</h2>

            <form className="employee-form" onSubmit={handleAddEmployee}>
                <div className="employee-form-field">
                    <label>Employee ID</label>
                    <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                    />
                </div>

                <div className="employee-form-field">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="employee-form-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="employee-form-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="employee-form-field">
                    <label>Department</label>
                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. IT"
                    />
                </div>

                <div className="employee-form-field">
                    <label>Total Leave Days</label>
                    <input
                        type="number"
                        min="0"
                        value={totalLeaveDays}
                        onChange={(e) => setTotalLeaveDays(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="create-employee-button"
                    disabled={loading}
                >
                    {loading ? "Creating Employee..." : "Create Employee"}
                </button>
            </form>

            {message && <p className="employee-success-message">{message}</p>}
            {error && <p className="employee-error-message">{error}</p>}
            <div className="employee-list-section">
    <h2>Employee List</h2>

    {employeesLoading ? (
        <p>Loading employees...</p>
    ) : employeesError ? (
        <p className="employee-error-message">
            {employeesError}
        </p>
    ) : employees.length === 0 ? (
        <p>No employees found.</p>
    ) : (
        <div className="employee-list">
            {employees.map((employee) => (
                <div
                    className="employee-card"
                    key={employee._id}
                >
                    <h3>{employee.name}</h3>

                    <div className="employee-details">
                        <div>
                            <span>Employee ID</span>
                            <strong>{employee.employeeId}</strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>{employee.email}</strong>
                        </div>

                        <div>
                            <span>Department</span>
                            <strong>{employee.department}</strong>
                        </div>

                        <div>
                            <span>Leave Days</span>
                            <strong>{employee.totalLeaveDays}</strong>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="edit-employee-button"
                        onClick={() => handleEditEmployee(employee)}
                    >
                        Edit Employee
                    </button>
                    <button
                        type="button"
                        className="delete-employee-button"
                        onClick={() => handleDeleteEmployee(employee._id)}
                    >
                        Delete Employee
                    </button>
                </div>

            ))}
        </div>
    )}
</div>
{editingEmployee && (
    <div className="edit-modal-overlay">

        <div className="edit-modal">

            <div className="edit-modal-header">
                <h2>Edit Employee</h2>

                <button
                    type="button"
                    className="edit-modal-close"
                    onClick={() => setEditingEmployee(null)}
                >
                    ×
                </button>
            </div>

            <div className="edit-modal-body">

                <div className="employee-form-field">
                    <label>Employee ID</label>
                    <input
                        type="text"
                        value={editingEmployee.employeeId}
                        disabled
                    />
                </div>

                <div className="employee-form-field">
                    <label>Name</label>
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) =>
                            setEditName(e.target.value)
                        }
                    />
                </div>

                <div className="employee-form-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={editEmail}
                        onChange={(e) =>
                            setEditEmail(e.target.value)
                        }
                    />
                </div>

                <div className="employee-form-field">
                    <label>Department</label>
                    <input
                        type="text"
                        value={editDepartment}
                        onChange={(e) =>
                            setEditDepartment(e.target.value)
                        }
                    />
                </div>

                <div className="employee-form-field">
                    <label>Total Leave Days</label>
                    <input
                        type="number"
                        min="0"
                        value={editTotalLeaveDays}
                        onChange={(e) =>
                            setEditTotalLeaveDays(e.target.value)
                        }
                    />
                </div>

                <div className="employee-form-field">
                    <label>New Password (optional)</label>
                    <input
                        type="password"
                        value={editPassword}
                        onChange={(e) =>
                            setEditPassword(e.target.value)
                        }
                        placeholder="Leave blank to keep current password"
                    />
                </div>

            </div>

            <div className="edit-modal-actions">

                <button
                    type="button"
                    className="cancel-edit-button"
                    onClick={() => setEditingEmployee(null)}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="save-edit-button"
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                >
                    {editLoading
                        ? "Saving..."
                        : "Save Changes"}
                </button>

            </div>

        </div>

    </div>
)}
        </div>
    );
}

export default HREmployees;
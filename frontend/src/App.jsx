import HRLeaves from "./pages/HRLeaves";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRDashboard from "./pages/HRDashboard";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import EmployeeLeave from "./pages/EmployeeLeave";
import EmployeeSettings from "./pages/EmployeeSettings";
import HREmployees from "./pages/HREmployees";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route
                path="/employee-dashboard"
                element={
                    <ProtectedRoute allowedRole="employee">
                        <EmployeeDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/employee-attendance"
                element={
                <ProtectedRoute allowedRole="employee">
                    <EmployeeAttendance />
                </ProtectedRoute>
                }
            />
            <Route
                path="/employee-leave"
                element={
                    <ProtectedRoute allowedRole="employee">
                        <EmployeeLeave />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employee-settings"
                element={
                    <ProtectedRoute allowedRole="employee">
                        <EmployeeSettings />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/hr-dashboard"
                element={
                    <ProtectedRoute allowedRole="hr">
                        <HRDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/hr-employees"
                element={
                    <ProtectedRoute allowedRole="hr">
                        <HREmployees />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/hr-leaves"
                element={
                    <ProtectedRoute allowedRole="hr">
                        <HRLeaves />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;
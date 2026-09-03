import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await axios.post(
            "https://employee-attendance-management-system-6b2u.onrender.com/api/auth/login",
            {
                email,
                password
            }
        );

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.employee.role);

        console.log("Login successful:", response.data);

if (response.data.employee.role === "hr") {
    navigate("/hr-dashboard");
} else {
    navigate("/employee-dashboard");
}

    } catch (error) {
        console.error("Login error:", error);

        setError(
            error.response?.data?.message ||
            "Login failed. Please try again."
        );
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <div className="logo">EA</div>

                    <h1>Welcome Back</h1>

                    <p>
                        Sign in to manage your attendance
                    </p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                            {error}
                        </p>
        )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                <p className="login-footer">
                    Employee Attendance Management System
                </p>

            </div>
        </div>
    );
}

export default Login;
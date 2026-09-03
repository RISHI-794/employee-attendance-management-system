const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const registerEmployee = async (req, res) => {
    try {
        const { employeeId, name, email, password, department } = req.body;

        const existingEmployee = await Employee.findOne({
            email: email.toLowerCase()
        });

        if (existingEmployee) {
            return res.status(400).json({
                message: "Employee with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
            employeeId,
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "employee",
            department: department || "General"
        });

        res.status(201).json({
            message: "Employee registered successfully",
            employee: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
            message: "Email and password are required."
        });
}

        // Find employee by email
        const employee = await Employee.findOne({
            email: email.toLowerCase()
        });

        if (!employee) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with stored hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            employee.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: employee._id,
                role: employee.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            employee: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};
const resetEmployeePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const employee = await Employee.findOne({
            email: email.toLowerCase()
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        employee.password = hashedPassword;

        await employee.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Password reset error:", error);

        res.status(500).json({
            message: "Server error while resetting password"
        });
    }
};

module.exports = {
    registerEmployee,
    loginEmployee,
    resetEmployeePassword
};
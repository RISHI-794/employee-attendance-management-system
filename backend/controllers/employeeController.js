const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

const addEmployee = async (req, res) => {
    try {
        const {
            employeeId,
            name,
            email,
            password,
            department,
            totalLeaveDays
        } = req.body;

        if (!employeeId || !name || !email || !password) {
            return res.status(400).json({
                message: "Employee ID, name, email and password are required."
            });
        }

        const existingEmployee = await Employee.findOne({
            $or: [
                { employeeId },
                { email }
            ]
        });

        if (existingEmployee) {
            return res.status(400).json({
                message: "Employee ID or email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
            employeeId,
            name,
            email,
            password: hashedPassword,
            role: "employee",
            department: department || "General",
            totalLeaveDays: totalLeaveDays || 12
        });

        res.status(201).json({
            message: "Employee created successfully.",
            employee: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department,
                totalLeaveDays: employee.totalLeaveDays
            }
        });

    } catch (error) {
        console.error("Add employee error:", error);

        res.status(500).json({
            message: "Server error while creating employee."
        });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find(
            { role: "employee" },
            {
                password: 0
            }
        ).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Employees fetched successfully.",
            employees
        });

    } catch (error) {
        console.error("Get employees error:", error);

        res.status(500).json({
            message: "Server error while fetching employees."
        });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findOneAndDelete({
            _id: id,
            role: "employee"
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found."
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully."
        });

    } catch (error) {
        console.error("Delete employee error:", error);

        res.status(500).json({
            message: "Server error while deleting employee."
        });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            department,
            totalLeaveDays,
            password
        } = req.body;

        const employee = await Employee.findOne({
            _id: id,
            role: "employee"
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found."
            });
        }

        if (name !== undefined) {
            employee.name = name;
        }

        if (email !== undefined) {
            employee.email = email;
        }

        if (department !== undefined) {
            employee.department = department;
        }

        if (totalLeaveDays !== undefined) {
            employee.totalLeaveDays = Number(totalLeaveDays);
        }

        if (password) {
            employee.password = await bcrypt.hash(password, 10);
        }

        await employee.save();

        res.status(200).json({
            message: "Employee updated successfully.",
            employee: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department,
                totalLeaveDays: employee.totalLeaveDays
            }
        });

    } catch (error) {
        console.error("Update employee error:", error);

        res.status(500).json({
            message: "Server error while updating employee."
        });
    }
};
module.exports = {
    addEmployee,
    getAllEmployees,
    deleteEmployee,
    updateEmployee
};
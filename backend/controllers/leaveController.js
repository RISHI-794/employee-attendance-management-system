const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

const applyLeave = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const { startDate, endDate, reason } = req.body;

        // Check required fields
        if (!startDate || !endDate || !reason) {
            return res.status(400).json({
                message: "Start date, end date and reason are required."
            });
        }

        // Convert dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const differenceInMilliseconds = end - start;

const leaveDays =
    Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Please provide valid dates."
            });
        }

        // End date cannot be before start date
        if (end < start) {
            return res.status(400).json({
                message: "End date cannot be before start date."
            });
        }

        // Create leave request
        const leave = await Leave.create({
            employee: employeeId,
            startDate: start,
            endDate: end,
            reason: reason.trim(),
            leaveDays: leaveDays,
            status: "Pending"
    });

        res.status(201).json({
            message: "Leave request submitted successfully",
            leave
        });

    } catch (error) {
        console.error("Apply leave error:", error);

        res.status(500).json({
            message: "Server error while applying for leave"
        });
    }
};

const getMyLeaves = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const leaves = await Leave.find({
            employee: employeeId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Leave history fetched successfully",
            leaves
        });

    } catch (error) {
        console.error("Get leave history error:", error);

        res.status(500).json({
            message: "Server error while fetching leave history"
        });
    }
};
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate("employee", "name email employeeId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All leave requests fetched successfully",
            leaves
        });

    } catch (error) {
        console.error("Get all leaves error:", error);

        res.status(500).json({
            message: "Server error while fetching leave requests"
        });
    }
};
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Approved or Rejected."
            });
        }

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found."
            });
        }

        leave.status = status;

        await leave.save();

        res.status(200).json({
            message: `Leave request ${status.toLowerCase()} successfully`,
            leave
        });

    } catch (error) {
        console.error("Update leave status error:", error);

        res.status(500).json({
            message: "Server error while updating leave status"
        });
    }
};
const getLeaveBalance = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found."
            });
        }

        const approvedLeaves = await Leave.find({
            employee: employeeId,
            status: "Approved"
        });

        const usedLeaveDays = approvedLeaves.reduce(
            (total, leave) => total + leave.leaveDays,
            0
        );

        const remainingLeaveDays =
            employee.totalLeaveDays - usedLeaveDays;

        res.status(200).json({
            totalLeaveDays: employee.totalLeaveDays,
            usedLeaveDays: usedLeaveDays,
            remainingLeaveDays: Math.max(remainingLeaveDays, 0)
        });

    } catch (error) {
        console.error("Leave balance error:", error);

        res.status(500).json({
            message: "Server error while calculating leave balance"
        });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
    getLeaveBalance
};
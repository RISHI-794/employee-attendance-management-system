const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

const checkIn = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const employee = await Employee.findById(employeeId);

if (!employee) {
    return res.status(404).json({
        message: "Employee not found."
    });
}

        // Get today's date
        const today = new Date();

        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
            0
        );

        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
            999
        );

        const approvedLeave = await Leave.findOne({
            employee: employeeId,
            status: "Approved",
            startDate: { $lte: endOfDay },
            endDate: { $gte: startOfDay }
        });
        if (approvedLeave) {
                return res.status(400).json({
                message: "You are on approved leave today."
        });
}

        // Check if employee already has attendance for today
        const existingAttendance = await Attendance.findOne({
            employee: employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (existingAttendance) {
            return res.status(400).json({
                message: "You have already checked in today."
            });
        }

        // Create today's attendance
        const attendance = await Attendance.create({
            employee: employeeId,
            employeeName: employee.name,
            employeeId: employee.employeeId,
            employeeDepartment: employee.department,
            date: today,
            checkIn: today,
            status: "Present"
        });

        res.status(201).json({
            message: "Check-in successful",
            attendance
        });

    } catch (error) {
        console.error("Check-in error:", error);

        res.status(500).json({
            message: "Server error during check-in"
        });
    }
};

const checkOut = async (req, res) => {
    try {
        const employeeId = req.user.id;

        // Get today's date
        const today = new Date();

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Find today's attendance record
        const attendance = await Attendance.findOne({
            employee: employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        // No check-in found
        if (!attendance) {
            return res.status(400).json({
                message: "You have not checked in today."
            });
        }

        // Already checked out
        if (attendance.checkOut) {
            return res.status(400).json({
                message: "You have already checked out today."
            });
        }

        // Current time becomes check-out time
        const checkOutTime = new Date();

        attendance.checkOut = checkOutTime;

        // Calculate working hours
        const differenceInMilliseconds =
            checkOutTime - attendance.checkIn;

        const differenceInHours =
            differenceInMilliseconds / (1000 * 60 * 60);

        attendance.workingHours =
            Number(differenceInHours.toFixed(2));

        if (attendance.workingHours < 4) {
                attendance.status = "Half Day";
        } else {
                attendance.status = "Present";
        }

        // Save attendance
        await attendance.save();

        res.status(200).json({
            message: "Check-out successful",
            attendance
        });

    } catch (error) {
        console.error("Check-out error:", error);

        res.status(500).json({
            message: "Server error during check-out"
        });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const attendance = await Attendance.find({
            employee: employeeId
        }).sort({ date: -1 });

        res.status(200).json({
            message: "Attendance records fetched successfully",
            attendance
        });

    } catch (error) {
        console.error("Get attendance error:", error);

        res.status(500).json({
            message: "Server error while fetching attendance"
        });
    }
};

const getEmployeeDashboard = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const attendance = await Attendance.find({
            employee: employeeId
        }).sort({ date: -1 }).limit(5);

        const leaves = await Leave.find({
            employee: employeeId
        }).sort({ createdAt: -1 }).limit(5);

        const approvedLeaves = await Leave.find({
            employee: employeeId,
            status: "Approved"
        });

        const usedLeaveDays = approvedLeaves.reduce(
            (total, leave) => total + leave.leaveDays,
            0
            );

            const employee = await Employee.findById(employeeId);

            const totalLeaveDays = employee.totalLeaveDays;

            const remainingLeaveDays =
                Math.max(totalLeaveDays - usedLeaveDays, 0);

        res.status(200).json({
            message: "Employee dashboard data fetched successfully",
            attendance,
            leaves,
            totalLeaveDays,
            usedLeaveDays,
            remainingLeaveDays
    });

    } catch (error) {
        console.error("Employee dashboard error:", error);

        res.status(500).json({
            message: "Server error while fetching dashboard data"
        });
    }
};
const getHRDashboard = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments({
            role: "employee"
        });

        const today = new Date();

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const presentToday = await Attendance.countDocuments({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: "Present"
        });

        const halfDayToday = await Attendance.countDocuments({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: "Half Day"
        });

        const onLeaveToday = await Leave.countDocuments({
            status: "Approved",
            startDate: { $lte: endOfDay },
            endDate: { $gte: startOfDay }
        });

        const pendingLeaves = await Leave.countDocuments({
            status: "Pending"
        });

        const recentAttendance = await Attendance.find()
        .populate("employee", "name employeeId department")
        .sort({ date: -1 })
        .limit(10);

        res.status(200).json({
            message: "HR dashboard data fetched successfully",
            totalEmployees,
            presentToday,
            halfDayToday,
            onLeaveToday,
            pendingLeaves,
            recentAttendance
    });

    } catch (error) {
        console.error("HR dashboard error:", error);

        res.status(500).json({
            message: "Server error while fetching HR dashboard"
        });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getEmployeeDashboard,
    getHRDashboard
};
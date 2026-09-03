const express = require("express");

const {
    checkIn,
    checkOut,
    getMyAttendance,
    getEmployeeDashboard,
    getHRDashboard
} = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");
const hrOnly = require("../middleware/hrMiddleware");

const router = express.Router();

router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);
router.get("/my-attendance", protect, getMyAttendance);
router.get("/dashboard", protect, getEmployeeDashboard);
router.get("/hr-dashboard", protect, hrOnly, getHRDashboard);

module.exports = router;
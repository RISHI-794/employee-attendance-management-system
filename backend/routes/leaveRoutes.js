const express = require("express");

const {
    applyLeave,
    getMyLeaves,
    getLeaveBalance,
    getAllLeaves,
    updateLeaveStatus
} = require("../controllers/leaveController");
const protect = require("../middleware/authMiddleware");
const hrOnly = require("../middleware/hrMiddleware");

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/history", protect, getMyLeaves);
router.get("/balance", protect, getLeaveBalance);
router.get("/all", protect, hrOnly, getAllLeaves);

router.put("/:id/status", protect, hrOnly, updateLeaveStatus);
module.exports = router;
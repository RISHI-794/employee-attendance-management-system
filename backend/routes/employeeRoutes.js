const express = require("express");
const router = express.Router();

const { addEmployee,getAllEmployees,deleteEmployee,updateEmployee } = require("../controllers/employeeController");
const protect = require("../middleware/authMiddleware");
const hrOnly = require("../middleware/hrMiddleware");

router.post("/add", protect, hrOnly, addEmployee);
router.get("/all", protect, hrOnly, getAllEmployees);
router.delete("/:id", protect, hrOnly, deleteEmployee);
router.put("/:id", protect, hrOnly, updateEmployee);


module.exports = router;
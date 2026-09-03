const express = require("express");

const {
    registerEmployee,
    loginEmployee
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerEmployee);

router.post("/login", loginEmployee);
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "You are authorized!",
        user: req.user
    });
});

module.exports = router;
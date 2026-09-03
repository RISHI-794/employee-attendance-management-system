const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
},

employeeName: {
    type: String,
    required: true
},

employeeId: {
    type: String,
    required: true
},

employeeDepartment: {
    type: String,
    default: "General"
},

        date: {
            type: Date,
            required: true
        },

        checkIn: {
            type: Date,
            default: null
        },

        checkOut: {
            type: Date,
            default: null
        },

        workingHours: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["Present", "Absent", "Half Day", "Leave"],
            default: "Present"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
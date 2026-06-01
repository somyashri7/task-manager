const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    duration: { type: Number, default: null },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeLog", timeLogSchema);

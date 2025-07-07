import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Event date must be in the future.",
      },
    },
    description: String,

    location: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Institution user
      required: true,
    },

    assignedEducator: {
      educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      requestedAt: {
        type: Date,
        default: Date.now,
      },
      respondedAt: Date,
    },

    assignedResources: [
      {
        resource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource", // 👈 this enables population
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Only student users
      },
    ],
    approvedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    registeredStudentsAttendance: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        present: { type: Boolean, default: false },
        marked: { type: Boolean, default: false },  
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    feedbacks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);

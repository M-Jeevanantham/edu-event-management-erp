// models/EventRequest.js
import mongoose from "mongoose";
const eventRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    preferredDate: Date,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedResources: [
      {
        resource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    approvedEducator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or 'Educator' if you have a separate model
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected","completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const EventRequest = mongoose.model("EventRequest", eventRequestSchema);
export default EventRequest;

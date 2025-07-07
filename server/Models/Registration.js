// models/Registration.js
import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registeredAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  attendance: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Registration', registrationSchema);

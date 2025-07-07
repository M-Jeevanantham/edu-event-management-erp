import mongoose from 'mongoose';

const resourceAssignmentSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  quantityAssigned: { type: Number, required: true },
  assignedAt: { type: Date, default: Date.now },
});

export default mongoose.model('ResourceAssignment', resourceAssignmentSchema);

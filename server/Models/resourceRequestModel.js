import mongoose from 'mongoose';

const resourceRequestSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  educator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedResources: [
    {
      resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date
});

// ✅ Fix overwrite error
export default mongoose.models.ResourceRequest ||
  mongoose.model('ResourceRequest', resourceRequestSchema);

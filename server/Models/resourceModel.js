// models/Resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // equipment, room, material, etc.
  description: { type: String },
  total: { type: Number, required: true },
  available: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);

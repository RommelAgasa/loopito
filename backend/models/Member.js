import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  firstname: { 
    type: String, 
    required: true 
  },
  lastname: { 
    type: String, 
    required: true 
  },
  hasPick: {
    type: Number, 
    required: true,
    default: 0
  },
  isPick: {
    type: Number, 
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Member', memberSchema);

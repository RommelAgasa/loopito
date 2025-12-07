import mongoose from 'mongoose';

const passcodesSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  validityDay: { type: Date, required: true },
  status: { type: Number, required: true, default: 1 }, // 1 = active, 0 = inactive/used
});

export default mongoose.model('Passcode', passcodesSchema);
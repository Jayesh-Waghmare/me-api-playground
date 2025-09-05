import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema({
  company: String,
  role: String,
  start_date: String,
  end_date: String,
  description: String
}, { timestamps: true });

export default mongoose.model('Work', WorkSchema);
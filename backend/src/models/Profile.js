import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  period: String,
  cgpa: Number,
  percentage: Number
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  education: [EducationSchema],
  github: String,
  linkedin: String,
  portfolio: String
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema);
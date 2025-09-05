import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  type: { type: String, default: 'url' },
  url: { type: String, required: true }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  links: [LinkSchema],
  skills: [{ type: String, index: true }]
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
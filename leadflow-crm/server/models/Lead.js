const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'created', 'updated', 'status_changed', 'note_added'
  description: { type: String, required: true },
  performedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, default: '' },
  company: { type: String, trim: true, default: '' },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Outreach', 'Event', 'Other'],
    default: 'Website',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'New',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  value: { type: Number, default: 0 },
  followUpDate: { type: Date, default: null },
  tags: [{ type: String, trim: true }],
  notes: [noteSchema],
  activities: [activitySchema],
  assignedTo: { type: String, default: 'Admin' },
}, { timestamps: true });

leadSchema.index({ name: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Lead', leadSchema);

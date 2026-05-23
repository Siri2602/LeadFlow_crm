const Lead = require('../models/Lead');

// @GET /api/leads
const getLeads = async (req, res) => {
  try {
    const { status, source, priority, search, sort = '-createdAt', page = 1, limit = 50 } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (source && source !== 'All') query.source = source;
    if (priority && priority !== 'All') query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    const leads = await Lead.find(query).sort(sort).limit(limit * 1).skip((page - 1) * limit);
    const total = await Lead.countDocuments(query);
    res.json({ leads, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/leads/stats  (dashboard stats)
const getStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contacted = await Lead.countDocuments({ status: 'Contacted' });
    const proposalSent = await Lead.countDocuments({ status: 'Proposal Sent' });
    const negotiation = await Lead.countDocuments({ status: 'Negotiation' });
    const closedWon = await Lead.countDocuments({ status: 'Closed Won' });
    const closedLost = await Lead.countDocuments({ status: 'Closed Lost' });

    const totalValueAgg = await Lead.aggregate([
      { $match: { status: 'Closed Won' } },
      { $group: { _id: null, sum: { $sum: '$value' } } },
    ]);
    const pipelineValueAgg = await Lead.aggregate([
      { $match: { status: { $in: ['New', 'Contacted', 'Proposal Sent', 'Negotiation'] } } },
      { $group: { _id: null, sum: { $sum: '$value' } } },
    ]);

    const conversionRate = total > 0 ? ((closedWon / total) * 100).toFixed(1) : 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthly = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const bySource = await Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]);
    const byStatus = await Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

    // Follow-up reminders
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 7);
    const overdue = await Lead.countDocuments({ followUpDate: { $lt: today }, status: { $nin: ['Closed Won', 'Closed Lost'] } });
    const upcoming = await Lead.countDocuments({ followUpDate: { $gte: today, $lte: tomorrow }, status: { $nin: ['Closed Won', 'Closed Lost'] } });

    res.json({
      total, newLeads, contacted, proposalSent, negotiation, closedWon, closedLost,
      wonValue: totalValueAgg[0]?.sum || 0,
      pipelineValue: pipelineValueAgg[0]?.sum || 0,
      conversionRate,
      monthly, bySource, byStatus,
      followUps: { overdue, upcoming },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/leads/followups
const getFollowUps = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const overdue = await Lead.find({
      followUpDate: { $lt: today },
      status: { $nin: ['Closed Won', 'Closed Lost'] },
    }).sort('followUpDate').limit(20).select('name company status followUpDate assignedTo');

    const upcoming = await Lead.find({
      followUpDate: { $gte: today, $lte: nextWeek },
      status: { $nin: ['Closed Won', 'Closed Lost'] },
    }).sort('followUpDate').limit(20).select('name company status followUpDate assignedTo');

    res.json({ overdue, upcoming });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/leads/activities  (recent activity timeline)
const getActivities = async (req, res) => {
  try {
    const leads = await Lead.find({ 'activities.0': { $exists: true } })
      .select('name company activities')
      .sort('-updatedAt')
      .limit(30);

    const activities = [];
    leads.forEach(lead => {
      lead.activities.slice(-5).forEach(act => {
        activities.push({
          _id: act._id,
          leadId: lead._id,
          leadName: lead.name,
          company: lead.company,
          action: act.action,
          description: act.description,
          performedBy: act.performedBy,
          createdAt: act.createdAt,
        });
      });
    });

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(activities.slice(0, 25));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/leads/performance  (employee performance)
const getPerformance = async (req, res) => {
  try {
    const performance = await Lead.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalLeads: { $sum: 1 },
          closedWon: { $sum: { $cond: [{ $eq: ['$status', 'Closed Won'] }, 1, 0] } },
          closedLost: { $sum: { $cond: [{ $eq: ['$status', 'Closed Lost'] }, 1, 0] } },
          totalValue: { $sum: { $cond: [{ $eq: ['$status', 'Closed Won'] }, '$value', 0] } },
          pipelineValue: { $sum: { $cond: [{ $in: ['$status', ['New', 'Contacted', 'Proposal Sent', 'Negotiation']] }, '$value', 0] } },
        },
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [
              { $gt: ['$totalLeads', 0] },
              { $multiply: [{ $divide: ['$closedWon', '$totalLeads'] }, 100] },
              0,
            ],
          },
        },
      },
      { $sort: { closedWon: -1 } },
    ]);

    res.json(performance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/leads
const createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    lead.activities.push({
      action: 'created',
      description: `Lead created with status "${lead.status}"`,
      performedBy: req.user?.name || 'Admin',
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @GET /api/leads/:id
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/leads/:id
const updateLead = async (req, res) => {
  try {
    const existing = await Lead.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Lead not found' });

    const statusChanged = req.body.status && req.body.status !== existing.status;

    Object.assign(existing, req.body);

    if (statusChanged) {
      existing.activities.push({
        action: 'status_changed',
        description: `Status changed to "${req.body.status}"`,
        performedBy: req.user?.name || 'Admin',
      });
    } else {
      existing.activities.push({
        action: 'updated',
        description: 'Lead details updated',
        performedBy: req.user?.name || 'Admin',
      });
    }

    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/leads/:id/notes
const addNote = async (req, res) => {
  try {
    const { content, author } = req.body;
    if (!content) return res.status(400).json({ message: 'Note content required' });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.notes.push({ content, author: author || req.user?.name || 'Admin' });
    lead.activities.push({
      action: 'note_added',
      description: `Note added: "${content.slice(0, 60)}${content.length > 60 ? '...' : ''}"`,
      performedBy: req.user?.name || 'Admin',
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/leads/:id/notes/:noteId
const deleteNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.notes = lead.notes.filter(n => n._id.toString() !== req.params.noteId);
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getLeads, getStats, getFollowUps, getActivities, getPerformance,
  createLead, getLead, updateLead, deleteLead, addNote, deleteNote,
};

const express = require('express');
const router = express.Router();
const {
  getLeads, getStats, getFollowUps, getActivities, getPerformance,
  createLead, getLead, updateLead, deleteLead, addNote, deleteNote,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/followups', protect, getFollowUps);
router.get('/activities', protect, getActivities);
router.get('/performance', protect, getPerformance);
router.get('/', protect, getLeads);
router.post('/', protect, createLead);
router.get('/:id', protect, getLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);
router.post('/:id/notes', protect, addNote);
router.delete('/:id/notes/:noteId', protect, deleteNote);

module.exports = router;

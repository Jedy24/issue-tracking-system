const express = require('express');
const Ticket = require('../models/Ticket');
const { authenticate, authorize } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

/** Create ticket */
router.post('/', authenticate, async (req,res) => {
  const { title, description, priority, category } = req.body;
  try {
    const ticket = await Ticket.create({
      title, description, priority, category,
      reporter: req.user._id
    });
    // broadcast via socket
    const io = req.app.get('io');
    io.emit('ticket:created', ticket);
    res.json(ticket);
  } catch(err){ res.status(500).json({ message: err.message }); }
});

/** Get tickets (with simple filters & pagination) */
router.get('/', authenticate, async (req,res) => {
  const { page = 1, limit = 20, status, q } = req.query;
  const filter = {};
  if(status) filter.status = status;
  if(q) filter.$text = { $search: q }; // requires text index optional
  try{
    const tickets = await Ticket.find(filter)
      .populate('reporter', 'name email')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .skip((page-1)*limit).limit(parseInt(limit));
    res.json(tickets);
  }catch(err){ res.status(500).json({ message: err.message }); }
});

/** Get single ticket */
router.get('/:id', authenticate, async (req,res) => {
  try{
    const ticket = await Ticket.findById(req.params.id).populate('reporter assignee').exec();
    if(!ticket) return res.status(404).json({ message:'Not found' });
    res.json(ticket);
  }catch(err){ res.status(500).json({ message: err.message }); }
});

/** Add comment */
router.post('/:id/comments', authenticate, async (req,res) => {
  const { text } = req.body;
  try{
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket) return res.status(404).json({ message:'Not found' });
    ticket.comments.push({ author: req.user._id, text });
    await ticket.save();
    const populated = await Ticket.findById(ticket._id).populate('comments.author', 'name');
    const io = req.app.get('io');
    io.emit('ticket:comment', populated);
    res.json(populated);
  }catch(err){ res.status(500).json({ message: err.message }); }
});

/** Assign ticket (admin or developer) — demonstrates transaction */
router.post('/:id/assign', authenticate, authorize('admin','developer'), async (req,res) => {
  const { assigneeId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    const ticket = await Ticket.findById(req.params.id).session(session);
    if(!ticket) throw new Error('Ticket not found');
    ticket.assignee = assigneeId;
    ticket.status = 'in_progress';
    await ticket.save({ session });
    await session.commitTransaction();
    const updated = await Ticket.findById(ticket._id).populate('assignee reporter');
    req.app.get('io').emit('ticket:updated', updated);
    res.json(updated);
  }catch(err){
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally { session.endSession(); }
});

module.exports = router;

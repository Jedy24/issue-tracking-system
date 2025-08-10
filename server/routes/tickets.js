const express = require('express');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

/** Create ticket */
router.post('/', authenticate, async (req, res) => {
  const { title, description, priority, category } = req.body;
  try {
    const ticket = await Ticket.create({
      title, description, priority, category,
      reporter: req.user._id
    });
    const populatedTicket = await Ticket.findById(ticket._id).populate('reporter', 'name email');
    const io = req.app.get('io');
    io.emit('ticket:created', populatedTicket);
    res.status(201).json(populatedTicket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/** Get tickets based on user role */
router.get('/', authenticate, async (req, res) => {
  const { page = 1, limit = 20, status, q } = req.query;
  const filter = {};

  if (req.user.role === 'admin') {
    // Admin sees all tickets
  } else if (req.user.role === 'developer') {
    // Developer sees tickets assigned to them
    filter.assignee = req.user._id;
  } else {
    // User sees tickets they reported
    filter.reporter = req.user._id;
  }

  if (status) filter.status = status;
  if (q) filter.$text = { $search: q };

  try {
    const tickets = await Ticket.find(filter)
      .populate('reporter', 'name email')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(parseInt(limit));
    res.json(tickets);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/** Get single ticket */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('reporter assignee').exec();
    if (!ticket) return res.status(404).json({ message: 'Not found' });
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/** Assign ticket (admin only) */
router.put('/:id/assign', authenticate, authorize('admin'), async (req, res) => {
  const { assigneeId } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.assignee = assigneeId;
    // Automatically set status to in_progress when assigned, if it was open
    if (ticket.status === 'open') {
      ticket.status = 'in_progress';
    }
    await ticket.save();
    
    const updated = await Ticket.findById(ticket._id).populate('assignee reporter');
    req.app.get('io').emit('ticket:updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** Update ticket status (admin or developer) */
router.put('/:id/status', authenticate, authorize('admin', 'developer'), async (req, res) => {
    const { status } = req.body;
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('reporter assignee');

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        req.app.get('io').emit('ticket:updated', ticket);
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
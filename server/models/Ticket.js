const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  text: String,
  createdAt: { 
    type: Date, default: Date.now 
  }
});

const ticketSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  status: { 
    type: String, 
    enum: ['open','in_progress','done','closed'], 
    default: 'open' 
  },
  priority: { 
    type: String, 
    enum: ['low','medium','high'], 
    default: 'medium' 
  },
  reporter: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required:true 
  },
  assignee: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  comments: [commentSchema],
}, { timestamps:true });

module.exports = mongoose.model('Ticket', ticketSchema);

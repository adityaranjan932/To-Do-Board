const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Done'],
    default: 'Todo'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isBeingEdited: {
    type: Boolean,
    default: false
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  editStartTime: {
    type: Date,
    default: null
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Validate unique title per board (we can extend this for multiple boards later)
taskSchema.index({ title: 1 }, { unique: true });

// Custom validation to ensure title is not a column name
taskSchema.pre('save', function(next) {
  const forbiddenNames = ['todo', 'in progress', 'done', 'Todo', 'In Progress', 'Done'];
  if (forbiddenNames.includes(this.title.toLowerCase())) {
    const error = new Error('Task title cannot match column names (Todo, In Progress, Done)');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);

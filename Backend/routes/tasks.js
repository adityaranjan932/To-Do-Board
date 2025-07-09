const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to log activity
const logActivity = async (action, taskId, taskTitle, userId, username, details, previousValue = null, newValue = null) => {
  try {
    const activity = new Activity({
      action,
      taskId,
      taskTitle,
      userId,
      username,
      details,
      previousValue,
      newValue
    });
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Helper function to update user active tasks count
const updateUserActiveTasksCount = async (userId) => {
  try {
    const activeTasksCount = await Task.countDocuments({ 
      assignedUser: userId, 
      status: { $in: ['Todo', 'In Progress'] }
    });
    await User.findByIdAndUpdate(userId, { activeTasksCount });
  } catch (error) {
    console.error('Error updating user active tasks count:', error);
  }
};

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignedUser', 'username email')
      .populate('createdBy', 'username email')
      .populate('editedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, assignedUser, priority = 'Medium' } = req.body;

    // Check for unique title
    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res.status(400).json({ message: 'Task title must be unique' });
    }

    const task = new Task({
      title,
      description,
      assignedUser: assignedUser || req.user._id,
      createdBy: req.user._id,
      priority
    });

    await task.save();
    await task.populate('assignedUser', 'username email');
    await task.populate('createdBy', 'username email');

    // Update assigned user's active tasks count
    await updateUserActiveTasksCount(task.assignedUser._id);

    // Log activity
    await logActivity(
      'created',
      task._id,
      task.title,
      req.user._id,
      req.user.username,
      `Created task "${task.title}" and assigned to ${task.assignedUser.username}`
    );

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task (with conflict detection)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, assignedUser, version } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId).populate('assignedUser editedBy');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for version conflict
    if (version && task.version !== version) {
      return res.status(409).json({ 
        message: 'Conflict detected: Task has been modified by another user',
        currentTask: task,
        conflict: true
      });
    }

    // Check if task is being edited by another user
    if (task.isBeingEdited && task.editedBy && task.editedBy._id.toString() !== req.user._id.toString()) {
      const timeDiff = Date.now() - new Date(task.editStartTime).getTime();
      if (timeDiff < 30000) { // 30 seconds timeout
        return res.status(409).json({ 
          message: `Task is currently being edited by ${task.editedBy.username}`,
          editedBy: task.editedBy.username,
          conflict: true
        });
      }
    }

    // Store previous values for activity log
    const previousValues = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedUser: task.assignedUser._id
    };

    // Check for unique title if title is being changed
    if (title && title !== task.title) {
      const existingTask = await Task.findOne({ title, _id: { $ne: taskId } });
      if (existingTask) {
        return res.status(400).json({ message: 'Task title must be unique' });
      }
    }

    // Update task
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (assignedUser !== undefined) updates.assignedUser = assignedUser;
    
    updates.lastModified = new Date();
    updates.version = task.version + 1;
    updates.isBeingEdited = false;
    updates.editedBy = null;
    updates.editStartTime = null;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true })
      .populate('assignedUser', 'username email')
      .populate('createdBy', 'username email');

    // Update user active tasks counts if assignment changed
    if (assignedUser && assignedUser !== previousValues.assignedUser.toString()) {
      await updateUserActiveTasksCount(previousValues.assignedUser);
      await updateUserActiveTasksCount(assignedUser);
    } else if (status && status !== previousValues.status) {
      await updateUserActiveTasksCount(updatedTask.assignedUser._id);
    }

    // Log activity based on what changed
    let activityDetails = [];
    if (title && title !== previousValues.title) {
      activityDetails.push(`title from "${previousValues.title}" to "${title}"`);
    }
    if (status && status !== previousValues.status) {
      activityDetails.push(`status from "${previousValues.status}" to "${status}"`);
    }
    if (priority && priority !== previousValues.priority) {
      activityDetails.push(`priority from "${previousValues.priority}" to "${priority}"`);
    }
    if (assignedUser && assignedUser !== previousValues.assignedUser.toString()) {
      const newAssignee = await User.findById(assignedUser);
      const oldAssignee = await User.findById(previousValues.assignedUser);
      activityDetails.push(`assignment from "${oldAssignee.username}" to "${newAssignee.username}"`);
    }

    if (activityDetails.length > 0) {
      await logActivity(
        'updated',
        updatedTask._id,
        updatedTask.title,
        req.user._id,
        req.user.username,
        `Updated ${activityDetails.join(', ')}`,
        previousValues,
        updates
      );
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Start editing a task (for conflict detection)
router.post('/:id/start-edit', auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate('editedBy');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if already being edited
    if (task.isBeingEdited && task.editedBy && task.editedBy._id.toString() !== req.user._id.toString()) {
      const timeDiff = Date.now() - new Date(task.editStartTime).getTime();
      if (timeDiff < 30000) { // 30 seconds timeout
        return res.status(409).json({ 
          message: `Task is currently being edited by ${task.editedBy.username}`,
          editedBy: task.editedBy.username
        });
      }
    }

    await Task.findByIdAndUpdate(taskId, {
      isBeingEdited: true,
      editedBy: req.user._id,
      editStartTime: new Date()
    });

    res.json({ message: 'Started editing task' });
  } catch (error) {
    console.error('Start edit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stop editing a task
router.post('/:id/stop-edit', auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    
    await Task.findByIdAndUpdate(taskId, {
      isBeingEdited: false,
      editedBy: null,
      editStartTime: null
    });

    res.json({ message: 'Stopped editing task' });
  } catch (error) {
    console.error('Stop edit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Smart assign task
router.post('/:id/smart-assign', auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find user with fewest active tasks
    const users = await User.find({}).sort({ activeTasksCount: 1 });
    const smartAssignedUser = users[0];

    const previousAssignee = await User.findById(task.assignedUser);

    // Update task assignment
    task.assignedUser = smartAssignedUser._id;
    task.lastModified = new Date();
    task.version += 1;
    await task.save();

    await task.populate('assignedUser', 'username email');
    await task.populate('createdBy', 'username email');

    // Update user active tasks counts
    await updateUserActiveTasksCount(previousAssignee._id);
    await updateUserActiveTasksCount(smartAssignedUser._id);

    // Log activity
    await logActivity(
      'smart_assigned',
      task._id,
      task.title,
      req.user._id,
      req.user.username,
      `Smart assigned task "${task.title}" from "${previousAssignee.username}" to "${smartAssignedUser.username}" (${smartAssignedUser.activeTasksCount} active tasks)`
    );

    res.json(task);
  } catch (error) {
    console.error('Smart assign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedUser');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Log activity before deletion
    await logActivity(
      'deleted',
      task._id,
      task.title,
      req.user._id,
      req.user.username,
      `Deleted task "${task.title}"`
    );

    // Update assigned user's active tasks count
    await updateUserActiveTasksCount(task.assignedUser._id);

    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

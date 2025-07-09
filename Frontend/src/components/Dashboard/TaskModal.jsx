import React, { useState, useEffect } from 'react';
import '../../css/TaskModal.css';

const TaskModal = ({ task, users, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUser: '',
    priority: 'Medium',
    status: 'Todo'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        assignedUser: task.assignedUser?._id || '',
        priority: task.priority,
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignedUser: '',
        priority: 'Medium',
        status: 'Todo'
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.assignedUser) {
      newErrors.assignedUser = 'Please assign the task to a user';
    }

    // Check for forbidden column names
    const forbiddenNames = ['todo', 'in progress', 'done'];
    if (forbiddenNames.includes(formData.title.toLowerCase())) {
      newErrors.title = 'Task title cannot match column names (Todo, In Progress, Done)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="task-modal">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Task Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Enter task title..."
                maxLength="100"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                placeholder="Enter task description..."
                rows="4"
                maxLength="500"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
              <small className="char-count">
                {formData.description.length}/500 characters
              </small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedUser">Assign To *</label>
              <select
                id="assignedUser"
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleChange}
                className={errors.assignedUser ? 'error' : ''}
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.activeTasksCount} active tasks)
                  </option>
                ))}
              </select>
              {errors.assignedUser && <span className="error-text">{errors.assignedUser}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
          </div>

          {task && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Todo">📝 To Do</option>
                  <option value="In Progress">⚡ In Progress</option>
                  <option value="Done">✅ Done</option>
                </select>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

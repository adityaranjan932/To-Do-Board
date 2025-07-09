import React, { useState } from 'react';
import '../../css/TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onSmartAssign, isDragging = false }) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#e53e3e';
      case 'Medium': return '#dd6b20';
      case 'Low': return '#38a169';
      default: return '#718096';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="task-header">
        <div className="task-priority">
          <span className="priority-icon">{getPriorityIcon(task.priority)}</span>
          <span 
            className="priority-text"
            style={{ color: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
        </div>
        
        {showActions && (
          <div className="task-actions">
            <button
              className="action-btn smart-assign-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSmartAssign(task._id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="Smart Assign"
            >
              🎯
            </button>
            <button
              className="action-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="Edit Task"
            >
              ✏️
            </button>
            <button
              className="action-btn delete-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delete button clicked for task:', task._id);
                if (onDelete && task._id) {
                  onDelete(task._id);
                } else {
                  console.error('onDelete function or task ID is missing', { onDelete, taskId: task._id });
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="Delete Task"
              type="button"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-footer">
        <div className="assignee-info">
          <div className="assignee-avatar">
            {task.assignedUser?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="assignee-name">
            {task.assignedUser?.username || 'Unassigned'}
          </span>
        </div>
        
        <div className="task-meta">
          <span className="task-date">
            {formatDate(task.updatedAt)}
          </span>
        </div>
      </div>

      {task.isBeingEdited && (
        <div className="editing-indicator">
          <span>✏️ Being edited by {task.editedBy?.username}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;

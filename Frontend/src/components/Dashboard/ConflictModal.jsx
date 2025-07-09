import React from 'react';
import '../../css/ConflictModal.css';

const ConflictModal = ({ conflict, onResolve }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onResolve('cancel');
    }
  };

  return (
    <div className="modal-overlay conflict-overlay" onClick={handleOverlayClick}>
      <div className="conflict-modal">
        <div className="conflict-header">
          <div className="conflict-icon">⚠️</div>
          <h2>Conflict Detected</h2>
        </div>

        <div className="conflict-content">
          <p className="conflict-message">{conflict.message}</p>
          
          {conflict.type === 'version_conflict' && (
            <div className="conflict-details">
              <div className="conflict-info">
                <h4>What happened?</h4>
                <p>
                  Another user has modified this task while you were editing it. 
                  This is to prevent data loss and ensure everyone sees the latest changes.
                </p>
              </div>
              
              {conflict.currentTask && (
                <div className="current-task-info">
                  <h4>Current Task State:</h4>
                  <div className="task-preview">
                    <div className="task-field">
                      <strong>Title:</strong> {conflict.currentTask.title}
                    </div>
                    <div className="task-field">
                      <strong>Status:</strong> {conflict.currentTask.status}
                    </div>
                    <div className="task-field">
                      <strong>Priority:</strong> {conflict.currentTask.priority}
                    </div>
                    <div className="task-field">
                      <strong>Assigned to:</strong> {conflict.currentTask.assignedUser?.username}
                    </div>
                    <div className="task-field">
                      <strong>Last modified:</strong> {new Date(conflict.currentTask.lastModified).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {conflict.type === 'editing_conflict' && (
            <div className="conflict-details">
              <div className="conflict-info">
                <h4>Task is being edited</h4>
                <p>
                  {conflict.editedBy} is currently editing this task. 
                  Please wait for them to finish or try again in a moment.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="conflict-actions">
          <button 
            className="cancel-btn"
            onClick={() => onResolve('cancel')}
          >
            Cancel
          </button>
          <button 
            className="reload-btn"
            onClick={() => onResolve('reload')}
          >
            Reload & Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;

import React from 'react';
import '../../css/ActivityPanel.css';

const ActivityPanel = ({ activities }) => {
  const getActivityIcon = (action) => {
    switch (action) {
      case 'created': return '➕';
      case 'updated': return '✏️';
      case 'deleted': return '🗑️';
      case 'assigned': return '👤';
      case 'moved': return '📋';
      case 'smart_assigned': return '🎯';
      default: return '📝';
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case 'created': return '#38a169';
      case 'updated': return '#3182ce';
      case 'deleted': return '#e53e3e';
      case 'assigned': return '#805ad5';
      case 'moved': return '#dd6b20';
      case 'smart_assigned': return '#d69e2e';
      default: return '#718096';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return activityDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="activity-panel">
      <div className="activity-header">
        <h3>📊 Recent Activity</h3>
        <span className="activity-count">{activities.length} recent actions</span>
      </div>

      <div className="activity-list">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity._id} className="activity-item">
              <div 
                className="activity-icon"
                style={{ backgroundColor: getActivityColor(activity.action) }}
              >
                {getActivityIcon(activity.action)}
              </div>
              
              <div className="activity-content">
                <div className="activity-user">
                  {activity.username}
                </div>
                <div className="activity-details">
                  {activity.details}
                </div>
                <div className="activity-time">
                  {formatTime(activity.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-activities">
            <div className="empty-icon">📋</div>
            <p>No recent activity</p>
            <span>Actions will appear here as team members work</span>
          </div>
        )}
      </div>

      <div className="activity-footer">
        <small>Showing last 20 activities</small>
      </div>
    </div>
  );
};

export default ActivityPanel;

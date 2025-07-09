import React from 'react';
import '../../css/Header.css';

const Header = ({ user, onLogout, onCreateTask, onToggleActivity, showActivityPanel }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">
          📋 Collaborative To-Do Board
        </h1>
      </div>
      
      <div className="header-center">
        <button 
          className="create-task-btn"
          onClick={onCreateTask}
        >
          ➕ Add New Task
        </button>
      </div>
      
      <div className="header-right">
        <button 
          className={`activity-toggle-btn ${showActivityPanel ? 'active' : ''}`}
          onClick={onToggleActivity}
        >
          📊 Activity Log
        </button>
        
        <div className="user-menu">
          <div className="user-info">
            <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user.username}</span>
          </div>
          <button 
            className="logout-btn"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

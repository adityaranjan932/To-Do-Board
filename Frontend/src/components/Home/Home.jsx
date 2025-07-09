import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation Header */}
      <nav className="home-nav">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <span className="logo-text">TaskBoard</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-btn login-btn">Sign In</Link>
            <Link to="/register" className="nav-btn signup-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Collaborate in <span className="gradient-text">Real-Time</span>
            </h1>
            <p className="hero-subtitle">
              Transform your team's productivity with TaskBoard - the intelligent 
              collaborative workspace that syncs instantly across all devices.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="cta-primary">
                Start Building Together
                <span className="cta-arrow">→</span>
              </Link>
              <Link to="/login" className="cta-secondary">
                <span className="cta-icon">🚀</span>
                Sign In to Your Workspace
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="kanban-preview">
              <div className="preview-column todo">
                <div className="column-header">📝 To Do</div>
                <div className="preview-card">
                  <div className="card-title">Design Homepage</div>
                  <div className="card-meta">
                    <span className="card-priority high">High</span>
                    <span className="card-user">👤 Alex</span>
                  </div>
                </div>
                <div className="preview-card">
                  <div className="card-title">User Authentication</div>
                  <div className="card-meta">
                    <span className="card-priority medium">Medium</span>
                    <span className="card-user">👤 Sarah</span>
                  </div>
                </div>
              </div>
              <div className="preview-column progress">
                <div className="column-header">⚡ In Progress</div>
                <div className="preview-card active">
                  <div className="card-title">Real-time Sync</div>
                  <div className="card-meta">
                    <span className="card-priority high">High</span>
                    <span className="card-user">👤 John</span>
                  </div>
                </div>
              </div>
              <div className="preview-column done">
                <div className="column-header">✅ Done</div>
                <div className="preview-card">
                  <div className="card-title">Database Setup</div>
                  <div className="card-meta">
                    <span className="card-priority low">Low</span>
                    <span className="card-user">👤 Maria</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-elements">
              <div className="floating-element notification">
                <span className="notification-icon">🔔</span>
                <span className="notification-text">Task updated by Sarah</span>
              </div>
              <div className="floating-element sync-indicator">
                <span className="sync-icon">🔄</span>
                <span className="sync-text">Syncing...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <div className="section-header">
            <h2>Everything Your Team Needs</h2>
            <p>Powerful features designed for modern collaborative workflows</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Collaboration</h3>
              <p>See changes instantly as your team works. No refresh needed.</p>
              <div className="feature-image">
                <div className="realtime-demo">
                  <div className="demo-users">
                    <div className="demo-user active">👤</div>
                    <div className="demo-user">👤</div>
                    <div className="demo-user">👤</div>
                  </div>
                  <div className="demo-activity">Live updates</div>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Assignment</h3>
              <p>Intelligently distribute tasks based on workload and availability.</p>
              <div className="feature-image">
                <div className="smart-assign-demo">
                  <div className="assign-button">Smart Assign</div>
                  <div className="workload-bars">
                    <div className="workload-bar">
                      <div className="bar-fill" style={{width: '30%'}}></div>
                      <span>Alex</span>
                    </div>
                    <div className="workload-bar">
                      <div className="bar-fill" style={{width: '70%'}}></div>
                      <span>Sarah</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Conflict Resolution</h3>
              <p>Advanced conflict detection when multiple users edit simultaneously.</p>
              <div className="feature-image">
                <div className="conflict-demo">
                  <div className="conflict-warning">⚠️ Conflict Detected</div>
                  <div className="conflict-options">
                    <button className="conflict-btn">Merge</button>
                    <button className="conflict-btn">Overwrite</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Activity Tracking</h3>
              <p>Complete audit trail of all changes and team activities.</p>
              <div className="feature-image">
                <div className="activity-demo">
                  <div className="activity-item">
                    <span className="activity-time">2m ago</span>
                    <span className="activity-text">John moved task to Done</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">5m ago</span>
                    <span className="activity-text">Sarah created new task</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Workflow?</h2>
          <p>Join thousands of teams already collaborating more effectively with our intelligent task management platform.</p>
          <div className="cta-actions">
            <Link to="/register" className="cta-primary large">
              Get Started Free
              <span className="cta-arrow">→</span>
            </Link>
            <div className="cta-features">
              <div className="cta-feature-item">
                <span className="cta-feature-icon">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="cta-feature-item">
                <span className="cta-feature-icon">⚡</span>
                <span>Real-time collaboration</span>
              </div>
              <div className="cta-feature-item">
                <span className="cta-feature-icon">🎯</span>
                <span>Smart task assignment</span>
              </div>
              <div className="cta-feature-item">
                <span className="cta-feature-icon">🔒</span>
                <span>Secure & reliable</span>
              </div>
            </div>
          </div>
        </div>
        <div className="cta-visual">
          <div className="collaboration-illustration">
            <div className="collab-users">
              <div className="collab-user user-1">👨‍💻</div>
              <div className="collab-user user-2">👩‍💻</div>
              <div className="collab-user user-3">👨‍💼</div>
            </div>
            <div className="collab-connections">
              <div className="connection line-1"></div>
              <div className="connection line-2"></div>
              <div className="connection line-3"></div>
            </div>
            <div className="collab-board">
              <div className="board-header">TaskBoard</div>
              <div className="board-columns">
                <div className="mini-column"></div>
                <div className="mini-column"></div>
                <div className="mini-column"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">📋</span>
            <span className="logo-text">TaskBoard</span>
          </div>
          <div className="footer-text">
            <p>Built for teams that move fast and think together.</p>
            <p className="footer-copyright">© 2025 TaskBoard. Crafted with passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
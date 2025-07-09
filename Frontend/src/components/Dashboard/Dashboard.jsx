import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import Header from './Header';
import KanbanBoard from './KanbanBoard';
import ActivityPanel from './ActivityPanel';
import TaskModal from './TaskModal';
import ConflictModal from './ConflictModal';
import axios from 'axios';
import '../../css/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActivityPanel, setShowActivityPanel] = useState(false);

  const { user, logout } = useAuth();
  const { socket } = useSocket();

  // Fetch initial data
  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchActivities();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('task-created', (newTask) => {
      setTasks(prev => [newTask, ...prev]);
    });

    socket.on('task-updated', (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ));
    });

    socket.on('task-deleted', (deletedTaskId) => {
      setTasks(prev => prev.filter(task => task._id !== deletedTaskId));
    });

    socket.on('activity-logged', (newActivity) => {
      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    });

    socket.on('task-editing', (data) => {
      // Handle conflict notification
      if (data.conflict && data.taskId === editingTask?._id) {
        setConflict(data);
      }
    });

    return () => {
      socket.off('task-created');
      socket.off('task-updated');
      socket.off('task-deleted');
      socket.off('activity-logged');
      socket.off('task-editing');
    };
  }, [socket, editingTask]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/activity');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleTaskModalClose = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        // Update task
        const response = await axios.put(`/tasks/${editingTask._id}`, {
          ...taskData,
          version: editingTask.version
        });
        
        setTasks(prev => prev.map(task => 
          task._id === editingTask._id ? response.data : task
        ));

        // Emit socket event
        socket?.emit('task-updated', response.data);
      } else {
        // Create new task
        const response = await axios.post('/tasks', taskData);
        setTasks(prev => [response.data, ...prev]);

        // Emit socket event
        socket?.emit('task-created', response.data);
      }
      
      handleTaskModalClose();
      fetchActivities(); // Refresh activities
    } catch (error) {
      if (error.response?.status === 409) {
        // Handle conflict
        setConflict({
          type: 'version_conflict',
          message: error.response.data.message,
          currentTask: error.response.data.currentTask
        });
      } else {
        console.error('Error saving task:', error);
        alert(error.response?.data?.message || 'Error saving task');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      console.error('No task ID provided for deletion');
      alert('Error: Invalid task ID');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this task? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      console.log('Deleting task with ID:', taskId);
      const response = await axios.delete(`/tasks/${taskId}`);
      console.log('Delete response:', response);
      
      // Update local state immediately
      setTasks(prev => {
        const filteredTasks = prev.filter(task => task._id !== taskId);
        console.log('Updated tasks after deletion:', filteredTasks);
        return filteredTasks;
      });
      
      // Emit socket event
      if (socket) {
        socket.emit('task-deleted', taskId);
        console.log('Emitted task-deleted event');
      }
      
      // Refresh activities
      fetchActivities();
      
      // Show success message
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      console.error('Error details:', error.response?.data);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to delete task. Please try again.';
      alert(`Error deleting task: ${errorMessage}`);
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const response = await axios.post(`/tasks/${taskId}/smart-assign`);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? response.data : task
      ));
      
      // Emit socket event
      socket?.emit('task-updated', response.data);
      
      fetchUsers(); // Refresh user active task counts
      fetchActivities(); // Refresh activities
    } catch (error) {
      console.error('Error smart assigning task:', error);
      alert('Error smart assigning task');
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    try {
      const newStatus = destination.droppableId;
      const response = await axios.put(`/tasks/${draggableId}`, {
        ...task,
        status: newStatus,
        version: task.version
      });

      setTasks(prev => prev.map(t => 
        t._id === draggableId ? response.data : t
      ));

      // Emit socket event
      socket?.emit('task-updated', response.data);
      
      fetchActivities(); // Refresh activities
    } catch (error) {
      console.error('Error updating task status:', error);
      fetchTasks(); // Revert changes
    }
  };

  const handleConflictResolve = (resolution) => {
    if (resolution === 'reload') {
      fetchTasks();
      handleTaskModalClose();
    }
    setConflict(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header 
        user={user}
        onLogout={logout}
        onCreateTask={handleCreateTask}
        onToggleActivity={() => setShowActivityPanel(!showActivityPanel)}
        showActivityPanel={showActivityPanel}
      />
      
      <div className="dashboard-content">
        <div className={`main-content ${showActivityPanel ? 'with-sidebar' : ''}`}>
          <KanbanBoard
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onSmartAssign={handleSmartAssign}
            onDragEnd={handleDragEnd}
          />
        </div>
        
        {showActivityPanel && (
          <div className="sidebar">
            <ActivityPanel activities={activities} />
          </div>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          users={users}
          onSave={handleTaskSave}
          onClose={handleTaskModalClose}
        />
      )}

      {conflict && (
        <ConflictModal
          conflict={conflict}
          onResolve={handleConflictResolve}
        />
      )}
    </div>
  );
};

export default Dashboard;

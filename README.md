# 📋 Real-Time Collaborative To-Do Board

A modern, real-time collaborative task management application built with the MERN stack. This application allows multiple users to create, manage, and track tasks in real-time with a beautiful Kanban-style interface.

## 🌐 Live Demo

- **🚀 Live Application**: [https://to-do-board-frontend.onrender.com](https://to-do-board-frontend.onrender.com)
- **🎥 Demo Video**: [Watch on YouTube](https://www.youtube.com/watch?v=b8FU9pfbzPk)

## 🌟 Features

### ✨ Core Functionality
- **Real-time Collaboration**: See changes instantly as team members work
- **Kanban Board**: Drag-and-drop interface with Todo, In Progress, and Done columns
- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, edit, delete, and assign tasks
- **Smart Assignment**: Automatically assign tasks to users with the least workload
- **Conflict Resolution**: Handle simultaneous edits gracefully
- **Activity Logging**: Track all changes with a live activity feed

### 🎨 User Experience
- **Custom UI**: Built from scratch without third-party CSS frameworks
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Custom animations for drag-drop and UI interactions
- **Real-time Updates**: Live sync across all connected users
- **Conflict Handling**: Smart detection and resolution of editing conflicts

### 🔧 Technical Features
- **WebSocket Integration**: Real-time communication using Socket.IO
- **MongoDB Database**: Robust data storage with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured backend API
- **Activity Tracking**: Complete audit trail of all actions

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Beautiful DnD** - Drag and drop functionality

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm package manager

### Backend Setup
1. Navigate to Backend directory: `cd Backend`
2. Install dependencies: `npm install`
3. Create `.env` file with your MongoDB URI and JWT secret
4. Start development server: `npm run dev`
5. Backend runs on `http://localhost:5000`

### Frontend Setup
1. Navigate to Frontend directory: `cd Frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Frontend runs on `http://localhost:5173`

### Database Setup
- MongoDB will automatically create the `todoboard` database
- No manual database configuration required

## 🎯 Usage Guide

### Getting Started
1. **Register/Login**: Create an account or sign in
2. **Create Tasks**: Click "Add New Task" to create your first task
3. **Manage Tasks**: Drag tasks between columns or use edit/delete actions
4. **Smart Assign**: Use the 🎯 button to automatically assign tasks
5. **Activity Log**: Toggle the activity panel to see real-time updates

## 🧠 Smart Assign Logic

The Smart Assign feature automatically distributes tasks to balance workload across team members:

**Algorithm:**
1. Counts active tasks (Todo + In Progress) for each user
2. Assigns new task to user with fewest active tasks
3. Ensures fair workload distribution
4. Logs assignment activity for transparency

**Benefits:**
- Prevents task overload on individual users
- Automated workload balancing
- Transparent assignment tracking

## ⚡ Conflict Handling System

Real-time conflict detection and resolution for simultaneous editing:

**How it works:**
1. **Edit Locking**: Users see when others are editing the same task
2. **Version Control**: System tracks task versions to detect conflicts
3. **Smart Resolution**: Users get current state and can choose to cancel or retry
4. **Data Integrity**: Prevents data loss through atomic updates

**Example:**
- User A starts editing a task
- User B sees "Task currently being edited by User A"
- If both submit changes, conflict modal shows latest data
- Users can make informed decisions to prevent data loss

---

**Built with ❤️ using the MERN Stack**

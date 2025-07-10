# 📋 Real-Time Collaborative To-Do Board

A modern, real-time collaborative task management application built with the MERN stack. This application allows multiple users to create, manage, and track tasks in real-time with a beautiful Kanban-style interface.

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
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install bcryptjs cors jsonwebtoken socket.io
   ```

3. **Environment Configuration**
   - The `.env` file is already configured
   - Update `MONGODB_URI` if using a different MongoDB connection
   - Change `JWT_SECRET` for production

4. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install react-router-dom socket.io-client axios react-beautiful-dnd
   ```

3. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Database Setup
- Ensure MongoDB is running locally on port 27017
- The application will automatically create the `todoboard` database
- No manual database setup required

## 🎯 Usage Guide

### Getting Started
1. **Register/Login**: Create an account or sign in
2. **Create Tasks**: Click "Add New Task" to create your first task
3. **Manage Tasks**: Drag tasks between columns or use edit/delete actions
4. **Smart Assign**: Use the 🎯 button to automatically assign tasks
5. **Activity Log**: Toggle the activity panel to see real-time updates

### Key Features Usage

#### Smart Assign Logic
The Smart Assign feature automatically assigns tasks to the user with the fewest active tasks (Todo + In Progress). This ensures balanced workload distribution across team members.

**How it works:**
1. Click the 🎯 Smart Assign button on any task
2. System calculates active task count for each user
3. Task is automatically assigned to user with lowest count
4. Activity is logged for transparency

#### Conflict Handling
When multiple users edit the same task simultaneously:

1. **Detection**: System detects version conflicts
2. **Prevention**: Users are warned if someone else is editing
3. **Resolution**: Conflicting users see current state and can choose to:
   - Cancel their changes
   - Reload and try again with latest data

**Example Scenario:**
- User A starts editing Task #1
- User B tries to edit the same task
- User B sees: "Task is currently being edited by User A"
- If both submit changes, version conflict is detected
- Both users get resolution options

#### Real-time Features
- **Live Updates**: See task changes instantly
- **User Awareness**: Know when others are editing
- **Activity Feed**: Real-time log of all actions
- **Status Sync**: Drag-drop changes sync immediately

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/smart-assign` - Smart assign task
- `POST /api/tasks/:id/start-edit` - Start editing (conflict detection)
- `POST /api/tasks/:id/stop-edit` - Stop editing

### Activity
- `GET /api/activity` - Get recent activities
- `GET /api/activity/task/:taskId` - Get task-specific activities

#### Backend Setup
1. **Navigate to Backend Directory**
   ```bash
   cd Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

   ```

4. **Start the Backend Server**
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. **Navigate to Frontend Directory**
   ```bash
   cd Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   The `.env.local` file is configured for local development.
   For production builds, `.env.production` contains production URLs.

4. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```

### Dual Environment Support
The application automatically detects whether it's running in development or production mode:

- **Local Development**: Uses `localhost` URLs for API and Socket connections
- **Production**: Uses Render deployment URLs
- **Build Commands**: 
  - `npm run dev` - Local development
  - `npm run build` - Production build
  - `npm run build:local` - Local build for testing

## 🎬 Demo Video

*[Video will be created and linked here]*

The demo video showcases:
- User registration and login
- Real-time task creation and management
- Drag-and-drop functionality
- Smart assign feature
- Conflict resolution in action
- Activity logging
- Mobile responsiveness

## 📝 Logic Document

### Smart Assign Implementation

The Smart Assign feature distributes workload fairly across team members by:

1. **Counting Active Tasks**: For each user, count tasks in "Todo" and "In Progress" status
2. **Finding Minimum**: Identify user(s) with the lowest active task count
3. **Assignment**: Assign the task to the first user with minimum tasks
4. **Update Counters**: Increment the assigned user's active task count
5. **Logging**: Record the smart assignment action with details

**Benefits:**
- Prevents task overload on specific users
- Ensures fair distribution of work
- Saves time on manual assignment decisions
- Provides transparency through activity logging

### Conflict Handling System

The conflict detection and resolution system works through:

1. **Version Tracking**: Each task has a version number that increments on updates
2. **Edit Locking**: When a user starts editing, the task is marked as "being edited"
3. **Conflict Detection**: Before saving, system checks if version has changed
4. **User Notification**: Conflicting users are presented with current state
5. **Resolution Options**: Users can choose to cancel or retry with latest data

**Conflict Types Handled:**
- Simultaneous editing (edit locking)
- Version conflicts (data divergence)
- Race conditions (atomic updates)

**Resolution Strategies:**
- Show current task state to users
- Allow informed decision making
- Prevent data loss through warnings
- Maintain data integrity through version control

## 🤝 Contributing

This project was built as an assignment demonstration. For educational purposes, feel free to:
- Fork the repository
- Experiment with new features
- Improve the UI/UX
- Add additional functionality

## 📄 License

This project is created for educational purposes as part of a coding assignment.



Built with ❤️ using the MERN Stack

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', status: 'To-Do', due_date: '' });

  useEffect(() => {
    axios.get(API_URL).then(res => setTasks(res.data));
  }, []);

  const addTask = () => {
    if (!form.name.trim()) return;
    axios.post(API_URL, form).then(() => {
      window.location.reload();
    });
  };

  const updateStatus = (id, status) => {
    axios.put(`${API_URL}/${id}`, { status }).then(() => window.location.reload());
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => window.location.reload());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'To-Do':
        return 'status-todo';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-todo';
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1 className="logo-text">Task Tracker</h1>
          </div>
        </header>

        <div className="form-container">
          <h2 className="form-title">Add New Task</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Task Name</label>
              <input 
                type="text"
                placeholder="Enter task name" 
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input 
                type="text"
                placeholder="Enter task description" 
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option>To-Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })} 
              />
            </div>
          </div>
          <button 
            onClick={addTask} 
            className="add-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Task
          </button>
        </div>

        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <p className="empty-text">No tasks yet. Add your first task to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h2 className="task-title">{task.name}</h2>
                  <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span>
                </div>
                <p className="task-description">{task.description || 'No description provided'}</p>
                <div className="task-meta">
                  <div className="meta-item">
                    <span className="meta-label">Due Date:</span>
                    <span className="meta-value">{formatDate(task.due_date)}</span>
                  </div>
                </div>
                <div className="task-actions">
                  <select 
                    value={task.status} 
                    onChange={e => updateStatus(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option>To-Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="delete-button"
                    aria-label="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';
import { LogOut, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { sendEmailFromFrontend } from '../services/emailService';

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getMyTasks();
      setTasks(response.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.isVerified) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [user._id, user.isVerified]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      toast.success('Task updated! Pending admin verification.');
      
      if (newStatus === 'completed') {
        const task = tasks.find(t => t._id === taskId);
        sendEmailFromFrontend(
          process.env.REACT_APP_ADMIN_EMAIL || 'ajith66310@gmail.com', 
          "Task Completed by User", 
          `The task "${task.title}" has been marked as completed by ${user.name} and is waiting for your verification.`
        );
      }
      
      fetchTasks();
    } catch (err) {
      toast.error('Update failed');
    }
  };


  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div>
      <nav className="glass navbar">
        <div className="logo">TaskFlow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{user.name}</span>
          {!user.isVerified && <span className="badge badge-pending">Pending Verification</span>}
          <button className="btn btn-primary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <header style={{ marginBottom: '2rem' }}>
          <h1>My Assigned Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your tasks and track progress</p>
        </header>

        {!user.isVerified ? (
          <div className="glass card" style={{ textAlign: 'center', padding: '3rem' }}>
            <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
            <h2>Verification Required</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Your account is waiting for admin approval. You will be able to manage tasks once verified.
            </p>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.length === 0 ? (
              <p>No tasks assigned yet.</p>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="glass card task-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{task.title}</h3>
                    {task.isVerifiedByAdmin ? (
                      <CheckCircle size={20} color="var(--success)" title="Verified by Admin" />
                    ) : (
                      <Clock size={20} color="var(--warning)" title="Pending Admin Verification" />
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span className={`badge badge-${task.status}`}>{task.status}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update Status:</label>
                    <select 
                      className="input" 
                      style={{ marginTop: '0.5rem', marginBottom: 0 }}
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                      disabled={task.status === "completed"}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

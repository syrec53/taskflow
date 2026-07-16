import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import KanbanBoard from '../components/KanbanBoard';

export default function Board() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get(`/tasks/${projectId}`),
      ]);
      const found = projectsRes.data.find((p) => p._id === projectId);
      if (!found) {
        navigate('/dashboard');
        return;
      }
      setProject(found);
      setTasks(tasksRes.data);
    } catch (err) {
      setError('Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTaskCreate = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  const handleTaskDelete = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  if (loading) {
    return (
      <div className="board-page">
        <div className="spinner-wrap" style={{ height: '60vh' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="board-page">
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <p className="empty-title">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="board-page">
      {/* Board Header */}
      <div className="board-header">
        <div className="board-header-left">
          <button
            id="back-to-dashboard-btn"
            className="board-back"
            onClick={() => navigate('/dashboard')}
          >
            ← Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              className="board-dot"
              style={{ background: project?.color || '#6366f1' }}
            />
            <h1 className="board-title">{project?.name}</h1>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        projectId={projectId}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
}

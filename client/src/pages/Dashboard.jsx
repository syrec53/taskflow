import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProjectModal from '../components/ProjectModal';

const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#10b981', '#14b8a6',
  '#0ea5e9', '#64748b',
];

const PROJECT_EMOJIS = ['🚀', '💼', '🎯', '🌟', '🔥', '💡', '🎨', '📊', '🛠️', '🌈'];

function getEmoji(name) {
  const idx = name.charCodeAt(0) % PROJECT_EMOJIS.length;
  return PROJECT_EMOJIS[idx];
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [taskCounts, setTaskCounts] = useState({});

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
      // Fetch task counts in parallel
      const counts = await Promise.all(
        data.map((p) =>
          api.get(`/tasks/${p._id}`).then((r) => ({ id: p._id, count: r.data.length })).catch(() => ({ id: p._id, count: 0 }))
        )
      );
      const countMap = {};
      counts.forEach(({ id, count }) => { countMap[id] = count; });
      setTaskCounts(countMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting project');
    }
  };

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditProject(project);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditProject(null);
  };

  const handleModalSave = async ({ name, description, color }) => {
    try {
      if (editProject) {
        const { data } = await api.put(`/projects/${editProject._id}`, { name, description, color });
        setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      } else {
        const { data } = await api.post('/projects', { name, description, color });
        setProjects((prev) => [data, ...prev]);
        setTaskCounts((prev) => ({ ...prev, [data._id]: 0 }));
      }
      handleModalClose();
    } catch (err) {
      return err.response?.data?.message || 'Error saving project';
    }
  };

  const totalTasks = Object.values(taskCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '36px', paddingBottom: '40px' }}>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Good {getGreeting()},{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user?.name?.split(' ')[0]}
              </span>{' '}
              👋
            </h1>
            <p className="dashboard-subtitle">Here's what's happening with your projects.</p>
          </div>
          <button id="new-project-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
            ＋ New Project
          </button>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">{projects.length}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {projects.length > 0 ? Math.round(totalTasks / projects.length) : 0}
            </span>
            <span className="stat-label">Avg. Tasks/Project</span>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="projects-grid">
            {/* New Project Card */}
            <div
              id="create-project-card"
              className="project-card-new"
              onClick={() => setShowModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowModal(true)}
            >
              <div className="project-card-new-icon">＋</div>
              <span>Create New Project</span>
            </div>

            {projects.map((project) => (
              <div
                key={project._id}
                id={`project-card-${project._id}`}
                className="project-card"
                style={{ '--card-color': project.color }}
                onClick={() => navigate(`/board/${project._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/board/${project._id}`)}
              >
                <div className="project-card-header">
                  <div
                    className="project-icon"
                    style={{ background: project.color + '22', color: project.color }}
                  >
                    {getEmoji(project.name)}
                  </div>
                  <div className="project-card-actions">
                    <button
                      className="btn-icon"
                      title="Edit project"
                      onClick={(e) => handleEdit(e, project)}
                      aria-label="Edit project"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      title="Delete project"
                      onClick={(e) => handleDelete(e, project._id)}
                      style={{ color: 'var(--danger)' }}
                      aria-label="Delete project"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h2 className="project-name">{project.name}</h2>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}

                <div className="project-footer">
                  <span className="project-date">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="project-task-count">
                    {taskCounts[project._id] ?? '—'} tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="empty-state" style={{ marginTop: '40px' }}>
            <span className="empty-icon">🚀</span>
            <p className="empty-title">No projects yet</p>
            <p className="empty-desc">
              Create your first project to get started.<br />
              Each project gets its own Kanban board.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          project={editProject}
          colors={PROJECT_COLORS}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

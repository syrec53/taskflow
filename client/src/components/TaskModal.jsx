import { useState } from 'react';

export default function TaskModal({ task, defaultStatus, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    assignedTo: task?.assignedTo || '',
    status: task?.status || defaultStatus || 'todo',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }
    setSaving(true);
    const err = await onSave(form);
    if (err) {
      setError(err);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Task form">
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button id="task-modal-close" className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="form-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                className="form-input"
                name="title"
                type="text"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={handleChange}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                className="form-input"
                name="description"
                placeholder="Add more details (optional)"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  className="form-input"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="form-input"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-assigned">Assigned To</label>
              <input
                id="task-assigned"
                className="form-input"
                name="assignedTo"
                type="text"
                placeholder="Team member name (optional)"
                value={form.assignedTo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              id="task-modal-cancel"
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="task-modal-save"
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

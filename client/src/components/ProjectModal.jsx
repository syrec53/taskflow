import { useState } from 'react';

export default function ProjectModal({ project, colors, onClose, onSave }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    color: project?.color || colors[0],
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Project name is required');
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
      <div className="modal" role="dialog" aria-modal="true" aria-label="Project form">
        <div className="modal-header">
          <h2 className="modal-title">{project ? 'Edit Project' : 'New Project'}</h2>
          <button id="project-modal-close" className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="form-error"><span>⚠️</span> {error}</div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="proj-name">Project Name *</label>
              <input
                id="proj-name"
                className="form-input"
                name="name"
                type="text"
                placeholder="e.g. Marketing Campaign"
                value={form.name}
                onChange={handleChange}
                autoFocus
                maxLength={80}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-desc">Description</label>
              <textarea
                id="proj-desc"
                className="form-input"
                name="description"
                placeholder="What is this project about? (optional)"
                value={form.description}
                onChange={handleChange}
                rows={3}
                maxLength={300}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accent Color</label>
              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${form.color === color ? 'selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => setForm((prev) => ({ ...prev, color }))}
                    aria-label={`Select color ${color}`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button id="proj-modal-cancel" type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button id="proj-modal-save" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

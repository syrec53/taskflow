export default function TaskCard({ task, isDragging, onEdit, onDelete }) {
  return (
    <div className={`task-card ${isDragging ? 'task-card-dragging' : ''}`}>
      <p className="task-card-title">{task.title}</p>
      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}
      <div className="task-card-footer">
        <span className={`task-priority ${task.priority}`}>
          {task.priority}
        </span>
        <div className="task-actions">
          <button
            className="task-action-btn"
            onClick={onEdit}
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            className="task-action-btn delete"
            onClick={onDelete}
            title="Delete task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

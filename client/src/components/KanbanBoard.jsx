import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const COLUMNS = [
  { id: 'todo', label: 'To Do', dotClass: 'todo' },
  { id: 'inprogress', label: 'In Progress', dotClass: 'inprogress' },
  { id: 'done', label: 'Done', dotClass: 'done' },
];

export default function KanbanBoard({ tasks, projectId, onTaskCreate, onTaskUpdate, onTaskDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    // Optimistic update
    const updatedTask = { ...task, status: newStatus, order: destination.index };
    onTaskUpdate(updatedTask);

    // Persist to API
    try {
      const { data } = await api.put(`/tasks/${draggableId}`, {
        status: newStatus,
        order: destination.index,
      });
      onTaskUpdate(data);
    } catch (err) {
      // Revert on error
      onTaskUpdate(task);
      console.error('Failed to update task:', err);
    }
  };

  const openCreateModal = (status) => {
    setDefaultStatus(status);
    setEditTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleModalSave = async ({ title, description, priority, assignedTo, status }) => {
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, {
          title, description, priority, assignedTo, status,
        });
        onTaskUpdate(data);
      } else {
        const { data } = await api.post('/tasks', {
          title, description, priority, assignedTo,
          status: defaultStatus,
          projectId,
        });
        onTaskCreate(data);
      }
      setModalOpen(false);
      setEditTask(null);
    } catch (err) {
      return err.response?.data?.message || 'Failed to save task';
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      onTaskDelete(taskId);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting task');
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-container">
          {COLUMNS.map((col) => {
            const colTasks = getColumnTasks(col.id);
            return (
              <div key={col.id} className="kanban-column">
                <div className="kanban-column-header">
                  <div className={`kanban-column-title ${col.id}`}>
                    <span className={`col-dot ${col.dotClass}`} />
                    {col.label}
                  </div>
                  <span className="kanban-count">{colTasks.length}</span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      className="kanban-tasks"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        background: snapshot.isDraggingOver
                          ? 'rgba(99,102,241,0.05)'
                          : undefined,
                      }}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                isDragging={snapshot.isDragging}
                                onEdit={() => openEditModal(task)}
                                onDelete={() => handleDelete(task._id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <button
                  id={`add-task-${col.id}-btn`}
                  className="kanban-add-btn"
                  onClick={() => openCreateModal(col.id)}
                >
                  ＋ Add task
                </button>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {modalOpen && (
        <TaskModal
          task={editTask}
          defaultStatus={defaultStatus}
          onClose={() => { setModalOpen(false); setEditTask(null); }}
          onSave={handleModalSave}
        />
      )}
    </>
  );
}

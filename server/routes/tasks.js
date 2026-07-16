const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Helper: verify project belongs to user
const verifyProjectOwner = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  return project;
};

// @route   GET /api/tasks/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/:projectId', async (req, res) => {
  try {
    const project = await verifyProjectOwner(req.params.projectId, req.user._id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId }).sort({ order: 1, createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
  const { title, description, status, priority, projectId, assignedTo } = req.body;

  try {
    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    const project = await verifyProjectOwner(projectId, req.user._id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get the max order for this status column
    const lastTask = await Task.findOne({ project: projectId, status: status || 'todo' })
      .sort({ order: -1 })
      .select('order');
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      project: projectId,
      assignedTo: assignedTo || '',
      order,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (title, description, status, order, priority)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership via project
    const project = await verifyProjectOwner(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, status, priority, order, assignedTo } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (order !== undefined) task.order = order;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await verifyProjectOwner(task.project, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

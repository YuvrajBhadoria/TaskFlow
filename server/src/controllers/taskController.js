const mongoose = require('mongoose');
const Task = require('../models/Task');

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all tasks for current authenticated user
// @route   GET /api/tasks
// @query   search, status, priority, sortBy, order
exports.getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Base query scoped to authenticated user
    const query = { owner: req.user._id };

    // Search by title or description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Filter by status ('pending' | 'completed')
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by priority ('low' | 'medium' | 'high')
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Sorting
    const sortOptions = {};
    const sortField = ['createdAt', 'dueDate', 'title', 'priority', 'status'].includes(sortBy)
      ? sortBy
      : 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;
    sortOptions[sortField] = sortDirection;

    const tasks = await Task.find(query).sort(sortOptions);

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: 'Invalid task ID format',
          code: 'INVALID_ID'
        }
      });
    }

    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND'
        }
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    // Validate title presence and non-whitespace
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: {
          message: 'Title is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Validate priority if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        error: {
          message: "Priority must be 'low', 'medium', or 'high'",
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Validate status if provided
    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({
        error: {
          message: "Status must be 'pending' or 'completed'",
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Create task strictly assigned to the authenticated user
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      owner: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PATCH /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: 'Invalid task ID format',
          code: 'INVALID_ID'
        }
      });
    }

    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          error: {
            message: 'Title cannot be empty',
            code: 'VALIDATION_ERROR'
          }
        });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = typeof description === 'string' ? description.trim() : '';
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({
          error: {
            message: "Priority must be 'low', 'medium', or 'high'",
            code: 'VALIDATION_ERROR'
          }
        });
      }
      task.priority = priority;
    }

    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({
          error: {
            message: "Status must be 'pending' or 'completed'",
            code: 'VALIDATION_ERROR'
          }
        });
      }
      task.status = status;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: 'Invalid task ID format',
          code: 'INVALID_ID'
        }
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND'
        }
      });
    }

    // 204 No Content per specification
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/tasks/stats/summary
exports.getTaskStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [total, pending, completed] = await Promise.all([
      Task.countDocuments({ owner: ownerId }),
      Task.countDocuments({ owner: ownerId, status: 'pending' }),
      Task.countDocuments({ owner: ownerId, status: 'completed' })
    ]);

    res.status(200).json({
      total,
      pending,
      completed
    });
  } catch (error) {
    next(error);
  }
};

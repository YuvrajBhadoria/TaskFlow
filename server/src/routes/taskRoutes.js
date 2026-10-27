const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all task endpoints with authentication
router.use(authMiddleware);

// Stats route must be defined before /:id to prevent matching 'stats' as an id
router.get('/stats/summary', taskController.getTaskStats);

router.route('/')
  .get(taskController.getTasks)
  .post(taskController.createTask);

router.route('/:id')
  .get(taskController.getTaskById)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;

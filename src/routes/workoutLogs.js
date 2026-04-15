import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createWorkoutLogHandler,
  getAllWorkoutLogsHandler,
  getWorkoutLogByIdHandler,
  updateWorkoutLogHandler,
  deleteWorkoutLogHandler
} from '../controllers/workoutLogController.js';

const router = express.Router();

// All workout log routes require authentication
router.use(authenticate);

router.post('/', createWorkoutLogHandler);
router.get('/', getAllWorkoutLogsHandler);
router.get('/:id', getWorkoutLogByIdHandler);
router.put('/:id', updateWorkoutLogHandler);
router.delete('/:id', deleteWorkoutLogHandler);

export default router;

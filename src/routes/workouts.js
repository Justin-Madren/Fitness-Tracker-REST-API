import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createWorkoutHandler,
  getUserWorkoutsHandler,
  getWorkoutByIdHandler,
  updateWorkoutHandler,
  deleteWorkoutHandler
} from '../controllers/workoutController.js';

const router = express.Router();

// All workout routes require authentication
router.use(authenticate);

router.post('/', createWorkoutHandler);
router.get('/', getUserWorkoutsHandler);
router.get('/:id', getWorkoutByIdHandler);
router.put('/:id', updateWorkoutHandler);
router.delete('/:id', deleteWorkoutHandler);

export default router;

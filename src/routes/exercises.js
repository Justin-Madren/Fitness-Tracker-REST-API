import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createExerciseHandler,
  getUserExercisesHandler,
  getExerciseByIdHandler,
  updateExerciseHandler,
  deleteExerciseHandler
} from '../controllers/exerciseController.js';

const router = express.Router();

// All exercise routes require authentication
router.use(authenticate);

router.post('/', createExerciseHandler);
router.get('/', getUserExercisesHandler);
router.get('/:id', getExerciseByIdHandler);
router.put('/:id', updateExerciseHandler);
router.delete('/:id', deleteExerciseHandler);

export default router;

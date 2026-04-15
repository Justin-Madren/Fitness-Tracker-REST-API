import * as exerciseService from '../services/exerciseService.js';

export const createExerciseHandler = async (req, res, next) => {
  try {
    const { name, muscle_group, type, default_sets, default_reps } = req.body;
    const userId = req.user.userId;

    const exercise = await exerciseService.createExercise(
      userId,
      name,
      muscle_group,
      type,
      default_sets,
      default_reps
    );
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const getUserExercisesHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const exercises = await exerciseService.getUserExercises(userId);
    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
};

export const getExerciseByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const exercise = await exerciseService.getExerciseById(parseInt(id));

    if (exercise.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own exercises' });
    }

    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const updateExerciseHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const exercise = await exerciseService.updateExercise(userId, parseInt(id), updates);
    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const deleteExerciseHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await exerciseService.deleteExercise(userId, parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

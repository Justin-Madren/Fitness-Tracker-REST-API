import * as workoutLogService from '../services/workoutLogService.js';

export const createWorkoutLogHandler = async (req, res, next) => {
  try {
    const { workout_id, exercise_id, sets, reps, weight, duration, notes } = req.body;
    const userId = req.user.userId;

    const log = await workoutLogService.createWorkoutLog(
      userId,
      workout_id,
      exercise_id,
      sets,
      reps,
      weight,
      duration,
      notes
    );
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

export const getAllWorkoutLogsHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const logs = await workoutLogService.getUserWorkoutLogs(userId);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

export const getWorkoutLogByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const log = await workoutLogService.getWorkoutLogById(userId, parseInt(id));
    res.status(200).json(log);
  } catch (error) {
    next(error);
  }
};

export const updateWorkoutLogHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const log = await workoutLogService.updateWorkoutLog(userId, parseInt(id), updates);
    res.status(200).json(log);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkoutLogHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await workoutLogService.deleteWorkoutLog(userId, parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

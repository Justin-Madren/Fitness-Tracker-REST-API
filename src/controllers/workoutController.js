import * as workoutService from '../services/workoutService.js';

export const createWorkoutHandler = async (req, res, next) => {
  try {
    const { name, description, date } = req.body;
    const userId = req.user.userId;

    const workout = await workoutService.createWorkout(userId, name, description, date);
    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
};

export const getUserWorkoutsHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const workouts = await workoutService.getUserWorkouts(userId);
    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

export const getWorkoutByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const workout = await workoutService.getWorkoutById(parseInt(id));

    if (workout.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own workouts' });
    }

    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
};

export const updateWorkoutHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const workout = await workoutService.updateWorkout(userId, parseInt(id), updates);
    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkoutHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await workoutService.deleteWorkout(userId, parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

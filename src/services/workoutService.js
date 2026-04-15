import * as workoutRepository from '../repositories/workoutRepository.js';

export const createWorkout = async (userId, name, description, date) => {
  if (!name || !date) {
    const error = new Error('Missing required fields: name, date');
    error.status = 400;
    throw error;
  }

  return workoutRepository.createWorkout(userId, name, description, date);
};

export const getUserWorkouts = async (userId) => {
  return workoutRepository.getUserWorkouts(userId);
};

export const getWorkoutById = async (id) => {
  const workout = await workoutRepository.getWorkoutById(id);
  if (!workout) {
    const error = new Error('Workout not found');
    error.status = 404;
    throw error;
  }
  return workout;
};

export const updateWorkout = async (userId, workoutId, data) => {
  const workout = await workoutRepository.getWorkoutById(workoutId);
  if (!workout) {
    const error = new Error('Workout not found');
    error.status = 404;
    throw error;
  }

  if (workout.user_id !== userId) {
    const error = new Error('Forbidden: You can only update your own workouts');
    error.status = 403;
    throw error;
  }

  return workoutRepository.updateWorkout(workoutId, data);
};

export const deleteWorkout = async (userId, workoutId) => {
  const workout = await workoutRepository.getWorkoutById(workoutId);
  if (!workout) {
    const error = new Error('Workout not found');
    error.status = 404;
    throw error;
  }

  if (workout.user_id !== userId) {
    const error = new Error('Forbidden: You can only delete your own workouts');
    error.status = 403;
    throw error;
  }

  await workoutRepository.deleteWorkout(workoutId);
  return { message: 'Workout deleted successfully' };
};

import * as exerciseRepository from '../repositories/exerciseRepository.js';

const validTypes = ['STRENGTH', 'CARDIO', 'FLEXIBILITY', 'OTHER'];

export const createExercise = async (userId, name, muscle_group, type, default_sets, default_reps) => {
  if (!name || !muscle_group || !type) {
    const error = new Error('Missing required fields: name, muscle_group, type');
    error.status = 400;
    throw error;
  }

  if (!validTypes.includes(type)) {
    const error = new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    error.status = 400;
    throw error;
  }

  return exerciseRepository.createExercise(userId, name, muscle_group, type, default_sets, default_reps);
};

export const getUserExercises = async (userId) => {
  return exerciseRepository.getUserExercises(userId);
};

export const getExerciseById = async (id) => {
  const exercise = await exerciseRepository.getExerciseById(id);
  if (!exercise) {
    const error = new Error('Exercise not found');
    error.status = 404;
    throw error;
  }
  return exercise;
};

export const updateExercise = async (userId, exerciseId, data) => {
  const exercise = await exerciseRepository.getExerciseById(exerciseId);
  if (!exercise) {
    const error = new Error('Exercise not found');
    error.status = 404;
    throw error;
  }

  if (exercise.user_id !== userId) {
    const error = new Error('Forbidden: You can only update your own exercises');
    error.status = 403;
    throw error;
  }

  if (data.type && !validTypes.includes(data.type)) {
    const error = new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    error.status = 400;
    throw error;
  }

  return exerciseRepository.updateExercise(exerciseId, data);
};

export const deleteExercise = async (userId, exerciseId) => {
  const exercise = await exerciseRepository.getExerciseById(exerciseId);
  if (!exercise) {
    const error = new Error('Exercise not found');
    error.status = 404;
    throw error;
  }

  if (exercise.user_id !== userId) {
    const error = new Error('Forbidden: You can only delete your own exercises');
    error.status = 403;
    throw error;
  }

  await exerciseRepository.deleteExercise(exerciseId);
  return { message: 'Exercise deleted successfully' };
};

import { PrismaClient } from '@prisma/client';
import * as workoutLogRepository from '../repositories/workoutLogRepository.js';

const prisma = new PrismaClient();

export const createWorkoutLog = async (userId, workout_id, exercise_id, sets, reps, weight, duration, notes) => {
  if (!workout_id || !exercise_id || !sets || !reps) {
    const error = new Error('Missing required fields: workout_id, exercise_id, sets, reps');
    error.status = 400;
    throw error;
  }

  // Verify workout belongs to user
  const workout = await prisma.workout.findUnique({
    where: { id: workout_id }
  });

  if (!workout) {
    const error = new Error('Workout not found');
    error.status = 404;
    throw error;
  }

  if (workout.user_id !== userId) {
    const error = new Error('Forbidden: This workout does not belong to you');
    error.status = 403;
    throw error;
  }

  // Verify exercise belongs to user
  const exercise = await prisma.exercise.findUnique({
    where: { id: exercise_id }
  });

  if (!exercise) {
    const error = new Error('Exercise not found');
    error.status = 404;
    throw error;
  }

  if (exercise.user_id !== userId) {
    const error = new Error('Forbidden: This exercise does not belong to you');
    error.status = 403;
    throw error;
  }

  return workoutLogRepository.createWorkoutLog(
    workout_id,
    exercise_id,
    sets,
    reps,
    weight,
    duration,
    notes
  );
};

export const getWorkoutLogById = async (userId, id) => {
  const log = await workoutLogRepository.getWorkoutLogById(id);

  if (!log) {
    const error = new Error('Workout log not found');
    error.status = 404;
    throw error;
  }

  // Verify the log belongs to the user's workout
  if (log.workout.user_id !== userId) {
    const error = new Error('Forbidden: You can only view your own workout logs');
    error.status = 403;
    throw error;
  }

  return log;
};

export const getUserWorkoutLogs = async (userId) => {
  return workoutLogRepository.getWorkoutLogsForUser(userId);
};

export const updateWorkoutLog = async (userId, logId, data) => {
  const log = await workoutLogRepository.getWorkoutLogById(logId);

  if (!log) {
    const error = new Error('Workout log not found');
    error.status = 404;
    throw error;
  }

  if (log.workout.user_id !== userId) {
    const error = new Error('Forbidden: You can only update your own workout logs');
    error.status = 403;
    throw error;
  }

  return workoutLogRepository.updateWorkoutLog(logId, data);
};

export const deleteWorkoutLog = async (userId, logId) => {
  const log = await workoutLogRepository.getWorkoutLogById(logId);

  if (!log) {
    const error = new Error('Workout log not found');
    error.status = 404;
    throw error;
  }

  if (log.workout.user_id !== userId) {
    const error = new Error('Forbidden: You can only delete your own workout logs');
    error.status = 403;
    throw error;
  }

  await workoutLogRepository.deleteWorkoutLog(logId);
  return { message: 'Workout log deleted successfully' };
};

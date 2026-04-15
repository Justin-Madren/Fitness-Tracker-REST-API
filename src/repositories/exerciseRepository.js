import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createExercise = async (userId, name, muscle_group, type, default_sets, default_reps) => {
  return prisma.exercise.create({
    data: {
      user_id: userId,
      name,
      muscle_group,
      type,
      default_sets,
      default_reps
    }
  });
};

export const getUserExercises = async (userId) => {
  return prisma.exercise.findMany({
    where: { user_id: userId }
  });
};

export const getExerciseById = async (id) => {
  return prisma.exercise.findUnique({
    where: { id }
  });
};

export const updateExercise = async (id, data) => {
  return prisma.exercise.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.muscle_group && { muscle_group: data.muscle_group }),
      ...(data.type && { type: data.type }),
      ...(data.default_sets !== undefined && { default_sets: data.default_sets }),
      ...(data.default_reps !== undefined && { default_reps: data.default_reps })
    }
  });
};

export const deleteExercise = async (id) => {
  return prisma.exercise.delete({
    where: { id }
  });
};

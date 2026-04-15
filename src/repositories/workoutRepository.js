import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createWorkout = async (userId, name, description, date) => {
  return prisma.workout.create({
    data: {
      user_id: userId,
      name,
      description,
      date: new Date(date)
    }
  });
};

export const getUserWorkouts = async (userId) => {
  return prisma.workout.findMany({
    where: { user_id: userId },
    include: { logs: true }
  });
};

export const getWorkoutById = async (id) => {
  return prisma.workout.findUnique({
    where: { id },
    include: { logs: true }
  });
};

export const updateWorkout = async (id, data) => {
  return prisma.workout.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.date && { date: new Date(data.date) })
    }
  });
};

export const deleteWorkout = async (id) => {
  return prisma.workout.delete({
    where: { id }
  });
};

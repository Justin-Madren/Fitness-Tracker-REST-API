import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createWorkoutLog = async (workout_id, exercise_id, sets, reps, weight, duration, notes) => {
  return prisma.workoutLog.create({
    data: {
      workout_id,
      exercise_id,
      sets,
      reps,
      weight,
      duration,
      notes
    }
  });
};

export const getAllWorkoutLogs = async () => {
  return prisma.workoutLog.findMany();
};

export const getWorkoutLogById = async (id) => {
  return prisma.workoutLog.findUnique({
    where: { id },
    include: { workout: true, exercise: true }
  });
};

export const getWorkoutLogsForUser = async (userId) => {
  // Get all workouts for the user first
  const userWorkouts = await prisma.workout.findMany({
    where: { user_id: userId },
    select: { id: true }
  });

  if (userWorkouts.length === 0) {
    return [];
  }

  const workoutIds = userWorkouts.map(w => w.id);

  // Now get all logs from those workouts
  return prisma.workoutLog.findMany({
    where: {
      workout_id: {
        in: workoutIds
      }
    },
    include: { workout: true, exercise: true },
    orderBy: { id: 'desc' }
  });
};

export const updateWorkoutLog = async (id, data) => {
  return prisma.workoutLog.update({
    where: { id },
    data: {
      ...(data.sets !== undefined && { sets: data.sets }),
      ...(data.reps !== undefined && { reps: data.reps }),
      ...(data.weight !== undefined && { weight: data.weight }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.notes !== undefined && { notes: data.notes })
    },
    include: { workout: true, exercise: true }
  });
};

export const deleteWorkoutLog = async (id) => {
  return prisma.workoutLog.delete({
    where: { id }
  });
};

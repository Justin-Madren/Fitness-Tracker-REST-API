import 'dotenv/config';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  // Clear all tables
  await prisma.workoutLog.deleteMany({});
  await prisma.workout.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed users
  const usersData = [
    { name: 'Alice Johnson', email: 'alice@test.com', password: 'alice1234' },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'bob1234' },
  ];

  const users = [];

  for (const userData of usersData) {
    const hashedPassword = await bcryptjs.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    users.push(user);
    console.log(`✓ Created user: ${user.email}`);
  }

  // Create test exercises for each user
  for (const user of users) {
    const exercises = await prisma.exercise.createMany({
      data: [
        {
          user_id: user.id,
          name: 'Bench Press',
          muscle_group: 'Chest',
          type: 'STRENGTH',
          default_sets: 4,
          default_reps: 8,
        },
        {
          user_id: user.id,
          name: 'Squats',
          muscle_group: 'Legs',
          type: 'STRENGTH',
          default_sets: 4,
          default_reps: 10,
        },
        {
          user_id: user.id,
          name: 'Running',
          muscle_group: 'Full Body',
          type: 'CARDIO',
          default_sets: 1,
          default_reps: 20,
        },
      ],
    });

    console.log(`✓ Created ${exercises.count} exercises for ${user.email}`);
  }

  // Create test workouts for each user
  for (const user of users) {
    const username = user.name.split(' ')[0];

    const workout = await prisma.workout.create({
      data: {
        user_id: user.id,
        name: `${username}'s Chest Day`,
        description: 'Focus on chest and triceps',
        date: new Date('2026-04-14'),
      },
    });

    console.log(`✓ Created workout for ${user.email}`);

    // Get exercises for this user
    const userExercises = await prisma.exercise.findMany({
      where: { user_id: user.id },
    });

    // Create workout logs
    if (userExercises.length > 0) {
      const log = await prisma.workoutLog.create({
        data: {
          workout_id: workout.id,
          exercise_id: userExercises[0].id,
          sets: 4,
          reps: 8,
          weight: 185,
          notes: 'Felt strong today',
        },
        include: { workout: true, exercise: true }
      });

      console.log(`✓ Created workout log for ${user.email}:`, log.id);
    }
  }

  console.log('\n✅ Seed completed successfully!');
  console.log('\nTest Credentials:');
  console.log('User 1: alice@test.com / alice1234');
  console.log('User 2: bob@example.com / bob1234');
} catch (error) {
  console.error('❌ Seed failed:', error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}

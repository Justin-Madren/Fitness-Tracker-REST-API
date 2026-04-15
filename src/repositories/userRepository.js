import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const createUser = async (name, email, passwordHash) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true
    }
  });
};

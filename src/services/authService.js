import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { findUserByEmail, createUser, findUserById } from '../repositories/userRepository.js';

const SALT_ROUNDS = 10;

export const signup = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await createUser(name, email, passwordHash);

  return user;
};

export const login = async (email, password) => {
  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user.id);

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

export const getUserById = async (userId) => {
  return findUserById(userId);
};

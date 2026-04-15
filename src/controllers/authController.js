import { signup, login } from '../services/authService.js';

export const signupHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, email, password' });
    }

    const user = await signup(name, email, password);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields: email, password' });
    }

    const result = await login(email, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

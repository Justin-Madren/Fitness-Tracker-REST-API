import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';

// Middleware
import { authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';
import exerciseRoutes from './routes/exercises.js';
import workoutLogRoutes from './routes/workoutLogs.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
const swaggerFile = fs.readFileSync('./docs/openapi.yaml', 'utf-8');
const swaggerSpec = yaml.parse(swaggerFile);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workout-logs', workoutLogRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    prisma.$disconnect();
    process.exit(0);
  });
});

export default app;

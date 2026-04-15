# Fitness Tracker REST API

A complete REST API for managing workouts, exercises, and workout logs with JWT-based authentication and role-based authorization.

## Features

- **User Authentication**: Sign up and login with JWT tokens
- **Workout Management**: Create, read, update, and delete workouts
- **Exercise Management**: Manage exercises with muscle group classification  
- **Workout Logging**: Track performance metrics (sets, reps, weight, duration)
- **User Ownership**: Users can only access/modify their own data
- **Comprehensive Error Handling**: Proper HTTP status codes and error messages

## Tech Stack

- **Node.js** with Express.js
- **TypeScript** (with ES Modules)
- **PostgreSQL** Database
- **Prisma** ORM
- **JWT** for authentication
- **bcryptjs** for password hashing

## Project Structure

```
src/
├── server.js              # Main application entry point
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── errorHandler.js   # Global error handling
├── controllers/
│   ├── authController.js
│   ├── workoutController.js
│   ├── exerciseController.js
│   └── workoutLogController.js
├── services/
│   ├── authService.js
│   ├── workoutService.js
│   ├── exerciseService.js
│   └── workoutLogService.js
├── repositories/
│   ├── userRepository.js
│   ├── workoutRepository.js
│   ├── exerciseRepository.js
│   └── workoutLogRepository.js
└── routes/
    ├── auth.js
    ├── workouts.js
    ├── exercises.js
    └── workoutLogs.js
prisma/
├── schema.prisma         # Database schema
└── seed.js              # Database seeding script
docs/
└── openapi.yaml         # OpenAPI documentation
.env.example             # Environment variables template
```

## Database Schema

### User
- `id` - Primary key
- `name` - User's name
- `email` - Unique email
- `password` - Hashed password
- `role` - User role (default: USER)
- `created_at` - Account creation timestamp

### Workout
- `id` - Primary key
- `user_id` - Foreign key to User
- `name` - Workout name
- `description` - Optional workout description
- `date` - Workout date
- `created_at` - Creation timestamp

### Exercise
- `id` - Primary key
- `user_id` - Foreign key to User
- `name` - Exercise name
- `muscle_group` - Target muscle group
- `type` - Exercise type (STRENGTH, CARDIO, FLEXIBILITY, OTHER)
- `default_sets` - Optional default sets
- `default_reps` - Optional default reps

### WorkoutLog
- `id` - Primary key
- `workout_id` - Foreign key to Workout
- `exercise_id` - Foreign key to Exercise
- `sets` - Number of sets
- `reps` - Number of repetitions
- `weight` - Optional weight used
- `duration` - Optional duration in seconds/minutes
- `notes` - Optional notes

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd Fitness-Tracker-REST-API
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret
```

3. **Initialize database**
```bash
npx prisma migrate dev --name init
```

4. **Start the server**
```bash
npm run dev
```

The API will be running at `http://localhost:3000`

## API Endpoints

All endpoints (except auth) require JWT authentication via `Authorization: Bearer <token>` header.

### Authentication

```
POST /api/auth/signup        - Register new user
POST /api/auth/login         - Login and receive JWT token
```

### Workouts

```
POST /api/workouts           - Create workout
GET /api/workouts            - Get all user's workouts
GET /api/workouts/:id        - Get specific workout
PUT /api/workouts/:id        - Update workout
DELETE /api/workouts/:id     - Delete workout
```

### Exercises

```
POST /api/exercises          - Create exercise
GET /api/exercises           - Get all user's exercises
GET /api/exercises/:id       - Get specific exercise
PUT /api/exercises/:id       - Update exercise
DELETE /api/exercises/:id    - Delete exercise
```

### Workout Logs

```
POST /api/workout-logs       - Create workout log
GET /api/workout-logs        - Get all user's workout logs
GET /api/workout-logs/:id    - Get specific log
PUT /api/workout-logs/:id    - Update workout log
DELETE /api/workout-logs/:id - Delete workout log
```

## Example Usage

### 1. Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123"
  }
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d {
    "email": "john@example.com",
    "password": "secure123"
  }
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Create Workout
```bash
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d {
    "name": "Leg Day",
    "description": "Lower body workout",
    "date": "2026-04-14"
  }
```

### 4. Create Exercise
```bash
curl -X POST http://localhost:3000/api/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d {
    "name": "Bench Press",
    "muscle_group": "Chest",
    "type": "STRENGTH",
    "default_sets": 4,
    "default_reps": 8
  }
```

### 5. Log Workout Performance
```bash
curl -X POST http://localhost:3000/api/workout-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d {
    "workout_id": 1,
    "exercise_id": 1,
    "sets": 4,
    "reps": 8,
    "weight": 185,
    "notes": "Felt strong today"
  }
```

## Error Responses

The API returns appropriate HTTP status codes:

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid JWT token
- `403 Forbidden` - User doesn't own resource
- `404 Not Found` - Resource not found
- `409 Conflict` - Email already exists

## Architecture

### Layered Architecture
- **Routes** - Define API endpoints
- **Controllers** - Handle HTTP requests/responses
- **Services** - Implement business logic & validation
- **Repositories** - Database access layer (Prisma)
- **Middleware** - Authentication and error handling

### Authentication Flow
1. User signs up with email and password
2. Password hashed with bcrypt
3. User logs in with email/password credentials
4. Server returns JWT token
5. Client includes token in Authorization header for subsequent requests
6. Middleware validates token and extracts user ID

### Authorization
- All resource endpoints require valid JWT token
- Users can only access their own workouts, exercises, and logs
- Ownership verified at service layer before any modifications

## Development Tips

### Database Migrations
```bash
# Create new migration after schema changes
npx prisma migrate dev --name migration_name

# View database with Prisma Studio
npx prisma studio

# Reset database (dev only!)
npx prisma migrate reset
```

### Debugging
- Set `DEBUG=*` environment variable for verbose logs
- Check PostgreSQL connection with `psql`
- Validate JWT tokens at [jwt.io](https://jwt.io)

## Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT authentication required for protected endpoints
- ✅ User ownership validation on all resources
- ✅ SQL injection protection via Prisma ORM
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for production
- ⚠️ Add CORS configuration for production

## Future Enhancements

- Email verification
- Password reset functionality
- Workout templates
- Progress analytics and reports
- Social features (follow friends, compare stats)
- File uploads (progress photos)
- Mobile app integration
- API pagination and filtering

## License

ISC

## Support

For issues or questions, please check the OpenAPI documentation at `docs/openapi.yaml` or create an issue in the repository.

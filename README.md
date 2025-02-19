# Backend Setup and Frontend Configuration Guide

## Setting Up the Backend

### Navigate to Backend Directory
```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env` file in the backend folder with these variables:
```env
DATABASE_URL="mysql://user:password@localhost:3306/chat_app"
ACCESS_SECRET="your_access_token_secret"
REFRESH_SECRET="your_refresh_token_secret"
PORT=3000
```

*Note: Replace user, password, and chat_app with your MySQL credentials and database name.*

### Run Migrations and Start Server
```bash
npm run migrate:dev
npm run dev
```

## Setting Up the Frontend

### Navigate to Frontend Directory
```bash
cd ../frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env` file in the frontend folder:
```env
VITE_API_URL=http://localhost:3000
```

### Launch Development Server
```bash
npm run dev
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```

### Start Frontend Server
```bash
cd ../frontend
npm run dev
```

Access the application at `http://localhost:3000`

## Environment Variables

### Backend Configuration (.env)
- **DATABASE_URL**: MySQL database connection URL
  - Example: `mysql://user:password@localhost:3306/chat_app`
- **ACCESS_SECRET**: JWT access token secret key
- **REFRESH_SECRET**: JWT refresh token secret key
- **PORT**: Backend server port (default: 5000)

### Frontend Configuration (.env)
- **VITE_BACKEND_PORT**: Backend API URL
  - Example: `http://localhost:3000`

## Technology Stack

### Backend Technologies
- Node.js
- Express.js
- Prisma (ORM)
- MySQL (Database)
- Socket.IO
- JWT Authentication

### Frontend Technologies
- React
- Vite
- Socket.IO Client

### Development Tools
- npm/yarn
- Git

## Contributing Guidelines

1. Fork the repository
2. Create a feature/bugfix branch
3. Commit your changes
4. Push and open a pull request

## License Information

This project is licensed under the MIT License. Refer to the LICENSE file for full details.

# Textile Twist Backend API

Backend API for the Textile Twist e-commerce platform, built with Node.js, Express, and Supabase.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Language**: TypeScript
- **Authentication**: Cookie-based sessions with HTTP-only cookies

## Features

- ✅ User authentication (signup, login, logout)
- ✅ Cookie-based session management
- ✅ JWT token verification
- ✅ Supabase integration
- ✅ CORS configured for frontend
- ✅ TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase project

### Supabase Setup

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Go to **Project Settings > API** to find:
   - Project URL
   - `anon` public key
   - `service_role` secret key (optional)
3. Enable **Email/Password** authentication:
   - Go to **Authentication > Providers**
   - Enable "Email" provider

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

**Type checking**:
```bash
npm run type-check
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Authentication

All auth endpoints are prefixed with `/auth`:

#### Sign Up
- **POST** `/auth/signup`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe" // optional
  }
  ```
- **Response**: Sets HTTP-only cookies and returns user data

#### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Sets HTTP-only cookies and returns user data

#### Logout
- **POST** `/auth/logout`
- **Response**: Clears authentication cookies

#### Get Current User
- **GET** `/auth/me`
- **Headers**: Requires authentication cookie
- **Response**: Returns current user data or 401 if not authenticated

#### Refresh Token
- **POST** `/auth/refresh`
- **Headers**: Requires refresh token cookie
- **Response**: Issues new access token

## Authentication Flow

1. User signs up or logs in via `/auth/signup` or `/auth/login`
2. Backend validates credentials with Supabase
3. Backend sets HTTP-only cookies with access & refresh tokens
4. Frontend makes authenticated requests (cookies sent automatically)
5. Backend validates tokens using middleware
6. Tokens can be refreshed via `/auth/refresh`

### Security Features

- **HTTP-only cookies**: Prevents XSS attacks
- **Secure flag**: Enabled in production (HTTPS only)
- **SameSite**: CSRF protection
- **Token verification**: JWT validation via Supabase

## Project Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── routes.ts        # Auth endpoints
│   │   ├── middleware.ts    # Auth middleware
│   │   └── cookies.ts       # Cookie configuration
│   ├── supabase/
│   │   └── client.ts        # Supabase client setup
│   ├── app.ts               # Express app setup
│   └── index.ts             # Server entry point
├── .env.example             # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Environment mode (development/production) |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key (admin operations) |

## Frontend Integration

To connect your frontend:

1. Make sure CORS is configured (check `FRONTEND_URL` in `.env`)
2. Use `credentials: 'include'` in fetch requests:
   ```javascript
   fetch('http://localhost:5000/auth/login', {
     method: 'POST',
     credentials: 'include', // Important for cookies
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   })
   ```

## Development Tips

- The server uses `tsx` for development with hot reload
- Check `/health` endpoint to verify server is running
- Use browser DevTools > Application > Cookies to inspect auth cookies
- Logs show startup info and any errors

## Next Steps

- [ ] Add product CRUD endpoints
- [ ] Add cart functionality
- [ ] Add order management
- [ ] Add user profile endpoints
- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Set up database schema in Supabase
- [ ] Add API rate limiting
- [ ] Add request validation (e.g., with Zod)
- [ ] Add comprehensive error handling
- [ ] Add API documentation (e.g., Swagger)

## Troubleshooting

**"Missing required environment variables"**
- Check your `.env` file exists and has `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**CORS errors**
- Verify `FRONTEND_URL` in `.env` matches your frontend's URL
- Make sure to use `credentials: 'include'` in frontend requests

**401 Unauthorized on `/auth/me`**
- Ensure cookies are being sent with the request
- Check cookies exist in browser DevTools
- Verify token hasn't expired

**Cannot connect to Supabase**
- Verify your Supabase URL and keys are correct
- Check your Supabase project is running
- Verify network connectivity

## License

ISC


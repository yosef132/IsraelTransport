# Israel Transport 🚌

A mobile application for managing transportation and travel in Israel, built as an academic project for Ruppin Academic Center.

## Project Structure

```
IsraelTransport/
├── frontend/   # React Native mobile app (Expo)
└── backend/    # Node.js REST API (Express + MongoDB)
```

## Frontend (React Native / Expo)

A mobile app built with React Native and Expo, targeting both Android and iOS.

**Key Features:**
- User authentication (Login, Sign Up, Email Verification)
- Client dashboard — browse and book trips
- Search trips by type
- Driver dashboard — view schedule and manage vehicles
- Admin panel — full CRUD for trips, bookings, drivers, users, vehicles, and schedules
- Bug reporting system

**Tech Stack:**
- React Native 0.74 / Expo ~51
- React Navigation (stack + bottom tabs)
- Axios for API calls
- AsyncStorage for persistent login
- React Native Paper + Vector Icons

**Getting Started:**
```bash
cd frontend
npm install
npx expo start
```

## Backend (Node.js / Express)

A RESTful API connected to a MongoDB Atlas database, with Cloudinary for image uploads. Deployed on Render.

**API Base URL:** `https://israeltransport.onrender.com/api`

**Modules:**
- `/users` — User management & authentication
- `/drivers` — Driver management
- `/trips` — Trip CRUD
- `/bookings` — Booking management
- `/vehicles` — Fleet management
- `/schedule` — Work schedule management
- `/reports` — Bug reports
- `/bookingtypes` — Booking type configuration
- `/image` — Image upload (Cloudinary)

**Tech Stack:**
- Node.js / Express
- MongoDB Atlas + Mongoose
- Cloudinary (image storage)
- Nodemailer (email verification)
- Multer (file uploads)

**Getting Started:**
```bash
cd backend
npm install
# Add your .env file (see backend/README for required variables)
npm start
```

## Academic Context

Developed as a final project for Ruppin Academic Center.

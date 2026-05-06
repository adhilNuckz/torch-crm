# CRM Lead Management System

## Project overview
A production-ready CRM Lead Management System for managing leads, tracking status changes, logging notes, and visualizing pipeline metrics through a modern dashboard and Kanban board.

## Tech stack
- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (stored in localStorage and sent via Authorization header)
- **Extras:** Axios, React Router v6, Recharts, date-fns, Lucide React icons, react-hot-toast

## How to run locally
1. **Install dependencies**
   - `cd crm-app/server && npm install`
   - `cd ../client && npm install`
2. **Set up environment variables**
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
3. **Start MongoDB**
   - Ensure MongoDB is running locally or update `MONGO_URI`
4. **Seed the database**
   - `cd crm-app/server && npm run seed`
5. **Run the backend**
   - `cd crm-app/server && npm run dev`
6. **Run the frontend**
   - `cd crm-app/client && npm run dev`

## Environment variables
### Server (`server/.env`)
- `PORT`: API port (default 5000)
- `NODE_ENV`: Environment name
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `JWT_EXPIRES_IN`: JWT expiration (e.g., 7d)
- `CLIENT_URL`: Allowed CORS origin (frontend URL)

### Client (`client/.env`)
- `VITE_API_URL`: API base URL (e.g., http://localhost:5000/api)

## Seed instructions
Run the seed script to create the admin user and sample data:
```
cd crm-app/server
npm run seed
```

## Test credentials
- **Email:** admin@example.com
- **Password:** password123

## Known limitations
- No multi-user management UI (assignments are seeded or auto-assigned on create).
- No file upload support for lead attachments.

## Reflection note
This project emphasizes clean separation of concerns, consistent API responses, and a UI that prioritizes data clarity, quick actions, and visual feedback for pipeline health.

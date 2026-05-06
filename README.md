## Features
- **Dashboard:** Real-time metrics, lead distribution charts, and conversion tracking.
*   **Lead Management:** CRUD operations, Kanban pipeline, and status history.
*   **Email Marketing:** 
    *   Campaign creation with HTML support.
    *   Broadcast emails to all leads using SMTP.
    *   Real-time tracking for **Open Rates** and **Click Rates**.
    *   SMTP Gateway configuration panel.
*   **Helpdesk Support:**
    *   Support ticketing system for client communication.
    *   Two-way chat between agents and clients.
    *   "Test Client View" to simulate public ticket submission.

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

## Email Marketing Setup
To use the email broadcast feature:
1. Navigate to the **Marketing** page.
2. Click **Gateway Config**.
3. Enter your SMTP details (e.g., Gmail SMTP host, port 587, and an **App Password**).
4. Create a new campaign and click **Broadcast** to send.

## Helpdesk Flow
1. **Agent View:** Access the **Helpdesk** page to see active tickets and reply.
2. **Client Simulation:** Click **Test Client View** on the Helpdesk page to simulate a client submitting a new support request.

## Environment variables
### Server (`server/.env`)
- `PORT`: API port (default 5000)
- `NODE_ENV`: Environment name
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `JWT_EXPIRES_IN`: JWT expiration (e.g., 7d)
- `CLIENT_URL`: Allowed CORS origin (frontend URL)
- `BACKEND_URL`: The base URL of the backend (required for email tracking pixels, e.g., http://localhost:5000)

### Client (`client/.env`)
- `VITE_API_URL`: API base URL (e.g., http://localhost:5000/api)

## Test credentials
- **Email:** admin@example.com
- **Password:** password123

## Reflection note
This project emphasizes clean separation of concerns, consistent API responses, and a feature-based architecture that simplifies scaling modules like Marketing and Helpdesk independently.

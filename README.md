# Torch CRM - Customer Relationship Management System

A comprehensive, production-ready CRM application built with the MERN stack (MongoDB, Express, React, Node.js). Features real-time dashboards, lead management, email marketing with tracking, and helpdesk support.

**Live Demo**: https://youtu.be/6vhi30Js2Gc  
**GitHub**: https://github.com/adhilNuckz/torch-crm

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Test Credentials](#test-credentials)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Known Limitations](#known-limitations)
- [Reflection & Learnings](#reflection--learnings)

---

## 🎯 Project Overview

**Torch CRM** is a full-featured Customer Relationship Management platform designed for teams to manage leads, run email campaigns, and provide customer support. Built with best practices for security, scalability, and maintainability, it demonstrates a professional-grade application architecture.

### Key Achievements
- ✅ Full-stack MERN implementation
- ✅ JWT authentication with secure password hashing
- ✅ Email marketing with pixel-based open/click tracking
- ✅ Helpdesk ticketing system with real-time chat
- ✅ Production-ready deployment on VPS/DigitalOcean
- ✅ Rate limiting, CORS, and security headers
- ✅ Responsive UI with modern component library

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool (fast development server)
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Recharts** - Data visualization
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email delivery
- **Helmet** - HTTP security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Request throttling

### Infrastructure
- **Apache 2.4** - Web server / reverse proxy
- **PM2** - Process manager
- **Let's Encrypt** - SSL/TLS certificates
- **Certbot** - Automated certificate management

---

## ✨ Features

### 1. Dashboard
- **Real-time Metrics**: Total leads, conversion rate, pipeline value
- **Lead Distribution Chart**: Visual breakdown by stage
- **Pipeline Overview**: Leads at each stage
- **Key Performance Indicators**: Track business metrics

### 2. Lead Management
- **CRUD Operations**: Create, read, update, delete leads
- **Kanban Pipeline**: Drag-drop leads between stages (New → Closed)
- **Status Tracking**: Automatic stage history
- **Notes & Comments**: Add internal notes to leads
- **Search & Filter**: Find leads by name, email, company
- **Lead Value**: Track deal amounts

### 3. Email Marketing
- **Campaign Creation**: 
  - Rich text editor for HTML emails
  - Subject line customization
  - Personalization placeholders
- **Broadcast System**:
  - Send to all leads or filtered segments
  - SMTP gateway configuration
  - Support for Gmail, SendGrid, custom SMTP
- **Real-time Tracking**:
  - **Open Rate**: Pixel-based tracking
  - **Click Rate**: Link tracking
  - **Analytics Dashboard**: Performance metrics
- **SMTP Configuration**:
  - Flexible gateway setup
  - Multiple provider support
  - Port 587 (TLS) and 465 (SSL)

### 4. Helpdesk Support
- **Ticketing System**:
  - Create support tickets
  - Assign to agents
  - Priority levels (Low, Medium, High)
  - Status tracking (Open, In-Progress, Resolved)
- **Two-way Chat**:
  - Agent-client messaging
  - Message history
  - Real-time updates
- **Client View**:
  - Public ticket submission interface
  - Client simulation mode for testing
  - Email notifications

### 5. Authentication & Security
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access**: Admin and Agent roles
- **Rate Limiting**: 200 requests per 15 minutes
- **CORS Protection**: Configurable origins
- **Security Headers**: Helmet.js protection

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/adhilNuckz/torch-crm.git
cd crm-app
```

### 2. Install Dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Setup Environment
```bash
# Backend
cd server
cp .env.example .env

# Frontend
cd ../client
cp .env.example .env
```

### 4. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Seed Database
```bash
cd server
npm run seed
```

### 6. Run Development Servers

**Terminal 1 - Backend** (port 5000):
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend** (port 5173):
```bash
cd client
npm run dev
```

### 7. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/health
- **Default Credentials**:
  - Email: `admin@example.com`
  - Password: `password123`

---

## 📝 Setup Instructions

For detailed setup instructions, see **[SETUP.md](./SETUP.md)**

Quick reference:
- **Local Development**: See [SETUP.md](./SETUP.md)
- **Database Setup**: See [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Production Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
GEMINI_API_KEY=your_api_key_here
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Production (replace localhost URLs)
```env
# server/.env
CLIENT_URL=https://torchcrm.digitel.site
BACKEND_URL=https://torchcrm.digitel.site

# client/.env
VITE_API_URL=https://torchcrm.digitel.site/api
```

---

## 🔑 Test Credentials

### Default Admin Account
- **Email**: `admin@example.com`
- **Password**: `password123`

Created automatically after running `npm run seed`.

### Creating Additional Users
Via API:
```bash
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "agent"
}
```

---

## 🗄 Database Setup

### Local Development
```bash
# Start MongoDB
sudo systemctl start mongod

# Seed database
cd server
npm run seed

# Verify
mongosh
use crm_db
db.users.countDocuments()    # Should be 1
db.leads.countDocuments()    # Should be 10
```

### Cloud (MongoDB Atlas)
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGO_URI` in `server/.env`
4. Run seed script

### Production
See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for:
- Backup strategies
- Collection schemas
- Restore procedures

---

## 🌐 Deployment

### Quick Production Setup
```bash
# On DigitalOcean/VPS
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git mongodb-org apache2 certbot

# Clone and setup
git clone https://github.com/adhilNuckz/torch-crm.git /var/www/torchcrm
cd /var/www/torchcrm/server && npm ci
cd ../client && npm ci && npm run build

# Start backend
pm2 start server.js --name torchcrm-backend
pm2 save

# Configure Apache & SSL
sudo certbot --apache -d torchcrm.digitel.site
```

For detailed deployment guide, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Currently Deployed
- **Server**: DigitalOcean (Ubuntu 20.04)
- **Database**: Local MongoDB on same VPS
- **Web Server**: Apache 2.4 with SSL
- **Process Manager**: PM2
- **Domain**: torchcrm.digitel.site

---

## 📡 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
{
  "name": "User",
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
# Returns: { token: "jwt_token" }
```

### Leads
```bash
# Get all leads
GET /api/leads
Authorization: Bearer {token}

# Create lead
POST /api/leads
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "stage": "new"
}

# Update lead
PUT /api/leads/:id
{
  "stage": "contacted"
}

# Delete lead
DELETE /api/leads/:id
```

### Marketing Campaigns
```bash
# Create campaign
POST /api/marketing/campaigns
{
  "name": "Q1 Campaign",
  "subject": "Special Offer",
  "body": "Limited time offer..."
}

# Get campaigns
GET /api/marketing/campaigns

# Send campaign
POST /api/marketing/campaigns/:id/send

# Configure SMTP
POST /api/marketing/gateway
{
  "host": "smtp.gmail.com",
  "port": 587,
  "email": "your-email@gmail.com",
  "password": "app-password"
}
```

### Helpdesk Tickets
```bash
# Create ticket
POST /api/helpdesk/tickets
{
  "title": "Issue with dashboard",
  "description": "Cannot access...",
  "email": "client@example.com"
}

# Get tickets
GET /api/helpdesk/tickets

# Add message
POST /api/helpdesk/tickets/:id/messages
{
  "content": "Here's the solution...",
  "senderType": "agent"
}
```

---

## 🏗 Architecture

### Project Structure
```
crm-app/
├── server/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Mongoose schemas
│   │   ├── middleware/      # Auth, error handling
│   │   └── utils/           # Helpers, seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Entry point
│
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── SETUP.md                 # Local development guide
├── DEPLOYMENT.md            # Production deployment guide
├── DATABASE_SETUP.md        # Database configuration
├── REFLECTION.md            # Project reflection & learnings
└── README.md                # This file
```

### Design Patterns

#### Feature-Based Organization
- Each feature (leads, marketing, helpdesk) has own route/controller
- Easy to scale: new features don't affect existing ones
- Clear responsibility boundaries

#### API Response Format
```javascript
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

#### Error Handling
- Centralized error middleware
- Consistent HTTP status codes
- User-friendly error messages

#### Authentication Flow
1. User login → JWT token issued
2. Token stored in localStorage
3. Requests include `Authorization: Bearer {token}`
4. Backend validates token, extracts user info
5. Token expires after 7 days

---

## ⚠️ Known Limitations

### 1. Email Tracking
- **Current**: Pixel-based tracking (image loads when email opens)
- **Limitation**: Modern email clients increasingly block pixel loading
- **Privacy**: Raises GDPR/privacy concerns without proper disclosure

### 2. SMTP Credentials Storage
- **Current**: Stored in MongoDB without encryption
- **Limitation**: Vulnerable if database is compromised
- **Recommended**: Encrypt with application master key

### 3. Database Security
- **Current**: Credentials in `.env` file
- **Limitation**: Secrets exposed if file is committed
- **Recommended**: Use secrets manager (HashiCorp Vault, AWS Secrets)

### 4. Email Delivery
- **Current**: No retry logic for failed sends
- **Limitation**: Emails silently fail if SMTP unreachable
- **Recommended**: Implement email queue (Bull, BullMQ)

### 5. Rate Limiting
- **Current**: Global 200 req/15min
- **Limitation**: Too aggressive for bulk operations
- **Recommended**: Implement per-endpoint, per-user limits

### 6. Search Functionality
- **Current**: Basic email/name matching
- **Limitation**: No full-text search
- **Recommended**: Add Elasticsearch or MongoDB text indexes

### 7. Scalability
- **Current**: Single MongoDB instance, single Node process
- **Limitation**: No horizontal scaling
- **Recommended**: MongoDB replication, PM2 cluster mode, Redis caching

---

## 🤔 Reflection & Learnings

### What Went Well
1. **Clean Architecture**: Feature-based organization made code maintainable
2. **Security First**: JWT, password hashing, CORS, rate limiting implemented
3. **API Consistency**: Standardized response format across all endpoints
4. **Real-world Features**: Email tracking, support ticketing mirror real CRM needs
5. **Error Handling**: Centralized middleware catches all errors gracefully

### Key Decisions
1. **MERN Stack**: JavaScript full-stack reduces context switching
2. **JWT Auth**: Stateless, scalable, suitable for SPAs
3. **MongoDB**: Flexible schema, easy data model evolution
4. **Feature-Based Routes**: Easy to add/modify features independently

### If I Were to Build Again
1. Add comprehensive input validation (Joi/Zod)
2. Implement unit & integration tests from day 1
3. Add proper audit logging (who did what, when)
4. Encrypt sensitive data at storage layer
5. Implement proper rate limiting per resource
6. Use TypeScript for type safety
7. Add multi-tenancy support for SaaS scalability

### Future Improvements
- Role-based access control (RBAC)
- Full-text search with Elasticsearch
- Real-time notifications (Socket.io)
- Analytics with custom date ranges
- Integration marketplace (Slack, Teams)
- Advanced reporting (CSV/PDF export)
- Microservices architecture
- Event-driven architecture with message queue

See [REFLECTION.md](./REFLECTION.md) for detailed analysis.

---

## 📊 Demo & Videos

**Live Demo Video**: https://youtu.be/6vhi30Js2Gc

Demonstrates:
- Dashboard overview
- Lead management workflow
- Email campaign creation & tracking
- Helpdesk ticket system
- Authentication flow

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Add TypeScript support
- Implement comprehensive test suite
- Add API documentation (Swagger/OpenAPI)
- Performance optimizations
- UI/UX enhancements

---

## 📄 License

ISC License - feel free to use for learning and projects.

---

## 📞 Support

For issues or questions:
1. Check [SETUP.md](./SETUP.md) for local dev issues
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production issues
3. Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database issues
4. Review [REFLECTION.md](./REFLECTION.md) for architecture decisions

---

**Built with ❤️ for learning and production readiness.**
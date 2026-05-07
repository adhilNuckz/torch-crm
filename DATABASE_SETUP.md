# Test Credentials & Database Setup

## Default Test Credentials

### Admin Account
After running `npm run seed`, use:
- **Email**: `admin@example.com`
- **Password**: `password123`

This account has full access to all features (Dashboard, Lead Management, Marketing, Helpdesk).

## Sample Data

The seed script populates:

### Users (1)
- Admin user with email `admin@example.com`

### Leads (10 sample leads)
Across different pipeline stages:
- **New**: Prospect leads just added
- **Contacted**: Outreach in progress
- **Qualified**: Meeting scheduled
- **Negotiation**: Deal in progress
- **Closed**: Completed sales

Sample lead data:
```
- John Smith (john@company.com) - Status: New
- Sarah Johnson (sarah@company.com) - Status: Contacted
- Mike Chen (mike@company.com) - Status: Qualified
... and more
```

### Campaigns (Sample)
Optional: 1-2 marketing campaigns for testing email tracking

### Tickets (Sample)
Optional: 2-3 helpdesk tickets for testing support flow

## Database Setup Instructions

### Local Development

**1. Start MongoDB**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo systemctl start mongod

# Windows (if installed)
net start MongoDB
```

**2. Verify Connection**
```bash
mongosh
# In mongosh prompt:
db.runCommand({ ping: 1 })
# Should return: { ok: 1 }
exit
```

**3. Seed Database**
```bash
cd server
npm run seed
```

Output should show:
```
✓ Users seeded (1)
✓ Leads seeded (10)
✓ Seed complete!
```

**4. Verify Data**
```bash
mongosh
use crm_db
db.users.countDocuments()        # Should be 1
db.leads.countDocuments()        # Should be 10
db.campaigns.countDocuments()    # May be 0 or 1
db.tickets.countDocuments()      # May be 0 or 1
```

### MongoDB Atlas (Cloud)

**1. Create Cluster**
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free account
- Create M0 free cluster
- Create database user (e.g., `crm_user`)
- Get connection string

**2. Update .env**
```env
MONGO_URI=mongodb+srv://crm_user:password@cluster0.xxxxx.mongodb.net/crm_db?retryWrites=true&w=majority
```

**3. Run Seed**
```bash
npm run seed
```

### Production Deployment

**Setup MongoDB on Server**
```bash
# Follow DEPLOYMENT.md MongoDB section
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Run Seed (First Time Only)**
```bash
cd /var/www/torchcrm/server
npm run seed
```

**Backup Database**
```bash
# Backup
mongodump --db crm_db --out ./backups/crm_db_$(date +%Y%m%d)

# Restore
mongorestore --db crm_db ./backups/crm_db_YYYYMMDD/crm_db
```

## Collection Schemas

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("admin" | "agent"),
  createdAt: Date,
  updatedAt: Date
}
```

### Leads Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  stage: String ("new" | "contacted" | "qualified" | "negotiation" | "closed"),
  value: Number,
  notes: [String],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Campaigns Collection
```javascript
{
  _id: ObjectId,
  name: String,
  subject: String,
  body: String,
  htmlBody: String,
  status: String ("draft" | "scheduled" | "sent"),
  recipientCount: Number,
  sentCount: Number,
  openCount: Number,
  clickCount: Number,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  sentAt: Date,
  updatedAt: Date
}
```

### Tickets Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  email: String,
  status: String ("open" | "in-progress" | "resolved"),
  priority: String ("low" | "medium" | "high"),
  messages: [{
    sender: String,
    senderType: String ("agent" | "client"),
    content: String,
    createdAt: Date
  }],
  assignedTo: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### SMTP Gateways Collection
```javascript
{
  _id: ObjectId,
  host: String,
  port: Number,
  email: String,
  password: String,
  encryption: String ("TLS" | "SSL"),
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Creating Additional Test Users

To create more test accounts, use API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "agent"
  }'
```

Or directly in mongosh:
```bash
use crm_db
db.users.insertOne({
  name: "Test Agent",
  email: "agent@example.com",
  password: "$2a$10$...", // bcrypt hash of "password123"
  role: "agent",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Resetting Database

**Warning: This deletes all data**

```bash
mongosh
use crm_db
db.users.deleteMany({})
db.leads.deleteMany({})
db.campaigns.deleteMany({})
db.tickets.deleteMany({})
exit
```

Then reseed:
```bash
npm run seed
```

## Testing Email Features

### 1. Configure SMTP Gateway
- Login to app as admin
- Go to Marketing → Gateway Config
- Enter SMTP details (Gmail, SendGrid, etc.)
- Test with your email

### 2. Test Campaign Send
- Go to Marketing → Create Campaign
- Fill in details
- Click "Broadcast"
- Check recipient email for message

### 3. Track Email Opens
- Open email from campaign
- Check Analytics in Marketing page
- Should show open count incrementing

## Database Backup Strategy

For production, implement:

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db crm_db --out $BACKUP_DIR/crm_db_$DATE
# Keep last 30 days
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} \;
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

---

**Note**: For production, encrypt sensitive data before storage and implement role-based access control.

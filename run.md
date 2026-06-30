# How to Run the Project

## 📋 Full Service Checklist
Before starting the application, ensure all required background services and servers are running. Missing services or stale tokens will lead to database or connection errors (like Chat failing).

### Required Background Services
- [ ] **PostgreSQL Database** (Port `5432`): Must be running for the main application data (via Prisma).
- [ ] **Redis Server** (Port `6379`): Crucial for real-time features like the **Chat System** (Pub/Sub) and background task queues (BullMQ). Make sure your Redis Docker container or local instance is running first!

### Application Servers
To start the servers manually without issues, please open separate terminal windows for each:

### 1. Start the Backend (NestJS)
Open a terminal in the root folder and run:
```bash
cd backend
npm run start:dev
```

### 2. Start the Frontend (Next.js)
Open a second terminal in the root folder and run:
```bash
cd frontend
npm run dev
```

### 3. (Optional) Start Database UI (Prisma Studio)
Open a third terminal in the root folder and run:
```bash
cd backend
npx prisma studio
```

### 4. (Optional) Seed Daily Test Data
To populate the queue and dashboard with fresh appointments and walk-ins for today:
```bash
cd backend
npm run seed:daily
```

### 5. (Optional) Clear Queue Data
If you need to completely clear the queue, appointments, and patient cases from the database, you can run this script:
```bash
cd backend
node clear.js
```

### 6. (Optional) Clear All Patients
If you need to completely delete all patients and their related records (bills, cases, appointments, etc.) from the database, you can run this script:
```bash
cd backend
node clear-patients.js
```

---

## 🛠 Troubleshooting Common Issues

### ❌ "Invalid branch or missing tenant" Error in Chat/API
**Why it happens:** You recently reset and re-seeded your database, which created brand new `branchId`s. However, your browser's `localStorage` still holds the old UUIDs and authentication token from before the reset. When the frontend tries to send a chat message, it passes the old `branchId` to the backend, which can no longer find it in the fresh database.
**How to fix:**
1. Log out of the frontend application and log back in.
2. OR, completely clear your browser's Local Storage and refresh the page to get the newly generated data.

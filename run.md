# How to Run the Project

To start the servers manually without issues, please open two separate terminal windows.

### 1. Start the Backend
Open a terminal in the root folder and run:
```bash
cd backend
npm run start:dev
```
*(Make sure your Redis docker container is running first!)*

### 2. Start the Frontend
Open a second terminal in the root folder and run:
```bash
cd frontend
npm run dev
```

### 3. Start Database UI (Prisma Studio)
Open a third terminal in the root folder and run:
```bash
cd backend
npx prisma studio
```

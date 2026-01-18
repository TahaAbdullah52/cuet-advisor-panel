# 🚀 Local Development Guide

## ✅ Current Status

Both frontend and backend are running locally!

### Backend

- **URL:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **API Docs:** http://localhost:3000/api-docs
- **Status:** ✅ Running

### Frontend

- **URL:** http://localhost:4200
- **Status:** ✅ Running

### Database

- **MongoDB:** Connected to MongoDB Atlas
- **Status:** ✅ Seeded with test data

---

## 🔑 Test Login Credentials

Use these credentials to login at http://localhost:4200

### Advisor Accounts:

**Advisor 1 (Main Demo Account):**

```
Email: saiful@cuet.ac.bd
Password: pass12345
```

- Name: Dr. Saiful Islam
- Has 8 students (Batch 21)
- Has pending approvals

**Advisor 2:**

```
Email: rifat@cuet.ac.bd
Password: pass12345
```

- Name: Dr. Rifat Shahriyar

**Advisor 3:**

```
Email: mahbub@cuet.ac.bd
Password: pass12345
```

- Name: Dr. Mahbub Hasan

---

## 📝 How to Use

### 1. Login

1. Open http://localhost:4200 in your browser
2. Enter email: `saiful@cuet.ac.bd`
3. Enter password: `pass12345`
4. Click "Login"

### 2. Test Features

- View student list
- Approve/reject registrations
- View student details
- Manage thesis topics
- View routines

---

## 🛠️ Development Commands

### Backend Commands

```bash
cd cuet-advisor-panel/backend

# Start development server
npm run dev

# Seed database
npm run seed

# Run tests
npm test

# Build for production
npm run build
```

### Frontend Commands

```bash
cd cuet-advisor-panel

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## 🔄 Restart Services

If you need to restart:

### Stop Backend

- Press `Ctrl+C` in the backend terminal

### Stop Frontend

- Press `Ctrl+C` in the frontend terminal

### Start Again

```bash
# Backend
cd cuet-advisor-panel/backend
npm run dev

# Frontend (in a new terminal)
cd cuet-advisor-panel
npm start
```

---

## 🐛 Troubleshooting

### Backend won't start

- Check if port 3000 is already in use
- Verify MongoDB connection in `.env`
- Run `npm install` in backend folder

### Frontend won't start

- Check if port 4200 is already in use
- Run `npm install` in root folder
- Clear Angular cache: `rm -rf .angular/cache`

### Can't login

- Make sure backend is running
- Check browser console for errors (F12)
- Verify database is seeded: `npm run seed` in backend

### CORS errors

- Backend `.env` has `FRONTEND_URL=http://localhost:4200`
- Restart backend after changing `.env`

---

## 📊 Database Info

**Test Data Includes:**

- 3 Advisors
- 20 Students (across batches 19-24)
- 3 Routines
- Various approval statuses (pending, approved, rejected)
- Thesis information for final year students

**To Reset Database:**

```bash
cd cuet-advisor-panel/backend
npm run seed
```

---

## 🌐 API Endpoints

Base URL: http://localhost:3000/api

### Auth

- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register

### Students

- GET `/api/students` - Get all students
- GET `/api/students/:id` - Get student by ID
- PUT `/api/students/:id/approve` - Approve registration
- PUT `/api/students/:id/reject` - Reject registration

### Thesis

- GET `/api/thesis` - Get all thesis
- POST `/api/thesis` - Create thesis
- PUT `/api/thesis/:id` - Update thesis

### Routines

- GET `/api/routines` - Get all routines
- POST `/api/routines` - Create routine

Full API documentation: http://localhost:3000/api-docs

---

## 🎯 Next Steps

1. ✅ Login with test credentials
2. ✅ Test the application features
3. ✅ Make code changes (auto-reload enabled)
4. ✅ Deploy to production when ready

---

## 📞 Need Help?

- Check browser console (F12) for errors
- Check backend terminal for server logs
- Check frontend terminal for build errors
- Review API documentation at http://localhost:3000/api-docs

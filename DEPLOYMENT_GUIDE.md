# 🚀 CUET Advisor Panel - Complete Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Architecture](#deployment-architecture)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] MongoDB Atlas account (already set up ✅)
- [ ] Gemini API key (get from https://aistudio.google.com/app/apikey)
- [ ] Gmail App Password (for email functionality)
- [ ] Render account (sign up at https://render.com)
- [ ] Vercel account (sign up at https://vercel.com)

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         FRONTEND (Vercel - FREE)                         │
│         https://cuet-advisor-panel.vercel.app            │
│         - Angular 21 Application                         │
│         - Static Site Hosting                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         BACKEND (Render - FREE)                          │
│         https://cuet-advisor-backend.onrender.com        │
│         - Node.js/Express API                            │
│         - Gemini AI Integration                          │
│         - Email Service                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         DATABASE (MongoDB Atlas - FREE)                  │
│         - Already configured ✅                          │
│         - Cloud-hosted MongoDB                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Deployment

### **PHASE 1: Prepare Your Code**

#### Step 1.1: Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the API key (starts with `AIzaSy...`)
5. Save it in a safe place

#### Step 1.2: Update Backend .env

Your `.env` file should have:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration (Already set up ✅)
MONGODB_URI=mongodb+srv://junain:cuet@cluster0.0xtmgdd.mongodb.net/cuet-advisor-panel?retryWrites=true&w=majority&appName=CUET-Advisor-Panel

# Authentication
JWT_SECRET=very-strong-and-secure-jwt-secret-key-change-this-in-production-1234

# Email Service (Gmail SMTP)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here

# AI Service Configuration
AI_SERVICE=gemini

# Google Gemini API
GEMINI_API_KEY=AIzaSy... (your key here)

# Frontend URL (Update after frontend deployment)
FRONTEND_URL=https://cuet-advisor-panel.vercel.app
```

#### Step 1.3: Commit Your Changes

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

### **PHASE 2: Deploy Backend to Render**

#### Step 2.1: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

#### Step 2.2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `cuet-advisor-panel`
3. Configure the service:

**Basic Settings:**

- **Name:** `cuet-advisor-backend`
- **Region:** Singapore (or closest to you)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

#### Step 2.3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key                  | Value                                   |
| -------------------- | --------------------------------------- |
| `NODE_ENV`           | `production`                            |
| `PORT`               | `10000`                                 |
| `MONGODB_URI`        | Your MongoDB Atlas connection string    |
| `JWT_SECRET`         | Your JWT secret (generate a strong one) |
| `AI_SERVICE`         | `gemini`                                |
| `GEMINI_API_KEY`     | Your Gemini API key                     |
| `GMAIL_USER`         | Your Gmail address                      |
| `GMAIL_APP_PASSWORD` | Your Gmail app password                 |
| `FRONTEND_URL`       | `https://cuet-advisor-panel.vercel.app` |

#### Step 2.4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll get a URL like: `https://cuet-advisor-backend.onrender.com`
4. **Save this URL!** You'll need it for frontend

#### Step 2.5: Test Backend

Visit: `https://cuet-advisor-backend.onrender.com/health`

You should see:

```json
{
  "status": "success",
  "message": "CUET Advisor Panel API is running",
  "timestamp": "2025-01-17T...",
  "documentation": "/api-docs"
}
```

---

### **PHASE 3: Deploy Frontend to Vercel**

#### Step 3.1: Update Frontend Environment

1. Open `cuet-advisor-panel/src/environments/environment.prod.ts`
2. Update `apiUrl` with your Render backend URL:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://cuet-advisor-backend.onrender.com/api", // Your Render URL
  useMockData: false,
  mockDataDelay: 0,
  features: {
    enableRefresh: true,
    showDataSource: false,
    enableBulkApproval: true,
  },
};
```

3. Commit and push:

```bash
git add .
git commit -m "Update production API URL"
git push origin main
```

#### Step 3.2: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub**
4. Authorize Vercel

#### Step 3.3: Deploy Frontend

1. Click **"Add New..."** → **"Project"**
2. Import your repository: `cuet-advisor-panel`
3. Configure project:

**Framework Preset:** Angular

**Root Directory:** `cuet-advisor-panel` (click "Edit" and select the folder)

**Build Settings:**

- **Build Command:** `npm run vercel-build`
- **Output Directory:** `dist/cuet-advisor-panel/browser`
- **Install Command:** `npm install`

4. Click **"Deploy"**
5. Wait 3-5 minutes
6. You'll get a URL like: `https://cuet-advisor-panel.vercel.app`

#### Step 3.4: Update Backend CORS

1. Go back to Render dashboard
2. Select your backend service
3. Go to **"Environment"**
4. Update `FRONTEND_URL` to your Vercel URL
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

### **PHASE 4: Final Configuration**

#### Step 4.1: Test the Application

1. Visit your Vercel URL: `https://cuet-advisor-panel.vercel.app`
2. Try logging in with your credentials
3. Test student management features
4. Test AI email generation

#### Step 4.2: Set Up Custom Domain (Optional)

**For Vercel (Frontend):**

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

**For Render (Backend):**

1. Go to Render Dashboard → Your Service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 🎉 Post-Deployment

### What You Get (FREE):

✅ **Frontend:** Hosted on Vercel

- Unlimited bandwidth
- Automatic HTTPS
- Global CDN
- Automatic deployments on git push

✅ **Backend:** Hosted on Render

- 750 hours/month free
- Automatic HTTPS
- Automatic deployments on git push
- Sleeps after 15 min of inactivity (wakes up on request)

✅ **Database:** MongoDB Atlas

- 512 MB storage free
- Shared cluster
- Automatic backups

✅ **AI:** Gemini API

- 60 requests/minute free
- 1500 requests/day free

### Important Notes:

⚠️ **Render Free Tier Limitation:**

- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Subsequent requests are fast

💡 **Solution:**

- Use a service like **UptimeRobot** (free) to ping your backend every 14 minutes
- Or upgrade to Render paid plan ($7/month) for always-on service

---

## 🔧 Troubleshooting

### Issue 1: Backend Not Responding

**Symptoms:** Frontend shows "Cannot connect to server"

**Solutions:**

1. Check Render logs: Dashboard → Your Service → Logs
2. Verify environment variables are set correctly
3. Check MongoDB connection string
4. Ensure backend is not sleeping (visit `/health` endpoint)

### Issue 2: CORS Errors

**Symptoms:** Browser console shows CORS errors

**Solutions:**

1. Verify `FRONTEND_URL` in Render matches your Vercel URL
2. Ensure no trailing slash in URLs
3. Redeploy backend after changing environment variables

### Issue 3: AI Generation Fails

**Symptoms:** Email generation returns errors

**Solutions:**

1. Verify `GEMINI_API_KEY` is correct
2. Check Gemini API quota: https://aistudio.google.com/app/apikey
3. Ensure `AI_SERVICE=gemini` in environment variables

### Issue 4: Email Not Sending

**Symptoms:** Approval emails not received

**Solutions:**

1. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD`
2. Check Gmail app password is correct (16 characters, no spaces)
3. Ensure 2-Step Verification is enabled on Gmail account

### Issue 5: Database Connection Failed

**Symptoms:** Backend logs show MongoDB connection errors

**Solutions:**

1. Check MongoDB Atlas is accessible
2. Verify connection string is correct
3. Ensure IP whitelist includes `0.0.0.0/0` (allow all) in MongoDB Atlas
4. Check database user has correct permissions

---

## 📊 Monitoring Your Application

### Render Dashboard

- View logs: Real-time backend logs
- Monitor metrics: CPU, memory usage
- Check deployments: Deployment history

### Vercel Dashboard

- View analytics: Page views, performance
- Check deployments: Build logs
- Monitor errors: Error tracking

### MongoDB Atlas

- Monitor database: Connections, operations
- View metrics: Storage, queries
- Check alerts: Set up alerts for issues

---

## 💰 Cost Breakdown

| Service           | Free Tier     | Paid Tier              |
| ----------------- | ------------- | ---------------------- |
| **Vercel**        | Unlimited     | $20/month (Pro)        |
| **Render**        | 750 hrs/month | $7/month (always-on)   |
| **MongoDB Atlas** | 512 MB        | $9/month (2GB)         |
| **Gemini API**    | 60 req/min    | Pay as you go          |
| **Total**         | **$0/month**  | ~$36/month (if needed) |

---

## 🚀 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test all features
4. 📧 Set up email notifications
5. 🔒 Enable HTTPS (automatic)
6. 📊 Set up monitoring
7. 🌐 Add custom domain (optional)
8. 📱 Test on mobile devices
9. 👥 Share with users
10. 🎉 Celebrate!

---

## 📞 Support

If you encounter issues:

1. Check Render logs
2. Check Vercel deployment logs
3. Check browser console for errors
4. Verify all environment variables
5. Test backend `/health` endpoint
6. Check MongoDB Atlas connection

---

## 🎓 Learning Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Good luck with your deployment! 🚀**

---

**Created by:** Junain Uddin  
**Date:** January 17, 2025  
**Version:** 1.0

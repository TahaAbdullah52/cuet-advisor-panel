# ✅ Deployment Checklist

## Before You Start

- [ ] Get Gemini API Key from https://aistudio.google.com/app/apikey
- [ ] Have Gmail App Password ready
- [ ] MongoDB Atlas is accessible
- [ ] Code is pushed to GitHub
- [ ] All tests pass locally

---

## Backend Deployment (Render)

### Setup

- [ ] Sign up at https://render.com with GitHub
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set Root Directory to `backend`

### Configuration

- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Region: Singapore (or closest)

### Environment Variables

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = (your MongoDB connection string)
- [ ] `JWT_SECRET` = (generate strong secret)
- [ ] `AI_SERVICE` = `gemini`
- [ ] `GEMINI_API_KEY` = (your Gemini key)
- [ ] `GMAIL_USER` = (your Gmail)
- [ ] `GMAIL_APP_PASSWORD` = (your app password)
- [ ] `FRONTEND_URL` = `https://cuet-advisor-panel.vercel.app`

### Verification

- [ ] Deployment successful
- [ ] Visit `/health` endpoint - should return success
- [ ] Copy backend URL (e.g., `https://cuet-advisor-backend.onrender.com`)

---

## Frontend Deployment (Vercel)

### Update Code

- [ ] Update `environment.prod.ts` with backend URL
- [ ] Commit and push changes

### Setup

- [ ] Sign up at https://vercel.com with GitHub
- [ ] Import GitHub repository
- [ ] Set Root Directory to `cuet-advisor-panel`

### Configuration

- [ ] Framework: Angular
- [ ] Build Command: `npm run vercel-build`
- [ ] Output Directory: `dist/cuet-advisor-panel/browser`

### Verification

- [ ] Deployment successful
- [ ] Visit frontend URL
- [ ] Test login functionality
- [ ] Copy frontend URL

---

## Final Steps

### Update Backend

- [ ] Go to Render dashboard
- [ ] Update `FRONTEND_URL` with Vercel URL
- [ ] Save and redeploy

### Testing

- [ ] Login works
- [ ] Dashboard loads
- [ ] Student list displays
- [ ] AI email generation works
- [ ] Email sending works
- [ ] All features functional

### Optional

- [ ] Set up custom domain
- [ ] Set up UptimeRobot to keep backend awake
- [ ] Enable monitoring/alerts
- [ ] Share with users

---

## Quick URLs

**Backend Health Check:**

```
https://your-backend.onrender.com/health
```

**Backend API Docs:**

```
https://your-backend.onrender.com/api-docs
```

**Frontend:**

```
https://your-frontend.vercel.app
```

---

## Troubleshooting Quick Fixes

**Backend not responding:**

- Check Render logs
- Visit `/health` to wake it up
- Verify environment variables

**CORS errors:**

- Update `FRONTEND_URL` in Render
- Redeploy backend

**AI not working:**

- Check Gemini API key
- Verify `AI_SERVICE=gemini`

**Email not sending:**

- Verify Gmail credentials
- Check app password (no spaces)

---

## Support Resources

- Render Logs: Dashboard → Service → Logs
- Vercel Logs: Dashboard → Project → Deployments
- MongoDB: Atlas Dashboard → Metrics
- Gemini: https://aistudio.google.com/app/apikey

---

**Estimated Time:** 30-45 minutes total
**Cost:** $0 (Free tier)
**Difficulty:** Beginner-friendly

Good luck! 🚀

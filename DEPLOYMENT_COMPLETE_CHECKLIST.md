# Complete Deployment Checklist

## ✅ Backend (Render) - COMPLETED

- [x] Backend deployed to Render
- [x] MongoDB Atlas connected
- [x] Environment variables configured
- [x] API is accessible

**Backend URL:** `https://cuet-advisor-backend.onrender.com`

## 🚀 Frontend (Vercel) - TO DO

### Pre-Deployment

- [ ] Verify backend URL in `src/environments/environment.prod.ts`
- [ ] Commit and push all changes to GitHub
- [ ] Ensure `vercel.json` is configured correctly

### Deployment Steps

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Import your GitHub repository
- [ ] Configure build settings:
  - Framework: Angular
  - Build Command: `npm run vercel-build`
  - Output Directory: `dist/cuet-advisor-panel/browser`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (2-3 minutes)

### Post-Deployment

- [ ] Visit your Vercel URL
- [ ] Test login functionality
- [ ] Test data loading from backend
- [ ] Check browser console for errors
- [ ] Verify API calls are reaching Render backend

### CORS Configuration (if needed)

- [ ] If you see CORS errors, update backend CORS settings
- [ ] Add Vercel URL to allowed origins in backend
- [ ] Redeploy backend on Render

### Optional

- [ ] Configure custom domain on Vercel
- [ ] Set up monitoring and analytics
- [ ] Configure automatic deployments

## Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **GitHub Repo:** https://github.com/TahaAbdullah52/cuet-advisor-panel
- **Backend API:** https://cuet-advisor-backend.onrender.com/api
- **Frontend (after deploy):** https://cuet-advisor-panel.vercel.app

## Common Issues & Solutions

### Issue: CORS Error

**Solution:** Add Vercel URL to backend CORS configuration

### Issue: API Not Responding

**Solution:** Render free tier sleeps after inactivity - first request wakes it up (takes 30-60 seconds)

### Issue: Build Failed on Vercel

**Solution:** Check build logs, ensure all dependencies are in package.json

### Issue: 404 on Refresh

**Solution:** Already configured in `vercel.json` with catch-all route to `index.html`

## Need Help?

Refer to:

- `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed frontend deployment guide
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Original deployment checklist

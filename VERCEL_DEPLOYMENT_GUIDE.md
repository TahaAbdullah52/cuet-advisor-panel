# Vercel Frontend Deployment Guide

## Prerequisites

✅ Backend deployed on Render (completed)
✅ Render API URL available
✅ GitHub repository connected

## Step 1: Update Production Environment

Your production environment file is already configured at:
`src/environments/environment.prod.ts`

**Current API URL:** `https://cuet-advisor-backend.onrender.com/api`

If your Render backend URL is different, update it in `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-RENDER-APP.onrender.com/api', // Replace with your actual Render URL
  useMockData: false,
  mockDataDelay: 0,
  features: {
    enableRefresh: true,
    showDataSource: false,
    enableBulkApproval: true,
  },
};
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**

   - Visit: https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Project**

   - Click "Add New..." → "Project"
   - Select your GitHub repository: `TahaAbdullah52/cuet-advisor-panel`
   - Click "Import"

3. **Configure Project**

   - **Framework Preset:** Angular
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run vercel-build` (or `ng build --configuration production`)
   - **Output Directory:** `dist/cuet-advisor-panel/browser`
   - **Install Command:** `npm install`

4. **Environment Variables** (if needed)

   - You don't need any environment variables since the API URL is in the environment.prod.ts file
   - But if you want to make it configurable, you can add:
     - Name: `API_URL`
     - Value: `https://YOUR-RENDER-APP.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - You'll get a URL like: `https://cuet-advisor-panel.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project root
cd cuet-advisor-panel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Step 3: Verify Deployment

1. **Visit your Vercel URL**

   - Example: `https://cuet-advisor-panel.vercel.app`

2. **Test API Connection**

   - Open browser DevTools (F12)
   - Go to Network tab
   - Try logging in or loading data
   - Check if API calls are going to your Render backend

3. **Check for CORS Issues**
   - If you see CORS errors, you need to update your backend CORS configuration
   - See "Troubleshooting" section below

## Step 4: Configure Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## Troubleshooting

### CORS Issues

If you see CORS errors in the browser console, update your backend CORS configuration:

**File:** `backend/src/index.ts` or `backend/src/app.ts`

```typescript
app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'https://cuet-advisor-panel.vercel.app', // Add your Vercel URL
      'https://your-custom-domain.com', // Add custom domain if you have one
    ],
    credentials: true,
  })
);
```

Then redeploy your backend on Render.

### Build Failures

**Error: "Cannot find module '@angular/build'"**

- Solution: Vercel should auto-detect Angular and install dependencies
- If it fails, check that `@angular/build` is in `devDependencies`

**Error: "Output directory not found"**

- Solution: Verify the output directory in `vercel.json` matches `angular.json`
- Should be: `dist/cuet-advisor-panel/browser`

### API Connection Issues

**Frontend loads but no data appears:**

1. Check browser console for errors
2. Verify the API URL in `environment.prod.ts` is correct
3. Test the backend API directly: `https://YOUR-RENDER-APP.onrender.com/api/health`
4. Check if backend is sleeping (Render free tier sleeps after inactivity)

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Main branch** → Production deployment
- **Other branches** → Preview deployments

To disable auto-deploy:

1. Go to Project Settings → Git
2. Configure deployment branches

## Monitoring

**View Deployment Logs:**

1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View build logs and runtime logs

**View Analytics:**

- Vercel provides free analytics
- Go to Project → Analytics

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Test the full application
3. ✅ Configure CORS if needed
4. ✅ Set up custom domain (optional)
5. ✅ Monitor application performance

## Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard
**Your Backend API:** https://cuet-advisor-backend.onrender.com/api
**Your Frontend:** https://cuet-advisor-panel.vercel.app (after deployment)

## Support

- Vercel Docs: https://vercel.com/docs
- Angular Deployment: https://angular.dev/tools/cli/deployment
- Render + Vercel Setup: https://render.com/docs/deploy-node-express-app

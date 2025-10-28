# Deployment Checklist for Vercel

## Before Deploying to Vercel

### 1. Push to GitHub
```bash
git remote add origin https://github.com/unaibx0/homework-tracker-pwa.git
git branch -M main
git push -u origin main
```

### 2. Create Vercel Project
- Go to https://vercel.com/new
- Import your GitHub repository
- Select `homework-tracker-pwa`

### 3. **CRITICAL: Set Environment Variables**

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Source |
|----------|-------|--------|
| `VITE_SUPABASE_URL` | `https://zykhnnbkrjwnqklktagu.supabase.co` | From `.env.local` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | From `.env.local` |

**⚠️ IMPORTANT:** Without these variables, the app will keep loading!

### 4. Deploy
- Click "Deploy"
- Wait for build to complete (1-2 minutes)

### 5. Verify Deployment
- Check that app loads without infinite loading
- Test adding/editing tasks
- Verify offline functionality

## If App Keeps Loading

### Troubleshooting Steps:

1. **Check Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Redeploy after adding variables

2. **Check Build Logs**
   - Go to Deployments tab
   - Click on the failed deployment
   - Check "Build Logs" for errors

3. **Check Browser Console**
   - Open DevTools (F12)
   - Check Console tab for error messages
   - Look for "Missing Supabase environment variables" message

4. **Redeploy**
   - After fixing issues, go to Deployments
   - Click "Redeploy" on the latest deployment

## Environment Variables Explained

- **VITE_SUPABASE_URL**: Your Supabase project URL (from Supabase Dashboard → Settings → API)
- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous key (from Supabase Dashboard → Settings → API)

These are required for the app to connect to your database.

## What's Fixed

✅ Error handling for missing Supabase credentials
✅ Graceful fallback when database is unavailable
✅ Prevents infinite loading loops
✅ Shows error messages in console for debugging

## Support

If deployment still fails:
1. Check Vercel build logs
2. Verify environment variables are exactly correct
3. Check Supabase project is active
4. Try redeploying
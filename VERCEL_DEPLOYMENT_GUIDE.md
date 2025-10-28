# Vercel Deployment Guide

Deploy your Homework Tracker PWA to Vercel in minutes!

## Prerequisites

1. **GitHub Repository** - Push your code to GitHub first (see GITHUB_PUSH_INSTRUCTIONS.md)
2. **Vercel Account** - Sign up at https://vercel.com (free tier available)
3. **Supabase Credentials** - Have your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ready

## Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select "GitHub" and authorize Vercel
4. Find and select your `homework-tracker-pwa` repository
5. Click "Import"

## Step 2: Configure Environment Variables

In the Vercel dashboard, add these environment variables:

| Variable Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

**How to find these:**
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy the Project URL and Anon Key

## Step 3: Deploy

1. Click "Deploy"
2. Vercel will automatically:
   - Install dependencies
   - Build the project (`npm run build`)
   - Deploy to production

3. Wait for the deployment to complete (usually 1-2 minutes)

## Step 4: Access Your App

After deployment, you'll get a URL like:
```
https://homework-tracker-pwa.vercel.app
```

Your PWA is now live! 🎉

## Automatic Deployments

Every time you push to GitHub:
- Vercel automatically detects changes
- Builds and deploys your app
- No manual action needed!

## Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

**Build fails?**
- Check that `npm run build` works locally
- Verify environment variables are set correctly
- Check build logs in Vercel dashboard

**App shows blank page?**
- Check browser console for errors
- Verify Supabase credentials are correct
- Check that service worker is registered

**Environment variables not working?**
- Redeploy after adding variables
- Use `VITE_` prefix for Vite environment variables
- Restart build if needed

## Monitoring

In Vercel dashboard you can:
- View deployment history
- Check build logs
- Monitor performance
- View analytics
- Manage domains and SSL

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- Supabase Docs: https://supabase.com/docs
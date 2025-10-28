# Vercel Environment Variable Setup - FIXED

## The Issue
Vercel was looking for environment variables with wrong names because of the `vercel.json` configuration.

## Solution: Manual Environment Variable Setup

### Step 1: Go to Vercel Dashboard
1. Go to your project dashboard on Vercel
2. Click "Settings" tab
3. Click "Environment Variables"

### Step 2: Add These Variables

| Variable Name | Value | Where to get it |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://zykhnnbkrjwnqklktagu.supabase.co` | From your `.env.local` file |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5a2hubmJrcmp3bnFrbGt0YWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODA1NjksImV4cCI6MjA3NzE1NjU2OX0.vjATWwt0uBwf9JAQ75wEPQVgb9J7OAVZrXvbSMg-V-A` | From your `.env.local` file |

### Step 3: Redeploy
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

## Why This Happened

The `vercel.json` file was trying to map environment variables to secrets that didn't exist. By removing the `env` section, Vercel will now look for the actual environment variables you set manually.

## Verification

After redeployment:
1. Check that the app loads without infinite loading
2. Open browser console (F12) - should NOT see "Missing Supabase environment variables"
3. Try adding a task to verify database connection

## If Still Fails

1. **Double-check variable names** - must be exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. **Check values** - copy them exactly from your `.env.local` file
3. **Redeploy** - environment variables require redeployment to take effect
4. **Check build logs** - in Vercel dashboard → Deployments → latest → Build Logs

## Success Indicators

✅ App loads without infinite loading
✅ No "Missing Supabase environment variables" error in console
✅ Can add/edit/delete tasks
✅ Service worker registered
✅ PWA installable (once icons are added)
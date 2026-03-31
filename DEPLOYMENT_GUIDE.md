# Deployment Guide - PathToTech

## 📋 Pre-Deployment Checklist

- [ ] Push all code to GitHub
- [ ] Create MongoDB Atlas account (free)
- [ ] Create Render account (connect GitHub)
- [ ] Create Vercel account (connect GitHub)
- [ ] Copy environment variables from `.env.example`

---

## 🚀 BACKEND DEPLOYMENT (Render)

### Step 1: Set Up MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create Organization → Create Project
3. Click "Build a Database" → Select "M0 (Free)" tier
4. Choose region (Singapore or closest to you)
5. Create cluster
6. Go to "Database Access" → Add user (username + password)
7. Go to "Network Access" → Add IP Address → Add 0.0.0.0/0 (allow all)
8. Go to "Cluster" → Click "Connect" → Get connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/pathtotech?retryWrites=true&w=majority`
9. Replace `username:password` with your credentials

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up → Connect GitHub
3. Click "New +" → "Web Service"
4. Select repository: `DCS-PathTotech`
5. Enter settings:
   - **Name:** `pathtotech-server`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

6. Click "Advanced" →  **Add Environment Variable:**
   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/pathtotech?retryWrites=true&w=majority
   CORS_ORIGIN = https://pathtotech.vercel.app
   JWT_SECRET = create_a_random_secret_key_here_make_it_long
   JWT_EXPIRE = 7d
   ```

7. Click "Create Web Service"
8. Wait for deployment → Get your URL: `https://pathtotech-server.onrender.com`

### Step 3: Update Frontend Configuration
Update `client/.env` or set in Vercel:
```
REACT_APP_API_URL=https://pathtotech-server.onrender.com/api
```

---

## 🎨 FRONTEND DEPLOYMENT (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up → Connect GitHub
3. Click "Add New" → "Project"
4. Select repository: `DCS-PathTotech`
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Environment Variables:**
     ```
     REACT_APP_API_URL = https://pathtotech-server.onrender.com/api
     ```

6. Click "Deploy"
7. Wait for deployment → Get your URL: `https://pathtotech.vercel.app`

### Step 2: Update Backend CORS
Go back to Render dashboard:
1. Click your service → Settings → Environment
2. Update `CORS_ORIGIN` to your Vercel URL: `https://pathtotech.vercel.app`
3. Click "Save" (service will auto-redeploy)

---

## 🔄 ENVIRONMENT VARIABLES SUMMARY

### Backend (Render)
| Variable | Example | Notes |
|----------|---------|-------|
| `NODE_ENV` | `production` | Production mode |
| `MONGODB_URI` | `mongodb+srv://...` | From MongoDB Atlas |
| `CORS_ORIGIN` | `https://pathtotech.vercel.app` | Your frontend URL |
| `JWT_SECRET` | `random_key_here` | Generate random secret |
| `JWT_EXPIRE` | `7d` | Token expiration |

### Frontend (Vercel)
| Variable | Example | Notes |
|----------|---------|-------|
| `REACT_APP_API_URL` | `https://pathtotech-server.onrender.com/api` | Your backend URL |

---

## 📝 IMPORTANT NOTES

### Cold Starts (Free Tier)
- Render free tier goes to sleep after 15 min inactivity
- First request after sleep takes ~50 seconds
- Upgrade to paid if you need always-on

### File Uploads
- Free tier doesn't persist uploads (resets on redeploy)
- Solution: Use cloud storage like AWS S3 or Cloudinary
- Or upgrade to paid tier

### MongoDB Atlas
- Free tier has storage limits (512MB)
- Perfect for development/testing
- Upgrade if data grows

### Secrets Security
- **Never commit `.env` files** to GitHub
- Always use dashboard to set secrets
- Generate strong JWT_SECRET (use [this generator](https://randomkeygen.com/))

---

## ✅ TESTING AFTER DEPLOYMENT

### Test Backend Health
```bash
curl https://pathtotech-server.onrender.com/health
```

### Test Frontend
Visit: `https://pathtotech.vercel.app`

### Common Issues

**"Cannot connect to database"**
- Check MongoDB URI is correct
- Verify password has no special characters (URL encode if needed)
- Check MongoDB whitelist includes Render IPs (0.0.0.0/0)

**"CORS errors"**
- Verify CORS_ORIGIN matches your Vercel URL exactly
- Include https:// and no trailing slash

**"Cold start too slow"**
- Normal for free tier
- First request takes 30-60 seconds
- Use paid tier for instant response

---

## 📱 Quick Reference

**Backend URL:** `https://pathtotech-server.onrender.com`
**Frontend URL:** `https://pathtotech.vercel.app`
**API Base:** `https://pathtotech-server.onrender.com/api`

**Dashboard Links:**
- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)

---

## 🆘 Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboard
2. Verify all environment variables are set correctly  
3. Test with `curl` command
4. Check MongoDB connection

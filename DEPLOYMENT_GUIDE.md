# Convo Chat Application - Deployment Guide

## 🚀 Live Deployment Configuration

### Frontend URL
```
https://convo-sxwb.onrender.com
```

### Backend URL (Required)
You need to deploy your backend and update the environment variables.

---

## 📋 Step-by-Step Deployment

### 1️⃣ Backend Deployment (Required!)

Your backend needs to be deployed to handle API requests. Recommended platforms:

#### Option A: Render.com (Recommended)
1. Go to [Render.com](https://render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `convo-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free

5. **Add Environment Variables**:
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://singhps588_db_user:pankaj03@cluster0.nab4cbx.mongodb.net/convo?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://convo-sxwb.onrender.com
   ```

6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `https://convo-backend-xxx.onrender.com`)

#### Option B: Railway.app
1. Go to [Railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add the same environment variables as above
5. Copy your backend URL

---

### 2️⃣ Update Frontend Environment Variables

After deploying the backend, update your frontend:

1. **On Render (Frontend Service)**:
   - Go to your frontend service settings
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url` with your actual backend URL

2. **Redeploy frontend** to apply the changes

---

### 3️⃣ Update Backend CORS (Already Done ✅)

The backend now allows these origins:
- `http://localhost:5173-5178` (for local development)
- `https://convo-sxwb.onrender.com` (your deployed frontend)
- Any URL set in `FRONTEND_URL` environment variable

---

### 4️⃣ Verify Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-url.onrender.com/`
   - You should see:
     ```json
     {
       "message": "Convo Chat API Server",
       "version": "1.0.0",
       "status": "running"
     }
     ```

2. **Test Frontend**:
   - Visit: `https://convo-sxwb.onrender.com`
   - Try creating an account
   - Should work without "Failed to fetch" error

---

## 🔧 Environment Variables Reference

### Backend (.env)
```bash
# Server
PORT=3001
NODE_ENV=production

# Frontend URL for CORS
FRONTEND_URL=https://convo-sxwb.onrender.com

# Database
MONGODB_URI=mongodb+srv://singhps588_db_user:pankaj03@cluster0.nab4cbx.mongodb.net/convo

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
```

### Frontend (Render Environment Variables)
```bash
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🐛 Troubleshooting

### "Failed to fetch" Error
**Cause**: Backend not deployed or CORS not configured  
**Solution**:
1. Deploy backend first
2. Add `FRONTEND_URL` to backend environment variables
3. Add `VITE_API_URL` to frontend environment variables
4. Redeploy both services

### CORS Errors
**Cause**: Frontend URL not in allowed origins  
**Solution**:
1. Check `FRONTEND_URL` in backend .env
2. Verify frontend URL matches exactly (https vs http)
3. Check backend logs for CORS warnings

### Socket.IO Not Connecting
**Cause**: Backend URL not configured in frontend  
**Solution**:
1. Update `VITE_API_URL` in frontend
2. Ensure backend is running
3. Check browser console for connection errors

### Files Not Uploading
**Cause**: Backend uploads directory not persistent  
**Solution**:
1. On Render: Add a persistent disk for `/uploads`
2. Or use cloud storage (AWS S3, Cloudinary, etc.)

---

## 📦 Quick Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Backend environment variables set (MONGODB_URI, JWT_SECRET, FRONTEND_URL)
- [ ] Backend URL copied
- [ ] Frontend environment variable updated (VITE_API_URL)
- [ ] Frontend redeployed
- [ ] Tested signup/login on live site
- [ ] Tested real-time messaging
- [ ] Tested file uploads

---

## 🔗 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://convo-sxwb.onrender.com | ✅ Deployed |
| Backend | **NEEDS DEPLOYMENT** | ❌ Not deployed |
| Database | MongoDB Atlas | ✅ Running |

---

## 📝 Next Steps

1. **Deploy Backend**: Follow Option A or B above
2. **Update Frontend**: Add backend URL to environment variables
3. **Test**: Create account and send messages
4. **Optional**: Set up custom domain
5. **Optional**: Configure cloud file storage for uploads

---

## 💡 Pro Tips

1. **Free Tier Limitations**:
   - Render free tier sleeps after 15 minutes of inactivity
   - First request may take 30-60 seconds to wake up
   - Consider upgrading for production use

2. **Environment Variables**:
   - Never commit `.env` files to git
   - Always use environment variables for secrets
   - Update variables separately for dev/production

3. **Monitoring**:
   - Check Render logs for errors
   - Monitor MongoDB Atlas metrics
   - Set up error tracking (Sentry, LogRocket)

---

**Questions?** Check the backend logs on Render for detailed error messages.

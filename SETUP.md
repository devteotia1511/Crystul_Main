# 🦄 Crystul - Setup Guide

This guide will help you set up Firebase, MongoDB, and Paytm integration for your Crystul application.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- MongoDB Atlas account
- Paytm Business account

## 🔒 Security First - Environment Variables

**⚠️ IMPORTANT: Never commit real credentials to version control!**

### Quick Setup
1. Run the setup script: `node setup-env.js`
2. This creates a `.env.local` file with placeholder values
3. Replace all placeholder values with your actual credentials
4. The `.env.local` file is already in `.gitignore` and will never be committed

### Environment Variables Template

Copy `.env.template` to `.env.local` and fill in your values:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

# MongoDB Configuration
MONGODB_URI=jhjkaafkak

# Paytm Configuration
PAYTM_MERCHANT_ID=your-paytm-merchant-id
PAYTM_MERCHANT_KEY=your-paytm-merchant-key
PAYTM_WEBSITE=WEBSTAGING
PAYTM_INDUSTRY_TYPE=Retail
PAYTM_CHANNEL_ID=WEB
PAYTM_CALLBACK_URL=http://localhost:3001/api/paytm/callback
```

### Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use `.env.template`** for sharing required variables with collaborators
3. **Rotate secrets regularly** - Especially in production
4. **Use different credentials** for development, staging, and production
5. **Validate environment variables** - The app checks for required variables on startup

## 🚀 Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your domain to authorized domains
4. Enable Firestore:
   - Go to Firestore Database
   - Create database in test mode
5. Get your config:
   - Go to Project Settings
   - Copy the config values to your `.env.local`

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `http://localhost:3001/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret to `.env.local`

### 3. MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Add it to `MONGODB_URI` in `.env.local`

### 4. Paytm Setup

1. Go to [Paytm Developer Dashboard](https://developer.paytm.com/)
2. Create a merchant account
3. Get your Merchant ID and Merchant Key
4. Add them to `.env.local`

## 🔧 Development

1. Install dependencies: `npm install`
2. Set up environment variables (see above)
3. Run the development server: `npm run dev`
4. Open [http://localhost:3001](http://localhost:3001)

## 🚀 Production Deployment

### Environment Variables in Production

When deploying to production (Vercel, Netlify, etc.):

1. **Never commit production credentials** to version control
2. **Use platform environment variables**:
   - Vercel: Add in Project Settings > Environment Variables
   - Netlify: Add in Site Settings > Environment Variables
   - Other platforms: Check their documentation

3. **Required production variables**:
   - All variables from `.env.template`
   - Update `NEXTAUTH_URL` to your production domain
   - Update `PAYTM_CALLBACK_URL` to your production domain
   - Use production MongoDB cluster
   - Use production Paytm credentials

### Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No real credentials in `setup-env.js`
- [ ] Production environment variables set in hosting platform
- [ ] Different credentials for dev/staging/production
- [ ] Secrets rotated regularly
- [ ] HTTPS enabled in production

## 🆘 Troubleshooting

### Common Issues

1. **"MONGODB_URI not defined"**
   - Check that `.env.local` exists and has the correct MongoDB URI

2. **"Google OAuth error"**
   - Verify Google Client ID and Secret in `.env.local`
   - Check authorized redirect URIs in Google Cloud Console

3. **"Firebase initialization error"**
   - Verify all Firebase config values in `.env.local`
   - Check Firebase project settings

4. **"Paytm integration error"**
   - Verify Paytm credentials in `.env.local`
   - Check Paytm merchant account status

### Getting Help

- Check the console for detailed error messages
- Verify all environment variables are set correctly
- Ensure all services (Firebase, MongoDB, Paytm) are properly configured 
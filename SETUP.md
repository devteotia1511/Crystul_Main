# 🦄 Unicorn Tank - Setup Guide

This guide will help you set up Firebase, MongoDB, and Paytm integration for your Unicorn Tank application.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- MongoDB Atlas account
- Paytm Business account

## 🔧 Environment Variables

Create a `.env.local` file in your project root with the following variables:

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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unicorntank?retryWrites=true&w=majority

# Paytm Configuration
PAYTM_MERCHANT_ID=your-paytm-merchant-id
PAYTM_MERCHANT_KEY=your-paytm-merchant-key
PAYTM_WEBSITE=WEBSTAGING
PAYTM_INDUSTRY_TYPE=Retail
PAYTM_CHANNEL_ID=WEB
PAYTM_CALLBACK_URL=http://localhost:3001/api/paytm/callback
```

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
     - `http://localhost:3001/api/auth/callback/google`
     - `http://localhost:3001/api/auth/callback/google` (for production)
5. Copy Client ID and Client Secret to `.env.local`

### 3. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string:
   - Go to Clusters > Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add to `MONGODB_URI` in `.env.local`

### 4. Paytm Setup

1. Go to [Paytm Business](https://business.paytm.com/)
2. Create a merchant account:
   - Sign up for a Paytm Business account
   - Complete KYC verification
   - Get your Merchant ID and Merchant Key
   - Add to `.env.local`
3. Configure your account:
   - Set up your business details
   - Configure payment methods
   - Set up callback URLs
4. Test your integration:
   - Use test credentials for development
   - Switch to production credentials for live
   - Test payment flow end-to-end

### 5. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Add the output to `NEXTAUTH_SECRET` in `.env.local`.

## 🏃‍♂️ Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # NextAuth configuration
│   │   └── stripe/
│   │       ├── create-checkout-session/   # Stripe checkout
│   │       └── webhook/                   # Stripe webhooks
│   ├── auth/
│   │   └── login/page.tsx                 # Login page
│   ├── dashboard/page.tsx                 # Dashboard
│   ├── explore/page.tsx                   # Explore users
│   ├── pricing/page.tsx                   # Pricing page
│   └── teams/page.tsx                     # Teams page
├── components/
│   ├── dashboard-layout.tsx               # Dashboard layout
│   ├── team-chat.tsx                      # Team chat
│   └── team-tasks.tsx                     # Team tasks
├── lib/
│   ├── firebase.ts                        # Firebase config
│   ├── mongodb.ts                         # MongoDB connection
│   └── stripe.ts                          # Stripe config
├── models/
│   ├── User.ts                            # User model
│   └── Team.ts                            # Team model
└── .env.local                             # Environment variables
```

## 🔐 Authentication Flow

1. User clicks "Sign In with Google"
2. NextAuth handles OAuth flow
3. User data is saved to MongoDB
4. Session is created with user info
5. User can access protected routes

## 💳 Payment Flow

1. User selects a plan on pricing page
2. Paytm order is created with transaction parameters
3. User is redirected to Paytm payment gateway
4. User completes payment on Paytm
5. Paytm redirects back with payment status
6. User subscription is updated based on payment result

## 🗄️ Database Schema

### User Model
- Firebase UID
- Email, name, avatar
- Skills, interests, experience
- Paytm order ID and transaction ID
- Subscription details

### Team Model
- Name, description
- Founder and members
- Open roles, stage, industry
- Paytm subscription details
- Plan details

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update your production environment variables:
- `NEXTAUTH_URL`: Your production domain
- `MONGODB_URI`: Production MongoDB connection
- Paytm credentials: Use production Merchant ID and Key
- Callback URL: Update to production domain

## 🔧 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Google OAuth credentials
   - Verify Firebase configuration
   - Ensure redirect URIs are correct

2. **Database connection failed**
   - Check MongoDB connection string
   - Verify network access in Atlas
   - Check user permissions

3. **Paytm payments not working**
   - Verify Merchant ID and Key are correct
   - Check callback URL is accessible
   - Ensure Paytm account is properly configured

4. **Environment variables not loading**
   - Restart development server
   - Check variable names match exactly
   - Verify `.env.local` is in project root

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Check the server logs for API errors
4. Ensure all services are properly configured

## 🎉 Next Steps

After setup, you can:

1. Customize the subscription plans
2. Add more payment gateways (Razorpay, etc.)
3. Implement team billing
4. Add analytics and reporting
5. Set up email notifications
6. Add more authentication providers

Happy coding! 🦄✨ 
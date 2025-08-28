# 🦄 Crystul

A modern team collaboration platform built with Next.js, Firebase, MongoDB, and Paytm integration.

## 🔒 Security First

This project follows security best practices to protect sensitive credentials:

- ✅ **No real credentials in code** - All sensitive data is in environment variables
- ✅ **Safe for public repositories** - `setup-env.js` contains only placeholder values
- ✅ **Proper .gitignore** - `.env.local` is excluded from version control
- ✅ **Environment validation** - App validates required variables on startup
- ✅ **Template sharing** - `.env.template` safely shares required variables

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TeamUP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   node setup-env.js
   ```
   This creates `.env.local` with placeholder values. Replace them with your actual credentials.

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Required Variables

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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unicorntank

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
2. **Use different credentials** for development, staging, and production
3. **Rotate secrets regularly** - Especially in production
4. **Validate environment variables** - The app checks for required variables
5. **Use platform environment variables** in production (Vercel, Netlify, etc.)

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Security Guide](./SECURITY.md) - Security best practices
- [API Documentation](./API.md) - API endpoints and usage

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with Mongoose
- **Backend Services**: Firebase (Auth, Firestore)
- **Payments**: Paytm Integration
- **Deployment**: Vercel (recommended)

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Production

When deploying to production:

1. **Never commit production credentials** to version control
2. **Use platform environment variables**:
   - Vercel: Project Settings > Environment Variables
   - Netlify: Site Settings > Environment Variables
3. **Update URLs** for production domain
4. **Use production credentials** for all services

## 🆘 Troubleshooting

### Common Issues

1. **"Environment variable not defined"**
   - Check that `.env.local` exists and has correct values
   - Run `node setup-env.js` to create the file

2. **"Google OAuth error"**
   - Verify Google Client ID and Secret in `.env.local`
   - Check authorized redirect URIs in Google Cloud Console

3. **"MongoDB connection failed"**
   - Verify MongoDB URI in `.env.local`
   - Check network access in MongoDB Atlas

4. **"Paytm integration error"**
   - Verify Paytm credentials in `.env.local`
   - Check Paytm merchant account status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

<!-- ------------------------------------------------------- -->

1. Firebase Setup

🧩 Why are we using Firebase?

Firebase gives you ready-to-use backend services like Authentication and Realtime/Cloud Firestore Database — you don’t have to build login systems or database infrastructure from scratch.

🔧 What are we doing?
	•	Authentication → Google Sign-in:
You’re letting users log in using their Google account, securely.
	•	Firestore Database:
It’s used to store and manage app data (like user profiles, posts, etc.) in real-time.

💸 Free Tier Support (as of now):
	•	Authentication: 10K verifications/month (Email, Google, etc.) – more than enough for small projects
	•	Firestore:
	•	50K document reads/day
	•	20K writes/day
	•	1 GB storage
	•	Easily enough for a small-to-medium MVP

⸻

✅ 2. Google OAuth Setup

🧩 Why are we using this?

This is where you get Google login credentials (OAuth Client ID & Secret). Firebase needs this to handle Google sign-in securely.

🔧 What are we doing?
	•	Creating OAuth credentials to securely connect users’ Google accounts to your app.
	•	Redirect URIs ensure that Google knows where to send the user after successful login.

💸 Free Tier Support:
	•	Google OAuth is free for basic usage
	•	Google Cloud has a $300 free credit (once per new account) and many services like OAuth don’t charge for standard use.

⸻

✅ 3. MongoDB Setup

🧩 Why are we using MongoDB?

MongoDB stores app data like user information, products, transactions, etc. It’s a NoSQL document database, great for flexibility and speed.

If you’re also using Firestore, MongoDB might be used for more complex or relational data that doesn’t suit Firestore — or vice versa.

🔧 What are we doing?
	•	Creating a cloud database on Atlas
	•	Creating a user with permissions
	•	Getting the connection URI to plug into your app (MONGODB_URI)

💸 Free Tier Support:
	•	Shared Cluster (M0 tier): Totally free
	•	512MB storage
	•	100 concurrent connections
	•	Great for MVPs, portfolios, or small projects

⸻

🔐 What is .env.local?

It’s where you store all your secret environment variables, like:
	•	Firebase keys
	•	Google OAuth Client ID/Secret
	•	MongoDB connection URI

This file should not be pushed to GitHub if your repo is public.


Q. Why we use both?

Some teams use:
	•	Firestore for real-time user interaction
	•	MongoDB for core data models or business logic

For example: You could use Firebase Auth + Firestore to store real-time session info and use MongoDB for storing product data, orders, or analytics.


## Email (SMTP) setup
To enable email notifications (e.g., connection requests), set the following environment variables:

```
SMTP_HOST=your_smtp_host
SMTP_PORT=587 # 465 for SSL, 587 for STARTTLS
SMTP_USER=your_smtp_username_or_email
SMTP_PASS=your_smtp_password_or_api_key
# Optional; defaults to SMTP_USER
SMTP_FROM=no-reply@yourdomain.com
```

Provider tips:
- Gmail: use `smtp.gmail.com`, port 465 or 587, and a Google App Password (2FA required). `SMTP_FROM` should be your Gmail address.
- Mailtrap (testing): use the SMTP credentials from your Mailtrap inbox; emails are captured in Mailtrap.
- SendGrid: `SMTP_HOST=smtp.sendgrid.net`, `SMTP_USER=apikey`, `SMTP_PASS=<your-sendgrid-api-key>`, and `SMTP_FROM` must be a verified sender.

The app sends as: `Sender Name via Crystul <SMTP_FROM>` and sets `Reply-To` to the actual sender's email so replies go directly to them.


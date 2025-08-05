# 🦄 Unicorn Tank

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

## 🆘 Support

- Check the [Setup Guide](./SETUP.md) for detailed instructions
- Review the [Security Guide](./SECURITY.md) for best practices
- Open an issue for bugs or feature requests

---

**⚠️ Important**: Never commit real credentials to version control. Always use environment variables for sensitive data. 
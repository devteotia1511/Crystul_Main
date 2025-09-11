# Production Environment Configuration

## Current Sign-Out Redirect Issue

The sign-out is redirecting to `unicorntank.netlify.app` because the production environment variables are still configured for that domain.

## ✅ Fixed in Code

The following changes have been made to fix the redirect issue:

1. **NextAuth Configuration** (`app/api/auth/[...nextauth]/route.ts`):
   - Added `signOut: "/"` page configuration
   - Added proper redirect callback to handle URL redirects
   - Fixed callback flow to redirect to homepage

2. **Dashboard Sign-Out** (`components/dashboard-navbar.tsx`):
   - Updated signOut call to use `{ callbackUrl: '/' }`
   - Ensures explicit redirect to homepage

## 🔧 Production Environment Variables to Update

When deploying to your new domain, make sure to update these environment variables:

### Netlify Environment Variables

Go to your Netlify site settings → Environment Variables and update:

**⚠️ Important:** Keep your existing credential values! Only update the URLs and domain references.

```env
# Update this to your new domain
NEXTAUTH_URL=https://your-new-domain.netlify.app

# Keep your existing values for these:
NEXTAUTH_SECRET=your-existing-nextauth-secret
GOOGLE_CLIENT_ID=your-existing-google-client-id
GOOGLE_CLIENT_SECRET=your-existing-google-client-secret

# Firebase - update auth domain to match your project
NEXT_PUBLIC_FIREBASE_API_KEY=your-existing-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-new-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-new-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-new-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-existing-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-existing-app-id

# MongoDB - update database name if needed
MONGODB_URI=your-existing-mongodb-uri
```

## 🔧 Google OAuth Configuration

In Google Cloud Console, make sure your OAuth 2.0 Client has the correct redirect URIs:

**Authorized redirect URIs:**
- `https://your-new-domain.netlify.app/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (for development)

## 🔧 Firebase Configuration

In Firebase Console:
1. Update **Authorized domains** in Authentication → Settings → Authorized domains
2. Add your new domain: `your-new-domain.netlify.app`
3. Remove the old domain if no longer needed

## 🚀 Deployment Steps

1. **Update Netlify Environment Variables** with new domain
2. **Update Google OAuth redirect URIs** in Google Cloud Console
3. **Update Firebase authorized domains** in Firebase Console
4. **Redeploy** your application on Netlify
5. **Test sign-out** - it should now redirect to your homepage

## ✅ Verification Checklist

After deployment, test:
- [ ] Sign in works correctly
- [ ] Dashboard loads properly
- [ ] Sign out redirects to homepage (not unicorntank.netlify.app)
- [ ] All pages load correctly
- [ ] No console errors related to authentication

## 🆘 Still Having Issues?

If the redirect still goes to the wrong domain after updating environment variables:

1. **Check browser cache** - Clear all site data for both domains
2. **Check Netlify deployment logs** for any errors
3. **Verify environment variables** are correctly set in Netlify dashboard
4. **Check that the deployment used the latest code** with the NextAuth fixes

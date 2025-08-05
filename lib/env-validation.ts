/**
 * Environment Variable Validation
 * 
 * This utility validates that all required environment variables are present
 * and provides helpful error messages if any are missing.
 */

export function validateEnvironmentVariables() {
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'MONGODB_URI'
  ];

  const missingVars: string[] = [];
  const placeholderVars: string[] = [];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    
    if (!value) {
      missingVars.push(varName);
    } else if (value.includes('your-') || value.includes('placeholder')) {
      placeholderVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Only warn about placeholder values in development, don't throw
  if (placeholderVars.length > 0) {
    console.warn(`⚠️  Environment variables contain placeholder values: ${placeholderVars.join(', ')}. Please set actual values for production.`);
  }
}

export function validateEnvironmentVariablesOnStartup() {
  if (typeof window === 'undefined') {
    // Only run on server-side
    try {
      validateEnvironmentVariables();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Environment validation failed:', errorMessage);
      // Don't throw in production to avoid breaking the app
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Continuing with placeholder values for development...');
      }
    }
  }
}

export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  
  // In development, allow placeholder values but warn
  if (value.includes('your-') || value.includes('placeholder')) {
    console.warn(`⚠️  Environment variable ${name} contains placeholder value. This will not work in production.`);
    // For development, return the placeholder value instead of throwing
    if (process.env.NODE_ENV === 'development') {
      return value;
    }
  }
  
  return value;
}

export function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}
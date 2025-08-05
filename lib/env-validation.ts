/**
 * Environment Variable Validation
 * 
 * This utility validates that all required environment variables are present
 * and provides helpful error messages if any are missing.
 */

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  errors: string[];
}

export function validateEnvironmentVariables(): EnvValidationResult {
  const requiredVars = [
    // NextAuth
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    
    // Google OAuth
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    
    // Firebase (public variables)
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    
    // MongoDB
    'MONGODB_URI',
    
    // Paytm
    'PAYTM_MERCHANT_ID',
    'PAYTM_MERCHANT_KEY',
    'PAYTM_WEBSITE',
    'PAYTM_INDUSTRY_TYPE',
    'PAYTM_CHANNEL_ID',
    'PAYTM_CALLBACK_URL',
  ];

  const missing: string[] = [];
  const errors: string[] = [];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    
    if (!value || value.trim() === '') {
      missing.push(varName);
      errors.push(`Missing required environment variable: ${varName}`);
    } else if (value.includes('your-') || value.includes('placeholder')) {
      errors.push(`Environment variable ${varName} contains placeholder value. Please set the actual value.`);
    }
  }

  return {
    isValid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
  };
}

export function validateEnvironmentVariablesOnStartup(): void {
  if (process.env.NODE_ENV === 'production') {
    const result = validateEnvironmentVariables();
    
    if (!result.isValid) {
      console.error('❌ Environment validation failed:');
      result.errors.forEach(error => console.error(`  - ${error}`));
      console.error('\n📝 Please check your environment variables and ensure all required values are set.');
      console.error('💡 For development, run: node setup-env.js');
      console.error('💡 For production, set environment variables in your hosting platform.');
      
      // In production, we might want to exit the process
      // process.exit(1);
    } else {
      console.log('✅ Environment variables validated successfully');
    }
  }
}

// Helper function to get environment variable with validation
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  if (value.includes('your-') || value.includes('placeholder')) {
    throw new Error(`Environment variable ${name} contains placeholder value. Please set the actual value.`);
  }
  
  return value;
}

// Helper function to get optional environment variable with default
export function getOptionalEnvVar(name: string, defaultValue: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value : defaultValue;
} 
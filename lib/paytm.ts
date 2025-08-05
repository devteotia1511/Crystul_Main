import PaytmChecksum from 'paytmchecksum';

// Paytm Configuration
export const PAYTM_CONFIG = {
  MERCHANT_ID: process.env.PAYTM_MERCHANT_ID!,
  MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY!,
  WEBSITE: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
  INDUSTRY_TYPE: process.env.PAYTM_INDUSTRY_TYPE || 'Retail',
  CHANNEL_ID: process.env.PAYTM_CHANNEL_ID || 'WEB',
  CALLBACK_URL: process.env.PAYTM_CALLBACK_URL || 'http://localhost:3001/api/paytm/callback',
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Up to 3 team members',
      'Basic project management',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 999, // ₹999
    features: [
      'Up to 10 team members',
      'Advanced project management',
      'Priority support',
      'Analytics dashboard',
      'Custom integrations',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 2999, // ₹2999
    features: [
      'Unlimited team members',
      'Advanced security',
      'Dedicated support',
      'Custom branding',
      'API access',
      'Advanced analytics',
    ],
  },
};

// Generate Paytm transaction parameters
export async function generatePaytmParams(orderId: string, amount: number, customerEmail: string, customerName: string) {
  const paytmParams: any = {
    MID: PAYTM_CONFIG.MERCHANT_ID,
    ORDER_ID: orderId,
    CUST_ID: customerEmail,
    TXN_AMOUNT: amount.toString(),
    CHANNEL_ID: PAYTM_CONFIG.CHANNEL_ID,
    WEBSITE: PAYTM_CONFIG.WEBSITE,
    INDUSTRY_TYPE_ID: PAYTM_CONFIG.INDUSTRY_TYPE,
    CALLBACK_URL: PAYTM_CONFIG.CALLBACK_URL,
    EMAIL: customerEmail,
    MOBILE_NO: '9999999999', // You can make this dynamic
    CHECKSUMHASH: '',
  };

  // Generate checksum
  const checksum = await PaytmChecksum.generateSignature(paytmParams, PAYTM_CONFIG.MERCHANT_KEY);
  paytmParams.CHECKSUMHASH = checksum;

  return paytmParams;
}

// Verify Paytm response
export async function verifyPaytmResponse(response: any) {
  const paytmChecksum = response.CHECKSUMHASH;
  delete response.CHECKSUMHASH;

  const isValidChecksum = PaytmChecksum.verifySignature(response, PAYTM_CONFIG.MERCHANT_KEY, paytmChecksum);
  
  return {
    isValid: isValidChecksum,
    status: response.STATUS,
    transactionId: response.TXNID,
    orderId: response.ORDERID,
    amount: response.TXNAMOUNT,
    responseCode: response.RESPCODE,
    responseMessage: response.RESPMSG,
  };
} 
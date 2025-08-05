import { NextRequest, NextResponse } from 'next/server';
import { verifyPaytmResponse } from '@/lib/paytm';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const response: any = {};
    
    // Convert FormData to object
    Array.from(formData.entries()).forEach(([key, value]) => {
      response[key] = value;
    });

    console.log('Paytm callback response:', response);

    // Verify the response
    const verificationResult = await verifyPaytmResponse(response);
    
    if (!verificationResult.isValid) {
      console.error('Invalid Paytm response checksum');
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/pricing?error=invalid_response`);
    }

    await dbConnect();

    // Find user by order ID
    const user = await User.findOne({ paytmOrderId: response.ORDERID });
    
    if (!user) {
      console.error('User not found for order:', response.ORDERID);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/pricing?error=user_not_found`);
    }

    if (verificationResult.status === 'TXN_SUCCESS') {
      // Payment successful
      user.subscription = user.pendingPlan || 'pro';
      user.paytmTransactionId = verificationResult.transactionId;
      user.paytmOrderId = undefined; // Clear pending order
      user.pendingPlan = undefined;
      await user.save();

      console.log('Payment successful for user:', user.email);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?success=true`);
    } else {
      // Payment failed
      user.paytmOrderId = undefined;
      user.pendingPlan = undefined;
      await user.save();

      console.log('Payment failed for user:', user.email, verificationResult.responseMessage);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/pricing?error=payment_failed&message=${encodeURIComponent(verificationResult.responseMessage)}`);
    }
  } catch (error) {
    console.error('Paytm callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/pricing?error=callback_error`);
  }
} 
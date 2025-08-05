import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generatePaytmParams, SUBSCRIPTION_PLANS } from '@/lib/paytm';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { plan } = await req.json();
    
    if (!plan || !SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const user = await User.findOne({ email: authSession.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const selectedPlan = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    
    if (plan === 'free') {
      // Update user to free plan
      user.subscription = 'free';
      await user.save();
      
      return NextResponse.json({ success: true, plan: 'free' });
    }

    // Generate unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate Paytm parameters
    const paytmParams = await generatePaytmParams(
      orderId,
      selectedPlan.price,
      user.email,
      user.name || user.email
    );

    // Save order details to user (you might want to create a separate Order model)
    user.paytmOrderId = orderId;
    user.pendingPlan = plan;
    await user.save();

    return NextResponse.json({
      success: true,
      paytmParams,
      orderId,
      amount: selectedPlan.price,
    });
  } catch (error) {
    console.error('Paytm order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
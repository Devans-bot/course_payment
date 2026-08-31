import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: Request) {
  try {
    const { amount = 2, currency = 'INR' } = await request.json();

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt: `receipt_${uuidv4().substring(0, 8)}`,
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
}

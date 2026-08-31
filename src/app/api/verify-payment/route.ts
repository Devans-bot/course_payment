import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Reconstruct the expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    // Compare the signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified successfully. 
      return NextResponse.json(
        { message: "Payment verified successfully", isOk: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid signature", isOk: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Error verifying payment", isOk: false, error },
      { status: 500 }
    );
  }
}

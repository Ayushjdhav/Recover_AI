import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { createRecoveryCaseForPayment } from "@/lib/recovery-actions";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Webhook signature mismatch — rejecting request");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "payment.failed") {
    return NextResponse.json({ status: "ignored" });
  }

  const paymentData = event.payload.payment.entity;

  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id")
    .eq("razorpay_payment_id", paymentData.id)
    .maybeSingle();

  if (existingPayment) {
    return NextResponse.json({ status: "already processed" });
  }

  let { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("email", paymentData.email)
    .maybeSingle();

  if (!customer) {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({
        name: paymentData.email?.split("@")[0] ?? "Unknown",
        email: paymentData.email ?? "unknown@example.com",
        total_successful_payments: 0,
        total_failed_payments: 1,
      })
      .select()
      .single();
    customer = newCustomer;
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      razorpay_payment_id: paymentData.id,
      customer_id: customer?.id,
      amount: paymentData.amount / 100,
      currency: paymentData.currency,
      status: "failed",
      failure_reason: paymentData.error_reason ?? "UNKNOWN",
    })
    .select()
    .single();

  if (paymentError) {
    console.error("Error saving payment from webhook:", paymentError);
    return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
  }

  await createRecoveryCaseForPayment({ ...payment, customers: customer });

  return NextResponse.json({ status: "processed" });
}
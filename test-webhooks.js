const crypto = require("crypto");

const secret = "recoverai_webhook_secret_2026"; // must match your .env.local exactly

const payload = {
  event: "payment.failed",
  payload: {
    payment: {
      entity: {
        id: "pay_test_simulated_003",
        amount: 1499900,
        currency: "INR",
        email: "testcustomer@example.com",
        error_reason: "INSUFFICIENT_FUNDS",
      },
    },
  },
};

const body = JSON.stringify(payload);

const signature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

fetch("http://localhost:3000/api/webhooks/razorpay", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-razorpay-signature": signature,
  },
  body: body,
})
  .then((res) => res.json())
  .then((data) => console.log("Response:", data))
  .catch((err) => console.error("Error:", err));
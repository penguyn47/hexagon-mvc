const PayOS = require("@payos/node");

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

module.exports.createPaymentLink = async (requestData) => {
  return await payos.createPaymentLink(requestData);
};

module.exports.verifyPaymentWebhook = (req) => {
  const webhookBody = req.body;
  return payos.verifyPaymentWebhookData(webhookBody);
};

// (async () => {
//   try {
//     await payos.confirmWebhook(
//       "https://dc9c-113-161-66-26.ngrok-free.app/orders/payment/success"
//     );
//     console.log("Webhook confirmed successfully!");
//   } catch (error) {
//     console.error("Error confirming webhook:", error.message);
//   }
// })();
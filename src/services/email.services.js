const sendEmail = require("../utils/sendEmail");
const User = require("../models/user.model");

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}
async function sendOrderConfirmation(order) {
  const user = await User.findById(order.user);
  if (!user) throw createError("User Id Not Correct", 400);
  const email = user.email;
  const name = user.username;
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name} (x${item.quantity})</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.price.toFixed(2)}</td>
        </tr>
    `,
    )
    .join("");
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #333;">Thank you for your order, ${name}!</h2>
                <p>We're getting your order ready. Below is your confirmation details.</p>
                <p><strong>Order ID:</strong> #${order.id}</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #f8f8f8;">
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <h3 style="text-align: right; margin-top: 20px; color: #111;">Total: ${order.totalPrice.toFixed(2)}</h3>
                <h3 style="text-align: right; margin-top: 20px; color: #111;">shipping Address: ${order.shippingAddress.address}</h3>
                <h3 style="text-align: right; margin-top: 20px; color: #111;">payment Method: ${order.paymentMethod}</h3>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">If you have any questions, reply to this email.</p>
            </div>`;
  await sendEmail({
    to: email,
    subject: "Order Confirmation",
    text: "Order Created Successfully!",
    html,
  });
}

async function sendPaymentConfirmation(order) {
  const user = await User.findById(order.user);
  if (!user) throw createError("User Id Not Correct", 400);
  const email = user.email;
  const name = user.username;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4CAF50;">Payment Successful!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for your purchase. We have successfully received your payment.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Amount Paid:</strong> ${order.totalPrice.toFixed(2)}</p>
      </div>
      
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>Company Team</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Payment Confirmation",
    text: "Your Payment processed successfully",
    html,
  });
}

module.exports = {
  sendOrderConfirmation,
  sendPaymentConfirmation,
};

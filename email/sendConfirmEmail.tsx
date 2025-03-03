import { Resend } from 'resend';
import { Order } from '@/types';
import { SENDER_EMAIL } from '@/lib/constatnts';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async ({ order }: { order: Order }) => {
    try {
        const response = await resend.emails.send({
            from: `${SENDER_EMAIL}`,
            to: order.user.email,
            subject: `Order Confirmation - ${order.id}`,
            html: `
        <h1>Thank you for your order!</h1>
        <p>Your order ID: <strong>${order.id}</strong></p>
        <p>Total: <strong>${order.totalPrice}</strong></p>
        <h2>Items:</h2>
        <ul>
          ${order.orderItems
                    .map(
                        (item) =>
                            `<li>${item.name} - ${item.qty} x ${item.totalPrice} <br />
                <img src="${item.image}" alt="${item.name}" width="100" />
                </li>`
                    )
                    .join('')}
        </ul>
      `,
        });

        console.log('Email sent:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

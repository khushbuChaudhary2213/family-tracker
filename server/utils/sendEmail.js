const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (options) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email: options.email,
        },
      ],

      subject: options.subject,

      textContent: options.message,

      ...(options.html && {
        htmlContent: options.html,
      }),
    });

    // console.log("Email sent:", response.messageId);

    return response;
  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;

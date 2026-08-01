const passwordResetTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sentry Password Reset</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;background:#f4f6f8;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background:#131313;padding:28px;text-align:center;">
              <h1 style="margin:0;color:#b0c6ff;font-size:28px;letter-spacing:2px;">
                SENTRY
              </h1>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:13px;">
                Family Protection & Real-time Security
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:35px;">

              <h2 style="margin:0 0 15px;color:#111827;font-size:22px;">
                Password Reset Request
              </h2>

              <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
                We received a request to reset your Sentry account password.
                Use the verification code below to continue.
              </p>

              <!-- OTP -->
              <div style="text-align:center;margin:25px 0;">
                <div style="
                  display:inline-block;
                  background:#f0f4ff;
                  border:1px solid #d7e0ff;
                  border-radius:10px;
                  padding:18px 35px;
                ">
                  <span style="
                    display:block;
                    color:#6b7280;
                    font-size:11px;
                    font-weight:bold;
                    letter-spacing:2px;
                    margin-bottom:8px;
                  ">
                    VERIFICATION CODE
                  </span>

                  <span style="
                    color:#002d6e;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                  ">
                    ${otp}
                  </span>
                </div>
              </div>

              <p style="color:#4b5563;font-size:14px;">
                ⏱️ This code will expire in <strong>10 minutes</strong>.
              </p>

              <p style="color:#4b5563;font-size:14px;line-height:1.6;">
                For your security, never share this code with anyone.
                Sentry support will never ask you for your OTP.
              </p>

              <div style="
                margin-top:25px;
                padding:15px;
                background:#fff7ed;
                border:1px solid #fed7aa;
                border-radius:8px;
                color:#9a3412;
                font-size:13px;
                line-height:1.5;
              ">
                <strong>Didn't request this?</strong><br />
                You can safely ignore this email. Your password will remain unchanged.
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background:#f9fafb;
              border-top:1px solid #e5e7eb;
              padding:20px;
              text-align:center;
            ">
              <p style="margin:0;color:#6b7280;font-size:12px;">
                This is an automated security email from Sentry Family Tracker.
              </p>

              <p style="margin:6px 0 0;color:#9ca3af;font-size:11px;">
                © ${new Date().getFullYear()} Sentry Family Tracker
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};

module.exports = {
  passwordResetTemplate,
};

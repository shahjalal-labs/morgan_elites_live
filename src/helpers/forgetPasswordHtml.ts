export const forgotPasswordHtml = (firstName: string, otp: string) => `
<!doctype html>
<html>
  <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
  <body style="margin:0;padding:0;background:#f1f6ff;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(90deg,#ff8a65,#ffb86b);padding:24px 28px;color:#fff;">
                <h2 style="margin:0;font-size:20px;">Password Reset Request</h2>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.95; color: #fff;">Hello <strong>${firstName}</strong>,</p>
              </td>
            </tr>

            <tr>
              <td style="background:#ffffff;padding:24px 28px;color:#0b1220;">
                <p style="font-size:14px;margin:0 0 12px;">We received a request to reset your password. Enter the OTP below to continue. It will expire in <strong>5 minutes</strong>.</p>

                <div style="text-align:center;margin:18px 0;">
                  <div style="display:inline-block;padding:16px 26px;border-radius:12px;border:1px solid #eef2ff;font-size:32px;font-weight:700;">
                    ${otp}
                  </div>
                </div>

                <p style="font-size:13px;color:#55607a;margin-bottom:18px;">If you didn't request a password reset, ignore this email or secure your account.</p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc;padding:14px 18px;text-align:center;color:#9aa4b2;font-size:12px;">
                © ${new Date().getFullYear()} Elites-Live Stream — Need help? Reply this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

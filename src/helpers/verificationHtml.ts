export const verificationHtml = (firstName: string, otp: string) => {
  return `<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width"/>
  </head>
  <body style="margin:0;padding:0;background: #f5f7fb;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:30px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(2,6,23,0.08);">
            <tr>
              <td style="background:linear-gradient(90deg, #7b61ff, #00d4ff);padding:28px 30px;color: #fff;text-align:left;">
                <h1 style="margin:0;font-size:22px;letter-spacing:0.2px;">Account verification</h1>
                <p style="margin:6px 0 0;font-size:14px;opacity:0.95; color: #fff;">Hi <strong>${firstName}</strong>,</p>
              </td>
            </tr>

            <tr>
              <td style="background: #ffffff;padding:30px 30px 20px;color: #0f172a;">
                <p style="margin:0 0 14px;font-size:15px;">Use the one-time password (OTP) below to complete your action. This code is valid for <strong>5 minutes</strong>.</p>

                <div style="display:flex;align-items:center;justify-content:center;margin:18px 0;">
                  <div style="font-size:34px;font-weight:700;padding:18px 28px;border-radius:10px;background:linear-gradient(180deg, #fff, #f8fbff);box-shadow:0 6px 18px rgba(11,22,80,0.06);border:1px dashed rgba(0,0,0,0.05);">
                    <span style="letter-spacing:3px;color: #12263f;">${otp}</span>
                  </div>
                </div>

                <p style="margin:0 0 20px;font-size:13px;color: #475569;">If you didn't request this, you can safely ignore this email. For help, reply to this message or contact support.</p>
              </td>
            </tr>

            <tr>
              <td style="background:#0f172a;padding:18px 30px;color:#cbd5e1;font-size:13px;text-align:center;">
                <div>Thanks — Elites Live Stream Support Team</div>
                <div style="opacity:0.7;margin-top:6px;font-size:12px;">If this wasn't you, secure your account immediately.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

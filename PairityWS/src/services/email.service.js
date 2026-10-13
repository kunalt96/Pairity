import { Resend } from 'resend';

let resendClient;

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export async function sendOtpEmail(email, otp) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error('EMAIL_FROM is not set');

  const { error } = await getClient().emails.send({
    from,
    to: email,
    subject: 'Your Pairity verification code',
    text: `Your Pairity verification code is ${otp}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    html: `<!doctype html><html><body style="margin:0;background:#f7f5f2;font-family:Arial,sans-serif;color:#25231f"><main style="max-width:520px;margin:40px auto;padding:32px;background:#fff;border-radius:12px"><h1 style="font-size:22px">Your Pairity code</h1><p>Use this code to continue. It expires in 10 minutes.</p><p style="font-size:32px;font-weight:700;letter-spacing:8px">${escapeHtml(otp)}</p><p style="font-size:13px;color:#68645e">If you did not request this code, you can ignore this email.</p></main></body></html>`,
  });

  if (error) throw new Error(`Resend could not send OTP email: ${error.message}`);
}

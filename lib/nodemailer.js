import nodemailer from "nodemailer";

export const mailConfiguration = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

          <div style="background-color: #2563eb; color: #ffffff; padding: 16px 24px;">
            <h2 style="margin: 0; font-size: 20px;">Email Verification</h2>
          </div>

          <div style="padding: 24px; color: #333333;">
            <p style="font-size: 14px; margin-bottom: 16px;">
              Thank you for registering. Please use the OTP below to verify your email address.
            </p>

            <div style="text-align: center; margin: 24px 0;">
              <span style="
                display: inline-block;
                font-size: 28px;
                letter-spacing: 6px;
                font-weight: bold;
                color: #2563eb;
                background-color: #f0f4ff;
                padding: 12px 24px;
                border-radius: 6px;
              ">
                ${otp}
              </span>
            </div>

            <p style="font-size: 13px; color: #555;">
              This OTP is valid for <strong>3 minutes</strong>.
              Please do not share this code with anyone.
            </p>

            <p style="font-size: 13px; color: #555; margin-top: 16px;">
              If you did not create an account, you can safely ignore this email.
            </p>
          </div>

          <div style="background-color: #f4f6f8; text-align: center; padding: 12px; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Auth System. All rights reserved.
          </div>

        </div>
      </div>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
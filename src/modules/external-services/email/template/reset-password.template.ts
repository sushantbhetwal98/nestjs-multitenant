export const generateResetPasswordTemplate = (
  firstName: string,
  lastName: string,
  resetLink: string,
) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
          .header {
              background-color: #007bff;
              color: #ffffff;
              padding: 20px;
              text-align: center;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content p {
              font-size: 16px;
              margin: 10px 0;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 10px;
              text-align: center;
              font-size: 14px;
              color: #666;
          }
          .button {
              display: inline-block;
              background-color: #007bff;
              text: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              font-size: 16px;
              font-weight: semibold;
              margin-top: 20px;
          }
          .button:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Reset Your Password</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName} ${lastName},</p>
              <p>We received a request to reset your password. If you made this request, please click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset Your Password</a>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
              <p>For your security, the link will expire in 5 minutes.</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 sushant.dev All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`;
};

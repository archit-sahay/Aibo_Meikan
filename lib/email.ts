import nodemailer from 'nodemailer'

const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'contact.infibiz@gmail.com',
    pass: process.env.SMTP_PASSWORD || '',
  },
}

// Validate SMTP configuration
if (!SMTP_CONFIG.auth.pass) {
  console.warn('SMTP_PASSWORD environment variable is not set. Email functionality will not work.')
}

// Create reusable transporter object
const transporter = nodemailer.createTransport(SMTP_CONFIG)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"Infibizz" <${SMTP_CONFIG.auth.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    }

    await transporter.verify()
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

export async function sendRegistrationEmail(partnerData: {
  name: string
  email: string
  uniqueCode: string
  phoneNumbers: string[]
  city: string
  state: string
  pinCode: string
  address: string
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code-box { background-color: white; border: 2px solid #2563eb; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 28px; font-weight: bold; color: #2563eb; font-family: monospace; }
          .info { margin: 15px 0; }
          .label { font-weight: bold; color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Infibizz!</h1>
          </div>
          <div class="content">
            <p>Dear ${partnerData.name},</p>
            <p>Thank you for registering as a partner with Infibizz. We're excited to have you on board!</p>
            
            <div class="code-box">
              <p style="margin: 0 0 10px 0; color: #6b7280;">Your Unique Partner Code:</p>
              <div class="code">${partnerData.uniqueCode}</div>
            </div>
            
            <p><strong>Please save this code for your records.</strong></p>
            
            <h3>Your Registration Details:</h3>
            <div class="info">
              <span class="label">Name:</span> ${partnerData.name}
            </div>
            <div class="info">
              <span class="label">Email:</span> ${partnerData.email}
            </div>
            <div class="info">
              <span class="label">Phone:</span> ${partnerData.phoneNumbers.join(', ')}
            </div>
            <div class="info">
              <span class="label">Address:</span> ${partnerData.address}, ${partnerData.city}, ${partnerData.state} - ${partnerData.pinCode}
            </div>
            
            <p style="margin-top: 30px;">We'll be in touch soon with more information about how to get started.</p>
            
            <p>Best regards,<br>The Infibizz Team</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
Welcome to Infibizz!

Dear ${partnerData.name},

Thank you for registering as a partner with Infibizz. We're excited to have you on board!

Your Unique Partner Code: ${partnerData.uniqueCode}

Please save this code for your records.

Your Registration Details:
- Name: ${partnerData.name}
- Email: ${partnerData.email}
- Phone: ${partnerData.phoneNumbers.join(', ')}
- Address: ${partnerData.address}, ${partnerData.city}, ${partnerData.state} - ${partnerData.pinCode}

We'll be in touch soon with more information about how to get started.

Best regards,
The Infibizz Team
  `

  // Send to admin
  const adminEmailSent = await sendEmail({
    to: SMTP_CONFIG.auth.user,
    subject: `New Partner Registration: ${partnerData.name}`,
    html: `
      <h2>New Partner Registration</h2>
      <p><strong>Name:</strong> ${partnerData.name}</p>
      <p><strong>Email:</strong> ${partnerData.email}</p>
      <p><strong>Phone:</strong> ${partnerData.phoneNumbers.join(', ')}</p>
      <p><strong>Address:</strong> ${partnerData.address}, ${partnerData.city}, ${partnerData.state} - ${partnerData.pinCode}</p>
      <p><strong>Unique Code:</strong> ${partnerData.uniqueCode}</p>
      <p><strong>Registered At:</strong> ${new Date().toLocaleString()}</p>
    `,
  })

  // Send to partner
  const partnerEmailSent = await sendEmail({
    to: partnerData.email,
    subject: 'Welcome to Infibizz - Your Partner Code',
    html,
    text,
  })

  return adminEmailSent && partnerEmailSent
}

export async function sendContactEmail(contactData: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info { margin: 15px 0; padding: 10px; background-color: white; border-radius: 4px; }
          .label { font-weight: bold; color: #4b5563; }
          .message { margin-top: 20px; padding: 15px; background-color: white; border-left: 4px solid #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="info">
              <span class="label">Name:</span> ${contactData.name}
            </div>
            <div class="info">
              <span class="label">Email:</span> ${contactData.email}
            </div>
            <div class="info">
              <span class="label">Subject:</span> ${contactData.subject}
            </div>
            <div class="message">
              <p><strong>Message:</strong></p>
              <p>${contactData.message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
              Submitted at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: SMTP_CONFIG.auth.user,
    subject: `Contact Form: ${contactData.subject}`,
    html,
    text: `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}

Message:
${contactData.message}

Submitted at: ${new Date().toLocaleString()}
    `,
  })
}


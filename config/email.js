import dotenv from 'dotenv'
import { Resend } from 'resend'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export const generalMails = async (email, message, subject = '🎉 Welcome to ZoeTech Bootcamp!'
) => {
const html = `
  <div style="
    width: 100%; 
    max-width: 600px; 
    margin: auto; 
    font-family: 'Arial', sans-serif; 
    border-radius: 12px; 
    overflow: hidden; 
    background: #f9f9f9;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  ">
    
    <!-- Logoo -->
    <div style="background: #ffffff; padding: 30px 0; text-align: center;">
      <img
        src="https://res.cloudinary.com/dgyvs3zth/image/upload/v1759695790/logoo_otaee1.png"
        alt="ZoeyTech Logo"
        width="120"
        height="120"
        style="border-radius: 50%; display: block; margin: auto;"
      />
    </div>

    <!-- Content injected dynamically -->
    <div style="padding: 30px; background: #ffffff; color: #333; font-size: 16px; line-height: 1.6;">
      ${message}
    </div>

    <!-- Footer -->
    <div style="background: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #555;">
      📞 Need Help? WhatsApp / Call: <b>+234 812 345 6789</b> | Email: <b>support@zoetechbootcamp.com</b>
    </div>
  </div>
  `


  try {
    const data = await resend.emails.send({
      from: 'Klaxon Ford Resources <support@klaxonfordresources.com>',
      to: email,
      subject,
      html
    })

    console.log('✅ Welcome email sent:', data)
  } catch (error) {
    console.error('❌ Email send failed:', error)
    throw error
  }
}

// Hi <b>${firstname} ${lastname}</b>,<br><br>
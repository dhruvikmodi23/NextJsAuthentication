import User from '@/models/userModel';
import nodemailer from 'nodemailer' 
import bcrypt from 'bcryptjs';
export const sendEmail = async({email,emailType,userId}:any)=>{
     
           
    
  
    try {
        const hashedToken = await bcrypt.hash(userId.toString(),10)

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,
                {verifyToken : hashedToken, verifyTokenExpiry : Date.now()+3600000}
                )
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken : hashedToken, forgotPasswordTokenExpiry : Date.now()+3600000}
                )
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });  

         const mailOptions={
            from: 'abc@gmail.com',
            to: email,
            subject: emailType==='VERIFY' ? "Verify your email":"Reset your password",
            // text: "Hello world?", // plain‑text body
            html: `<p>Click <a href="${process.env.DOMAIN}/
            verifyemail?token=${hashedToken}">here</a> to $
            {emailType === "VERIFY" ? "Verify your email" : "reset your password"}
             or copy and paste the link below in your browser.
             <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
             </p>`, 
          }

         const mailResponse = await transporter.sendMail(mailOptions)

         return mailResponse
    } catch (error:any) { 
        return new Error(error.message)
    }
}
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const nodeMailer = require("nodemailer");
const dotenv = require('dotenv');
const { validateEmail } = require('../utils/helper');
const utils = require('../utils/response');

dotenv.config({
    path:"backend/config/.env"
})

router.post('/report', async (req, res) => {
    const bodyData = req.body;
    const name = bodyData.name;
    const subject = bodyData.subject;
    const email = bodyData.email;
    const message = bodyData.message;

    const errorMsg = [];
    const required_fields = ["name", "subject", "email", "message"];

    for(let i=0;i<required_fields.length;i++) {
        if(!bodyData[required_fields[i]]) {
            errorMsg.push(`${required_fields[i]} is required`);
        } else {
            if(required_fields[i] == "email") {
                if(!validateEmail(bodyData[required_fields[i]])) {
                    errorMsg.push("Invalid Email Format!!");
                }
            }
        }
    }

    if(errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    }

    const exist = await User.find({email: email});

    if(exist.length === 0) {
        return utils.response(res, 'fail', "User doesn't exist with this email in db.", null, 400);
    } 
    
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
              user: process.env.SMTP_MAIL,
              pass: process.env.SMTP_PASSWORD,
            },
          });
        
        const mailOptions = {
        from: email,
        to: process.env.SMTP_MAIL,
        subject: subject,
        html: `Hello ${name},<br><br>Thanks to reach out to raise issue. We'll try to fix it as soon as possible.<br><br> We'll inform you through mail.`,
        };
    
        await transporter.sendMail(mailOptions);
        utils.response(res, 'success', "Email sent successfully.", null, 200);
    } catch (error) {
        utils.response(res, 'success', error.message, null, 400);
    }
})

module.exports = router;
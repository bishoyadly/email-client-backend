const fs = require('fs');
const nodemailer = require("nodemailer");
const path = require('path');
const rootPath = path.dirname(require.main.filename);
const emailAttachmentDirectoryPath = path.join(rootPath, 'resources', 'email-attachments');

module.exports = class EmailService {

    static deleteEmailHostedFiles(attachmentFileNamesList) {
        for (let i = 0; i < attachmentFileNamesList.length; i++) {
            fs.unlink(`${emailAttachmentDirectoryPath}/${attachmentFileNamesList[i]}`, deleteError => {
                if (deleteError) {
                    return console.log(error);
                }
            });
        }
    }

    static constructEmailOptions(emailData, attachmentFileNamesList) {
        const maiImages = attachmentFileNamesList.map(file => `<img src="cid:${file}">`);
        const html =
            `<html>
                <body>
                    <h2> Email Client Message </h2>
                     <p style="font-style: oblique;"> ${emailData.emailBody} </p>
                     ${maiImages} 
                </body>
            </html>`;

        const attachmentObjList = attachmentFileNamesList.map(file => {
            return {
                fileName: file,
                path: `${emailAttachmentDirectoryPath}/${file}`,
                cid: file
            };
        });

        const recipientsList = emailData.recipients.map(recipient => `<${recipient}>`).toString();
        const mailOptions = {
            from: `Node Mailer Client <${process.env.EMAIL_ADDRESS}>`,
            to: recipientsList,
            subject: emailData.subject,
            text: emailData.emailBody,
            html: html,
            attachments: attachmentObjList
        };
        return mailOptions;
    }


    static sendEmail(emailData) {

        fs.readdir(emailAttachmentDirectoryPath, (err, attachmentFileNamesList) => {

            if (err) {
                console.log('error reading attachment directory', err);
                return;
            }

            const emailOptions = EmailService.constructEmailOptions(emailData, attachmentFileNamesList);

            const transporter = nodemailer.createTransport({
                host: 'smtp.zoho.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            transporter.sendMail(emailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }

                EmailService.deleteEmailHostedFiles(attachmentFileNamesList);

                console.log('Message sent: ' + info.response);
            });

        });
    }
};
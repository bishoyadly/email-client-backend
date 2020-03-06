const fs = require('fs');
const nodemailer = require("nodemailer");
const path = require('path');
const rootPath = path.dirname(require.main.filename);
const emailAttachmentDirectoryPath = path.join(rootPath, 'resources', 'email-attachments');

module.exports = class EmailService {

    static deleteEmailHostedFiles(attachmentFileNamesList) {
        for (let i = 0; i < attachmentFileNamesList.length; i++) {
            if (attachmentFileNamesList[i] === '.empty') {
                continue;
            }
            fs.unlink(`${emailAttachmentDirectoryPath}/${attachmentFileNamesList[i]}`, deleteError => {
                if (deleteError) {
                    return console.log(deleteError);
                }
            });
        }
    }

    static constructEmailOptions(emailData, attachmentFileNamesList) {
        let maiImages = [];
        const attachmentObjList = [];
        for (let i = 0; i < attachmentFileNamesList.length; i++) {
            if (attachmentFileNamesList[i] !== '.empty') {
                maiImages.push(`<img src="cid:${attachmentFileNamesList[i]}">`);
                attachmentObjList.push({
                    fileName: attachmentFileNamesList[i],
                    path: `${emailAttachmentDirectoryPath}/${attachmentFileNamesList[i]}`,
                    cid: attachmentFileNamesList[i]
                });
            }
        }
        const html =
            `<html>
                <body>
                    <h2> Email Client Message </h2>
                     <p style="font-style: oblique;"> ${emailData.emailBody} </p>
                     ${maiImages} 
                </body>
            </html>`;

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
                    return console.log('Error sending mail : ', error);
                }

                EmailService.deleteEmailHostedFiles(attachmentFileNamesList);

                console.log('-------- Message sent ----------  ' + info.response);
            });

        });
    }
};
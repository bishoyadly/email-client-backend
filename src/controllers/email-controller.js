const fs = require('fs');
const path = require('path');
const rootPath = path.dirname(require.main.filename);
const emailAttachmentDirectoryPath = path.join(rootPath, 'resources', 'email-attachments');
const emailService = require('../services/email-service');

module.exports = class EmailController {

    static uploadFile(request, response) {
        const uploadFilePath = path.join(emailAttachmentDirectoryPath, request.file.originalname);
        fs.writeFile(uploadFilePath, request.file.buffer, () => {
            response
                .status(200)
                .send('');
        });
    }

    static deleteFile(request, response) {
        const uploadFilePath = path.join(emailAttachmentDirectoryPath, request.query.fileName);
        fs.unlink(uploadFilePath, () => {
            response
                .status(200)
                .send('');
        });
    }
    //
    // static getImage(request, response) {
    //     fs.readFile(path.join(emailAttachmentDirectoryPath, request.params.imageName), (error, file) => {
    //         if (error) {
    //             response
    //                 .status(404)
    //                 .send('');
    //         } else if (file) {
    //             response
    //                 .status(200)
    //                 .set('Content-Type', 'image')
    //                 .send(file);
    //         } else {
    //             response
    //                 .status(404)
    //                 .send('');
    //         }
    //     });
    // }
    //
    // static getEmailAttachment(request, response) {
    //     const html =
    //         `<html>
    //             <body>
    //                 <h1> Attachment Hosting </h1>
    //                 <img src="http://localhost:8080/api/v1/images/webpack.png">
    //                  <img src="http://localhost:8080/api/v1/images/christmas.gif">
    //             </body>
    //         </html>`;
    //     response
    //         .status(200)
    //         .set('Content-Type', 'text/html')
    //         .send(html)
    // }
    //
    static sendEmail(request, response) {
        const body = request.body;
        const emailData = {
            subject: body.subject,
            recipients: body.recipients,
            emailBody: body.emailBody
        };
        emailService.sendEmail(emailData);
        response
            .status(200)
            .send(emailData);
    }

};
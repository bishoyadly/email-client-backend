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
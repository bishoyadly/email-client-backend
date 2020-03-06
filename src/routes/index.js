const router = require('express').Router();
const emailController = require('../controllers/email-controller');

const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 10000000
    }
});

router
    .route('/send-mail')
    .post(emailController.sendEmail);

router
    .route('/attachment-file')
    .post(upload.single('file'), emailController.uploadFile)
    .delete(emailController.deleteFile);

// router
//     .route('/email-attachment')
//     .get(emailController.getEmailAttachment);
//
// router
//     .route('/images/:imageName')
//     .get(emailController.getImage);

module.exports = router;

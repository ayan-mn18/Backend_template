const express = require('express');

const { tokenVerification, upload } = require('../config');
const { verifyEmail, verifyEmailWithJwtToken, forgotPassword, resetPassword } = require('../controllers/services.controller');

const router = express.Router();

router.get('/verify', tokenVerification, verifyEmail);
router.post('/verifywithjwt', upload.single('url'), verifyEmailWithJwtToken)

router.get('/forgotpassword', tokenVerification, forgotPassword);
router.put('/resetpassword', resetPassword);

module.exports = router;
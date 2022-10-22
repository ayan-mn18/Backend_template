const express = require('express');
const { tokenVerification, upload } = require('../config');
const { verifyEmail, verifyEmailWithJwtToken } = require('../controllers/services.controller');

const router = express.Router();

router.get('/verify', tokenVerification, verifyEmail);
router.post('/verifywithjwt', upload.single('url'), verifyEmailWithJwtToken)

module.exports = router;
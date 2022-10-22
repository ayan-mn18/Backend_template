const colors = require('colors');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config');

const e = require("../config/errorList");
const { User } = require("../models");
const { emailService, imageUploaderSingle } = require("../services");

const verifyEmail = async (req,res) => {
    try {
        // const jwtToken = jwt.sign( req.user.email , process.env.JWT_ACCESS_TOKEN );
        const jwtToken = jwt.sign({ email: req.user.email }, process.env.JWT_ACCESS_TOKEN, { expiresIn : '604800' });
        const type_of_action = e.email.verifyEmail;
        const action_description = e.email.verifyEmailActionDescription;
        const url = process.env.DOMAIN + '/api/service/verifywithjwt?jwt=' + jwtToken ;
        const { username, email } = req.user;
        const response = await emailService(type_of_action, url, username, email, action_description);
        if(response.err != "NULL"){
            res.status(500).json({
                error: response.err
            });
        } else {
            response.acceptedMail.map((mail) => console.log(`Mail sent to ${`${mail}`.bold.green} for action "${type_of_action}"`));
            res.status(200).json({
                message: `Succesfully sent mail for '${type_of_action}' to ${response.acceptedMail[0]}`
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
};

const verifyEmailWithJwtToken = async (req,res) => {
    try {
        const jwtToken = req.query.jwt;
        jwt.verify(jwtToken, process.env.JWT_ACCESS_TOKEN , async (err, data) => {
            if(err){
                res.status(500).json({
                    error: err.message
                })
            }else{
                const date = new Date().getTime()/1000;
                if(data.exp < date){
                    res.status(500).json({
                        message: e.expiration.tokenExpired
                    })
                    return;
                }
                const user = await User.findOne({ email: data.email });
                const { verified, phone } = req.body;
                if(verified){
                    user.verified = true;
                }
                if(phone){
                    user.phone = phone;
                }
                if(req.file){
                    user.avatar = await imageUploaderSingle(req.file.path);
                }
                await user.save();
                res.status(200).json({
                    message: "User verified successfully and the details are being updated. Happy surfing !",
                    body: user
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const forgotPassword = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
};


module.exports = {
    verifyEmail,
    forgotPassword,
    verifyEmailWithJwtToken,
}
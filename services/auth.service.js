const httpStatus = require('http-status');
const { User, } = require('../models')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require('../config/config');
const { axiosMiddleware } = require('../middlewares/axios');
const { userApis, courseApis } = require('../utils/gapis');
const { default: axios } = require('axios');


const login = async (req) => {
    try {
        const data = req.body
        if (data.loginType === 'google') {
            //    await axiosMiddleware({ url: userApis.getDetails(data.googleId) }, req)
            const findUser = await User.findOne({ email: data.email });
            if (!findUser) {
                const newuser = await User.create(data)
                return ({ status: httpStatus.OK, user: newuser, message: "Login Successs" });
            }
            const updatedUser = await User.findByIdAndUpdate(findUser._id, data, { new: true })
            return ({ status: httpStatus.OK, user: updatedUser, message: "Login Successs" });
        }
        const user = await User.findOne({ email: body.email });
        if (!user) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Invalid email or password" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        return ({ status: httpStatus.OK, user: user, token: token, message: "Login Successs" });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }

}

const socialLogin = async (data) => {
    try {

        return ({ status: httpStatus.OK, user: user, message: "User registered successfully", });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to register user" });

    }

}

const details = async (req) => {
    try {
        const token = req.header("Authorization");
        const loginType = req.header("LoginType")
        if (loginType === 'google') {
            const user = await axios({
                url: 'https://www.googleapis.com/userinfo/v2/me',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return ({ status: httpStatus.OK, user: { ...user.data, imageUrl: user.data.picture }, message: "User details found successfully" });

        } else {
            const user = await User.findOne({ _id: req.userId });

            if (!user) {
                return ({ status: httpStatus.NOT_FOUND, message: "user does not exist" });
            }
            return ({ status: httpStatus.OK, user: user, message: "User details found successfully" });

        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to get details" });

    }


}

const forgotPassword = async (data) => {
    const user = await User.findOne({ email: data.email })
    if (!user) {
        return ({ status: httpStatus.NOT_FOUND, message: "user does not exist" });
    }
    const otp = generateOtp();
    const storeotp = await User.findByIdAndUpdate(user._id, { otp: otp })
    if (storeotp) {
        const transport = nodemailer.createTransport(config.email.smtp);
        const verifyEmail = await transport
            .verify()
        if (!verifyEmail) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to send forgot password request, please send your queries on the email address given above." });
        }
        let mailDetails = {
            from: config.email.from,
            to: user.email,
            subject: "OTP for forgot password",
            html: `<!DOCTYPE html>
            <html>
            
            <head>
                <title>OTP for forgot password</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
            
                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
            
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
            
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
            
                    table {
                        border-collapse: collapse !important;
                    }
            
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
            
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div
                    style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                    We're thrilled to have you here! Get ready to dive into your new account. </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#5d3ea8" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#5d3ea8" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top"
                                        style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <img src="https://eduparv.com/website/images/logo.png" width="125" height="120"
                                            style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 20px 30px 40px 30px; color: #454545; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 25px;">
                                        <p style="margin: 0;text-align: center;">Please use the verification code below on the
                                            Eduparv app : </p>
                                        <h1 style="font-size: 40px; font-weight: 600; margin: 2;text-align: center;">${otp}</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">If you didn't request this, you can ingnore this email or let us know.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">Thanks,<br>Eduparv Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            
            </html>`,
        };

        try {
            const mailsend = await transport.sendMail(mailDetails);
            if (mailsend) {

                return ({ status: httpStatus.OK, message: "OTP send to your registered email address" });
            }
        } catch (error) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
        }


    }
}

module.exports = {
    login, details, socialLogin, forgotPassword
}

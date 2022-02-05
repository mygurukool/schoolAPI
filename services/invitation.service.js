const httpStatus = require('http-status');
const config = require('../config/config');
const Invitation = require('../models/invitation.model');
const sgMail = require('@sendgrid/mail');
const { User, Group } = require('../models');
const bcrypt = require("bcryptjs");

const getInvitation = async (id) => {
    try {
        const invitation = await Invitation.findById(id)
        return ({ status: httpStatus.OK, data: { ...invitation._doc, peoples: [] } });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to get invitations" });
    }
}

const sendInvitation = async (data) => {
    try {
        // if (!config.email.sendgrid_api_key) {
        //     return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "No Api key found" });
        // }
        const createInvitation = await Invitation.create(data)
        const filteredPeoples = await Promise.all(data.peoples.filter(async f => {
            const foundUser = await User.findOne({ email: f })
            if (!foundUser) {
                return true
            }
            return false
        }))
        sgMail.setApiKey(config.email.sendgrid_api_key);
        const invitationLink = `https://mougli.school/invitation/${data.type}/${createInvitation._id}`;
        let mailDetails = {
            from: config.email.from,
            to: filteredPeoples,
            subject: "Mygurukool Invitation",
            html: `<!DOCTYPE html>
            <html>

            <head>
                <title>Mygurukool Invitation</title>
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
                    <!-- <tr>
                        <td bgcolor="#5d3ea8" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr> -->
                    <!-- <tr>
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
                    </tr> -->
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 40px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 40px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">
                                            Hello,
                                            <br />
                                            ${data.inviteeName} (${data.inviteeEmail}) invited you to the class ${data.groupName}.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="center"
                                        style="padding: 20px 30px 40px 30px; color: #454545; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 25px;">
                                        <a href="${invitationLink}"
                                            style="font-size: 20px; font-weight: 600;background-color: #5d3ea8; color: #fff;padding: 10px; cursor: pointer; border: none; margin: 2;text-align: center;">Accept
                                            Invitation</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">Forward to only those you trust. Anyone with this email may be able to
                                            accept the invitation.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">If you accept, your contact information will be shared with the class
                                            members and applications they authorize to use Classroom.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 0px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">Thanks,<br>Mygurukool</p>
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
            await sgMail.sendMultiple(mailDetails)
        } catch (error) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.response.body.errors[0].message });

        }

        return ({ status: httpStatus.OK, data: invitationLink, message: "Invitation sent successfully" });

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to sent invitations" });

    }

}


const acceptInvitation = async (data) => {
    try {
        const invitation = await Invitation.findById(data.id || data._id)
        const emailExist = await invitation.peoples.includes(data.email)
        if (!emailExist) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "No invitation found for this email" });
        }
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(data.password, salt);
        const checkUser = await User.findOne({ email: data.email })

        if (!checkUser) {
            const createdUser = await User.create({ organizationId: invitation.organizationId, groupId: invitation.groupId, name: data.name, email: data.email, loginType: 'mygurukool', password: hashPassword, role: data.role, permissions: data.permissions })
            if (data.role === 'TEACHER') {
                await Group.findByIdAndUpdate(invitation.groupId, { $push: { teachers: createdUser, users: createdUser.id || createdUser._id, } })
            } else {
                await Group.findByIdAndUpdate(invitation.groupId, { $push: { students: createdUser, users: createdUser.id || createdUser._id, } })
            }
        }
        return ({ status: httpStatus.OK, message: 'Invitation accepted' });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to get invitations" });
    }
}


module.exports = {
    getInvitation, sendInvitation, acceptInvitation
}

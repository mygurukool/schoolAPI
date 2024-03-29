const httpStatus = require('http-status');
const sgMail = require('@sendgrid/mail');
const config = require('../../config/config');
const { Contact } = require('../../models/website');


const submitDetails = async () => {
    try {
        if (!data.subject) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Subject is required" });
        }
        await Contact.create(data)
        // let data = { name: 'sadasd' }
        // sgMail.setApiKey(config.email.sendgrid_api_key);
        // let thead = ""
        // Object.entries(data).forEach(([key, value]) => {
        //     let tr = "<tr>";

        //     tr += "<th>" + key + "</th>" + "<td>" + value.toString() + "</td></tr>";
        //     thead += tr;
        // });

        // console.log('thead', thead);
        // let mailDetails = {
        //     from: config.email.from,
        //     to: [],
        //     subject: "Mygurukool Invitation",
        //     html: `<!DOCTYPE html>
        //     <html>

        //     <head>
        //         <title>Mygurukool Invitation</title>
        //         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        //         <meta name="viewport" content="width=device-width, initial-scale=1">
        //         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        //         <style type="text/css">
        //             @media screen {
        //                 @font-face {
        //                     font-family: 'Lato';
        //                     font-style: normal;
        //                     font-weight: 400;
        //                     src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
        //                 }

        //                 @font-face {
        //                     font-family: 'Lato';
        //                     font-style: normal;
        //                     font-weight: 700;
        //                     src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
        //                 }

        //                 @font-face {
        //                     font-family: 'Lato';
        //                     font-style: italic;
        //                     font-weight: 400;
        //                     src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
        //                 }

        //                 @font-face {
        //                     font-family: 'Lato';
        //                     font-style: italic;
        //                     font-weight: 700;
        //                     src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
        //                 }
        //             }

        //             /* CLIENT-SPECIFIC STYLES */
        //             body,
        //             table,
        //             td,
        //             a {
        //                 -webkit-text-size-adjust: 100%;
        //                 -ms-text-size-adjust: 100%;
        //             }

        //             table,
        //             td {
        //                 mso-table-lspace: 0pt;
        //                 mso-table-rspace: 0pt;
        //             }

        //             img {
        //                 -ms-interpolation-mode: bicubic;
        //             }

        //             /* RESET STYLES */
        //             img {
        //                 border: 0;
        //                 height: auto;
        //                 line-height: 100%;
        //                 outline: none;
        //                 text-decoration: none;
        //             }

        //             table {
        //                 border-collapse: collapse !important;
        //             }

        //             body {
        //                 height: 100% !important;
        //                 margin: 0 !important;
        //                 padding: 0 !important;
        //                 width: 100% !important;
        //             }

        //             /* iOS BLUE LINKS */
        //             a[x-apple-data-detectors] {
        //                 color: inherit !important;
        //                 text-decoration: none !important;
        //                 font-size: inherit !important;
        //                 font-family: inherit !important;
        //                 font-weight: inherit !important;
        //                 line-height: inherit !important;
        //             }

        //             /* MOBILE STYLES */
        //             @media screen and (max-width:600px) {
        //                 h1 {
        //                     font-size: 32px !important;
        //                     line-height: 32px !important;
        //                 }
        //             }

        //             /* ANDROID CENTER FIX */
        //             div[style*="margin: 16px 0;"] {
        //                 margin: 0 !important;
        //             }
        //         </style>
        //     </head>

        //     <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
        //         <!-- HIDDEN PREHEADER TEXT -->
        //         <div
        //             style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        //             We're thrilled to have you here! Get ready to dive into your new account. </div>
        //         <table border="0" cellpadding="0" cellspacing="0" width="100%">
        //             <!-- LOGO -->

        //             <tr>
        //                 <td bgcolor="#f4f4f4" align="center" style="padding: 40px 10px 0px 10px;">
        //                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        //                         <tr>
        //                             <td bgcolor="#ffffff" align="center"
        //                                 style="padding: 40px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
        //                                 <h1 style="margin: 0;text-transform: uppercase;">
        //                                     Thank you for contact us
        //                                     <br />

        //                                 </h1>
        //                             </td>
        //                         </tr>
        //                         <tr>
        //                             <td bgcolor="#ffffff" align="left"
        //                                 style="padding: 40px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
        //                                 <p style="margin: 0;">
        //                                     Hello, ${data.name}
        //                                     <br />

        //                                 </p>
        //                             </td>
        //                         </tr>
        //                         <tr>
        //                             <td bgcolor="#ffffff" align="left"
        //                                 style="padding: 20px 30px 40px 30px; color: #454545; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 25px;">
        //                                 <table style="border-collapse: collapse;
        //                                 width: 100%;">
        //                                     ${thead}
        //                                 </table>
        //                             </td>
        //                         </tr>

        //                         <tr>
        //                             <td bgcolor="#ffffff" align="left"
        //                                 style="padding: 0px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
        //                                 <p style="margin: 0;">Thanks,<br>Mougli School</p>
        //                             </td>
        //                         </tr>
        //                     </table>
        //                 </td>
        //             </tr>
        //         </table>
        //     </body>

        //     </html>`,
        // };
        // console.log(mailDetails)
        // try {
        //     await sgMail.sendMultiple(mailDetails)
        // } catch (error) {
        //     // return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.response.body.errors[0].message });
        // }

        return ({ status: httpStatus.OK, message: 'Details submitted successfully' });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to submit details" });

    }

}


module.exports = {
    submitDetails
}

const httpStatus = require('http-status');
const config = require('../../config/config');
const { Sponsor, Transaction } = require('../../models/website');
const { User } = require('../../models');
const stripe = require('stripe')(config.stripe.secret_key);
const sgMail = require('@sendgrid/mail');

const stripePaymentSession = async (data, url) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: data.productType,
                    },
                    unit_amount: data.price * 100,
                },
                quantity: 1,
            },
        ],
        // customer_email: data.email,
        mode: 'payment',
        success_url: `${url}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}?canceled=true`,
    });
    return session
}


const createSession = async (data) => {
    try {
        const users = await User.findOne({ email: data.email });
        if (users) {
            return {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "User already exist",
            };
        }
        const url = data.requestedUrl.indexOf('?') > -1 ? data.requestedUrl.substr(0, data.requestedUrl.indexOf('?')) : data.requestedUrl;
        const session = await stripePaymentSession(data, url)
        return ({ status: httpStatus.OK, session: session });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to submit details" });

    }

}

const getSession = async (data) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(
            data.sessionId
        );
        console.log('session', session);
        return ({ status: httpStatus.OK, data: session });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to submit details" });

    }

}

const createSponsorSession = async (data) => {
    try {
        const url = data.requestedUrl.indexOf('?') > -1 ? data.requestedUrl.substr(0, data.requestedUrl.indexOf('?')) : data.requestedUrl;
        const session = await stripePaymentSession(data, url)
        return ({ status: httpStatus.OK, session: session });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to submit details" });

    }

}

const createSponsor = async (data) => {
    try {
        const sponsor = await Sponsor.create({ ...data, sponsorAmount: data.price });
        await Transaction.create({
            sessionId: data.transaction ? data.transaction.id : undefined,
            transactionDetails: data.transaction,
            paymentId: data.transaction ? data.transaction.payment_intent : undefined,
            productType: data.productType,
            priceType: data.price,
            sponsorId: sponsor._id || sponsor.id,
        })

        sgMail.setApiKey(config.email.sendgrid_api_key);

        let mailDetails = {
            from: config.email.from,
            to: [data.sponsorEmail],
            subject: "Thanks for become a sponsor",
            html: `<!DOCTYPE html>
            <html>

            <head>
                <title>Thanks for become a sponsor</title>
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
                        <td bgcolor="#ffffff" align="center"
                            style="padding: 40px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                            <h1 style="margin: 0;text-transform: uppercase;">
                                Thank you for Becoming a sponsor
                                <br />

                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">
                                Hello, ${data.sponsorName}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">
                                Your payment was successfully completed
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 0px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Thanks,<br>Mougli School</p>
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
            // return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.response.body.errors[0].message });
        }


        return {
            status: httpStatus.OK,
            message: "Becoming a sponsor successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to become sponsor",
        };
    }

};

module.exports = {
    createSession,
    getSession,
    createSponsorSession,
    createSponsor
}

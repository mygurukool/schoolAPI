const httpStatus = require('http-status');
const config = require('../../config/config');
const { User } = require('../../models');
const stripe = require('stripe')(config.stripe.secret_key);

const createSession = async (data) => {
    try {
        const users = await User.findOne({ email: data.email });
        if (users) {
            return {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "User already exist",
            };
        }
        const YOUR_DOMAIN = data.requestedUrl.indexOf('?') > -1 ? data.requestedUrl.substr(0, data.requestedUrl.indexOf('?')) : data.requestedUrl;
        console.log('YOUR_DOMAIN', YOUR_DOMAIN, data.requestedUrl);
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
            success_url: `${YOUR_DOMAIN}?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });
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

module.exports = {
    createSession,
    getSession
}

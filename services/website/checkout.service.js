const httpStatus = require('http-status');
const config = require('../../config/config');
const { Sponsor, Transaction } = require('../../models/website');
const stripe = require('stripe')(config.stripe.secret_key);

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
        console.log('data', data);
        const sponsor = await Sponsor.create({ ...data, sponsorAmount: data.price });
        await Transaction.create({
            sessionId: data.transaction ? data.transaction.id : undefined,
            transactionDetails: data.transaction,
            paymentId: data.transaction ? data.transaction.payment_intent : undefined,
            productType: data.productType,
            priceType: data.price,
            sponsorId: sponsor._id || sponsor.id,
        })
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

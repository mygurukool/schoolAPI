const httpStatus = require('http-status');
const { Pricing } = require('../../models/website');


const all = async () => {
    try {
        const pricing = await Pricing.find()
        return ({ status: httpStatus.OK, data: pricing });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to submit details" });

    }

}


module.exports = {
    all
}

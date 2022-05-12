const httpStatus = require('http-status');
const { Pricing } = require('../../models/website');


const all = async (data) => {
    try {
        const pricing = await Pricing.findOne({ language: data.language })
        return ({ status: httpStatus.OK, data: pricing ? pricing.pricing : [] });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to submit details" });

    }
}

const edit = async (data) => {
    try {
        const pricing = await Pricing.find({ language: data.language })
        if (pricing.length <= 0) {
            await Pricing.create(data)
        }
        else {
            await Pricing.findOneAndUpdate({ language: data.language }, data)
        }
        return ({ status: httpStatus.OK, data: pricing });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to submit details" });

    }
}


module.exports = {
    all,
    edit
}

const Joi = require('joi');

const create = (data) => {
    const schema = Joi.object({
        festivalName: Joi.string().required().label('Festival Name'),
        festivalImages: Joi.array().required().label('Festival Images'),
    }).unknown();
    return schema.validate(data);
}

module.exports = {
    create,
};

const Joi = require("@hapi/joi");

const tagSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
});

module.exports = {
    tag: tagSchema,
}
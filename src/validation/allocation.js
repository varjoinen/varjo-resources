const Joi = require("@hapi/joi")
    .extend(require("@hapi/joi-date"));
const { tag } = require("./common");


const allocationSchema = Joi.object().keys({
    allocation: Joi.number().required(),
    description: Joi.string(),
    userId: Joi.string(),
    projectId: Joi.string(),
    start: Joi.date().format('YYYY-MM-DD'),
    end: Joi.date().format('YYYY-MM-DD'),
    tags: Joi.array().items(tag),
});

module.exports = {
    allocation: allocationSchema,
}
const Joi = require("@hapi/joi")
    .extend(require("@hapi/joi-date"));
const { tag } = require("./common");

const projectSchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    start: Joi.date().format('YYYY-MM-DD'),
    end: Joi.date().format('YYYY-MM-DD'),
    tags: Joi.array().items(tag),
});

module.exports = {
    project: projectSchema,
}
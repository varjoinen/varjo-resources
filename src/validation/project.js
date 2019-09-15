const Joi = require("@hapi/joi")
    .extend(require("@hapi/joi-date"));

// TODO refactor to a common schema for all resources
const tagSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
});

const projectBaseSchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    start: Joi.date().format('YYYY-MM-DD'),
    end: Joi.date().format('YYYY-MM-DD'),
    tags: Joi.array().items(tagSchema),
});

const existingProjectSchema = projectBaseSchema.keys({
    id: Joi.string().required(),
});

module.exports = {
    tag: tagSchema,
    newProject: projectBaseSchema,
    existingProject: existingProjectSchema,
}
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = Joi => ({
    type: 'string',
    base: Joi.string(),
    messages: {
        'string.sanitizeHTML': '{{ #label }} must not include HTML tags',
    },
    rules: {
        sanitizeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    // allowedTags: [],
                    // allowedAttributes: [],
                });
                if (clean !== value) return helpers.error('string.sanitizeHTML', { value });
                return clean;
            },
        },
    },
});

module.exports = Joi.extend(extension);

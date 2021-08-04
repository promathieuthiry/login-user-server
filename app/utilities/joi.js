const Joi = require('joi')

//User-defined function to validate the user
function validateUser(user) {
    const JoiSchema = Joi.object({
        email: Joi.string()
            .email()
            .min(5)
            .max(50)
            .required(),
        password: Joi.string().min(6).alphanum().required(),
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .options({ messages: { 'any.only': '{{#label}} does not match' } })
    })

    return JoiSchema.validate(user)
}

function updateUser(user) {
    const JoiSchema = Joi.object({
        email: Joi.string()
            .email()
            .min(5)
            .max(50)
            .required()
    })

    return JoiSchema.validate(user)
}


module.exports = { validateUser, updateUser }

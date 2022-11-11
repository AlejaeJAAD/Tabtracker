const Joi = require('joi')

module.exports = {
    register(req, res, next) {
        const schema = Joi.object({
            fileURL: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            nickName: Joi.string()
                .alphanum()
                .min(3)
                .max(20)
                .required(),
            phone: Joi.number().max(10),
            city: Joi.string(),
            state: Joi.string(),
            country: Joi.string(),
            birthDate: Joi.date(),
            email: Joi.string().email({
                minDomainSegments: 2, tlds: { allow: ['com']}
            }),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{8,32}$')
            ),
            role: Joi.string(),
            created_date: Joi.date()
          })
          
        const {error} = schema.validate(req.body)

        if(error) {
            switch (error.details[0].context.key) {
                case 'email':
                    res.status(400).send({
                        error: 'You must provide a valid email address'
                    })
                    break
                case 'password':
                    res.status(400).send({
                        error: `The password provided failed to match the following rules:
                        <br>
                        1. It must contain ONLY the following characters: lower case upper case, numerics.
                        <br>
                        2. It must be at least 8 characters in length and not greater than 32 characters length.
                        `
                    })
                    break
                default:
                    res.status(400).send({
                        error: 'Invalid registration information'
                    })
            }
        } else {
            next()
        }
    }
}
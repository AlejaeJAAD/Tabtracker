const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config')

// constraseña
const bcrypt = require('bcrypt');

// validation
const Joi = require('@hapi/joi');

const schemaRegister = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

function jwtSignUser (user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    async register(req, res) {
        // Validate user
        const { error } = schemaRegister.validate(req.body)
        
        if (error) {
            return res.status(400).json({error: error.details[0].message})
        }

        const isEmailExist = await User.findOne({ email: req.body.email });
        if (isEmailExist) {
            return res.status(400).json({error: 'Email ya registrado'})
        }

        // Contraseña hash
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = new User({
          email: req.body.email,
          password: password,
        });
        try {
          const savedUser = await user.save();
          res.json({
              error: null,
              data: savedUser
          })
        } catch (error) {
            res.status(400).json({error})
        }
    },
    async login (req, res) {
        try {
          // Validaciones
          const { error } = schemaLogin.validate(req.body);
          if (error) return res.status(400).json({ error: error.details[0].message })


          const user = await User.findOne({ email: req.body.email });

          if (!user) {
            return res.status(403).send({
              error: `
                The login information was incorrect! <br>
                We couldn't find the email in our data.
              `
            })
          }
    
          const validPassword = await bcrypt.compare(req.body.password, user.password);
          if (!validPassword) return res.status(403).send({
                  error: `
                      The login information was incorrect! <br>
                      Password must be wrong.
                  `
                  })
    
          const userJson = user.toJSON()
          const token = jwtSignUser(userJson)
          res.header('auth-token', token).json({
            error: null,
            data: {
              user: 
              {
                email: userJson.email,
              },
              token
            }
          })
          
        } catch (err) {
          res.status(500).send({
            error: 'An error has occured trying to log in'
          })
        }
      }
}
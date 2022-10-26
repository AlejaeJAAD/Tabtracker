const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const config = require('../config/config')

// constraseña
const bcrypt = require('bcrypt');

// validation
const Joi = require('@hapi/joi');

const schemaRegister = Joi.object({
  fullName: Joi.string().min(4).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  role: Joi.string().min(5).max(255).required()
})

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

function jwtSignUser (user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, 
      //config.authentication.jwtSecret
      process.env.TOKEN_SECRET, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    async register(req, res) {
      console.log(req.body)
        // Validate user
        const { error } = schemaRegister.validate(req.body)
        
        if (error) {
            return res.status(400).json({errorsin: error.details[0].message})
        }

        const isEmailExist = await User.findOne({ email: req.body.email });
        if (isEmailExist) {
            return res.status(400).json({error: 'Email ya registrado'})
        }

        // Contraseña hash
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = new User({
          fullName: req.body.fullName,
          email: req.body.email,
          role: req.body.role,
          password: password,
        });
        
        user.save((err, user) => {
          if (err) {
            res.status(500)
              .send({
                message: err
              })
            return;
          } else {
            res.status(200)
              .send({
                message: 'User registered successfully'
              })
          }
        })
    },
    async login (req, res) {
        try {
          // Validaciones
          const { error } = schemaLogin.validate(req.body);
          if (error) return res.status(400).json({ error: error.details[0].message })

          const user = await User.findOne({ email: req.body.email })
              
          if (!user) {
            return res.status(404).send({
              error: `
                ¡USER NOT FOUND! <br>
                The login information was incorrect! <br>
                We couldn't find the email in our data.
                  `
            })
          }
            
          const validPassword = await bcrypt.compare(req.body.password, user.password);
          if (!validPassword) return res.status(401).send({
                  accessToken: null,
                  error: `
                      The login information was incorrect! <br>
                      Password must be wrong.
                  `
          })

          //Setting object password to undefined so we don't return crypted password to frontend
          user.password = undefined;

          const userJson = user.toJSON()
          const token = jwtSignUser(userJson)

          // res.header('auth-token', token).json({
          //   error: null,
          //   data: {
          //     userJson,
          //     token
          //   }
          // })

          res.status(200)
            .send({
              user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
              },
              message: 'Login successfull',
              accessToken: token
            })
          
        } catch (err) {
          res.status(500).send({
            error: 'An error has occured trying to log in'
          })
        }
      }
}
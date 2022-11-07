const User = require('../models/User');
const generateToken = require('../utils/generateToken')
const generateRefreshToken = require('../utils/generateRefreshToken')

const bcrypt = require('bcrypt');

// validation
const Joi = require('@hapi/joi');

const schemaRegister = Joi.object({
  fileURL: Joi.string().min(4).max(255).required(),
  fullName: Joi.string().min(4).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  role: Joi.string().min(5).max(255).required()
})

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

module.exports = {
    async register(req, res) {
      try {
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

          //New user
          const user = new User({
            fileURL: req.body.fileURL,
            fullName: req.body.fullName,
            email: req.body.email,
            role: req.body.role,
            password: password,
          });
          //Saving to MongoDB
          await user.save()

          const { token, expiresIn } = generateToken(user._id);
          generateRefreshToken(user._id, res);

          return res.status(201).json({ token, expiresIn })
      } catch (err) {
          console.log(err)
          if (error.code == 11000) {
            return res.status(400).json({
              error: 'User already exists!'
            })
          }
          return res.status(500).json({
            error: 'ERROR WITH SERVER!'
          })
      }
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

          const { token, expiresIn } = generateToken(user._id)
          generateRefreshToken(user._id, res);
        
          return res.json({
            token,
            expiresIn,
            message: 'Login successfull'
          })
        } catch (err) {
          res.status(500).send({
            error: 'An error has occured trying to log in'
          })
        }
    },
    async refreshToken(req, res) {
      try {
        const { token, expiresIn } = generateToken(req.uid)
        return res.json({
          token, expiresIn
        })
      } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Some error with the server" });
      }
    },
    async infoUser(req, res) {
      try {
          const user = await User.findById(req.uid)
          user.password = undefined;
          
          return res.json({ user });
          // if (user.role == 'admin') {
          //   return res.json({message: 'You must be admin'})
          // } else {
          //   return res.json({message: `You're not ad admin lol`})
          // }

      } catch (error) {
          console.log(error);
          return res.status(403).json({ error: error.message });
      }
    },
    async logout(req, res) {
      await res.clearCookie("refreshToken")
      return res.json({ ok: true });
    }
}
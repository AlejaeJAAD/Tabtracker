const User = require('../models/User');
const generateToken = require('../utils/generateToken')
const generateRefreshToken = require('../utils/generateRefreshToken')
const generateRecoverPasswordToken = require('../utils/generateRecoverPasswordToken')

const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const nodemailer = require("nodemailer")

// const transporter = require('../config/mailer')

const schemaRegister = Joi.object({
  fileURL: Joi.string().min(4).max(255).required(),
  firstName: Joi.string().min(4).max(100).required(),
  lastName: Joi.string().min(4).max(100).required(),
  nickName: Joi.string().min(3).max(20).required(),
  phone: Joi.number().required(),
  city: Joi.string().min(3).max(25).required(),
  state: Joi.string().min(3).max(25).required(),
  country: Joi.string().min(3).max(25).required(),
  postalCode: Joi.string().required(),
  birthDate: Joi.date().required(),
  email: Joi.string().min(6).max(100).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  role: Joi.string().min(5).max(20).required(),
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
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickName: req.body.nickName,
            phone: req.body.phone,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            postalCode: req.body.postalCode,
            birthDate: req.body.birthDate,
            email: req.body.email,
            password: password,
            role: req.body.role,
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
          return res.status(500).json({ error: "Some error with the server" });
      }
    },
    async infoUser(req, res) {
      try {
          const user = await User.findById(req.uid)
          user.password = undefined
          
          return res.json({ user })
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
    async getUserData(req, res) {
      try {
        const user = await User.findById(req.body.uid)
          
        return res.json({ user })
      } catch (err) {
        console.log(err)
      }
    },
    async logout(req, res) {
      await res.clearCookie("refreshToken")
      return res.json({ ok: true });
    },
    async forgotPassword(req, res) {
      const nickName = req.body.nickName
      
      if (!nickName) {
        return res.status(400).json({
          message: 'Nickname is required'
        })
      }

      const user = await User.findOne({
        nickName: nickName
      })
      
      const { token } = generateRecoverPasswordToken(user._id, nickName)
      const message = 'Check your email for a link to reset your password'
      let verificationLink = `http://localhost:3001/new-password/${token}`
      let emailStatus = 'OK'

      try {
        if(!user) {
          return res.json({
            message: `We couldn't found an user registered with that nickname`
          })
        } else {
          // const info = await transporter.sendMail({
          //   from: '"Forgot Password 👻" <alejandroanayadommega@gmail.com>', // sender address
          //   to: user.email,
          //   subject: "Forgot password",
          //   html: `
          //     <b>Please click on the following link, or paste this into your browser to complete the process.</b>
          //     <a href="${verificationLink}">${verificationLink}</a>
          //   `
          // })
          const client = nodemailer.createTransport({
            name: 'example.com',
            service: "Gmail",
            auth: {
              user: process.env.GOOGLE_JAAD_APP_EMAIL,
              pass: process.env.GOOGLE_JAAD_APP_PASS,
            },
            tls:{rejectUnauthorized:false}
          })
        
          const info = await client.sendMail(
            {
              from: 'JAAD',
              to: user.email,
              subject: "Forgot password",
              html: `
              <html>
                <b>Please click on the following link, or paste this into your browser to complete the process.</b>
                <a href="${verificationLink}">${verificationLink}</a>
              </html>
              `
            }
          )
          console.log("Message sent: %s", info.accepted);
        }
      } catch (error) {
        return res.status(400).json({
          message: 'Something went wrong',
          error
        })
      }

      // try {
      //   await User.save(user)
      // } catch (error) {
      //     emailStatus = error
      //     return res.status(400).json({
      //       message: 'Something went wrong'
      //     })
      // }
      res.json({
        message,
        info: emailStatus,
        test: verificationLink
      })
    },
    async createNewPassword(req, res) {
      const newPassword = req.body.newPassword
      const user = await User.findOne({ email: req.body.email })

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(401).send({
              error: `
                  Old password doesn't match <br/>
                  We couldn't create a new password since the old one is wrong <br/>
                  Please check you're previous password and try again!
              `
      })

      if (!newPassword) {
        res.status(404).json({
          message: 'New password is required'
        })
      }

      try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(newPassword, salt);
        user.password = password

        await user.save()

        // const { token, expiresIn } = generateToken(user._id);
        // generateRefreshToken(user._id, res);

        return res.status(201).json({ 
          // token,
          // expiresIn,
          message: 'Password has changed successfully!' 
        })
      } catch (error) {
        return res.status(401).json({
          message: 'Something went wrong'
        })
      }
    }
}
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

const errorTokens = require("../utils/errorsToken.js")

function generateToken (uid) {
  const expiresIn = 1000 * 60 * 15;
  const token = jwt.sign({ uid }, process.env.TOKEN_SECRET, { expiresIn });
  return { token, expiresIn };
};

function generateRefreshToken (uid, res) {
  const expiresIn = 1000 * 60 * 60 * 24 * 30;
  const refreshToken = jwt.sign({ uid }, process.env.TOKEN_SECRET_REFRESH, {
      expiresIn,
  });

  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: !(process.env.MODO === "developer"),
    expires: new Date(Date.now() + expiresIn),
  });
};

function jwtSignUser (user) {
    // const ONE_WEEK = 60 * 60 * 24 * 7
    const ONE_HOUR = 60 * 60
    return jwt.sign(user,
      process.env.TOKEN_SECRET, {
        expiresIn: ONE_HOUR
    })
}

function jwtSignUserRefresh (user) {
    const ONE_HOUR = 60 * 60
      return jwt.sign(user,
        process.env.TOKEN_SECRET_REFRESH, {
          expiresIn: ONE_HOUR
      })
}

module.exports = {
    async register(req, res) {
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
        
        // user.save((err, user) => {
        //   if (err) {
        //     res.status(500)
        //       .send({
        //         message: err
        //       })
        //     return;
        //   } else {
        //     res.status(200)
        //       .send({
        //         message: 'User registered successfully'
        //       })
        //   }
        // })
        await user.save()

        const { token, expiresIn } = generateToken(user._id);
        generateRefreshToken(user._id, res);

        return res.json({ token, expiresIn });
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

          // const userJson = user.toJSON()
          // const token = jwtSignUser(userJson)
          // const refreshToken = jwtSignUserRefresh(userJson)

          // user.refreshToken = refreshToken
          const { token, expiresIn } = generateToken(user._id);
          generateRefreshToken(user._id, res);

          //return res.json({ token, expiresIn });

          return res.status(200)
            .send({
              user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
              },
              message: 'Login successfull',
              token: token,
              expiresIn: expiresIn,
            })
          
        } catch (err) {
          res.status(500).send({
            error: 'An error has occured trying to log in'
          })
        }
    },
    // async refreshToken(req, res) {
    //   const refreshToken = req.headers.refresh

    //   if (!refreshToken) {
    //     return res.status(400).send({ message: "Something goes wrong!" });
    //   }

      
    //   const { _id } = await jwt.verify(refreshToken, process.env.TOKEN_SECRET_REFRESH);
    //   const user = await User.findById({_id})

    //   const token = jwtSignUserRefresh(user.toJSON())
    //   res.json({message: 'Ok', token})
    // },
    async refreshToken(req, res) {
      try {
        let refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error("No existe el refreshToken");

        const { uid } = jwt.verify(refreshTokenCookie, process.env.TOKEN_SECRET_REFRESH);

        const { token, expiresIn } = generateToken(uid);

        return res.json({ token, expiresIn });
      } catch (error) {
          console.log(error);
          const data = errorTokens(error);
          return res.status(401).json({ error: data });
      }
    },
    async infoUser(req, res) {
      try {
          const user = await User.findById(req.uid).lean()
          delete user.password;
          
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
      console.log('hola')
      await res.clearCookie("refreshToken")
      return res.json({ ok: true });
    }
}
const jwt = require("jsonwebtoken");
const config = require("./config/config.js");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
  let token = req.header("auth-token");
  console.log(req.header, req.headers)

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};


// const jwt = require('jsonwebtoken')
// const User = require('./models/User')

// // middleware to validate token (rutas protegidas)
// const refreshToken = (async (req, res, next) => {
//     const token = req.header('auth-token')
//     if (token) {
//      const accessToken = token
//      const { _id, exp } = await jwt.verify(accessToken, process.env.TOKEN_SECRET);

//      // Check if token has expired
//      if (exp < Date.now().valueOf() / 1000) { 
//       return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
//      } 

//     //  const user = await User.findById(_id)
//     //  res.status(200)
//     //         .send({
//     //           user: {
//     //             id: user._id,
//     //             email: user.email,
//     //             fullName: user.fullName
//     //           },
//     //           message: 'Refresh token',
//     //           refreshToken: token
//     //         })
//     } else { 
//      next(); 
//     } 
// });

module.exports = verifyToken;
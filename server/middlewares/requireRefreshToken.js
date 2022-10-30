const jwt = require("jsonwebtoken")
const tokenVerificationErrors = require('../utils/tokenVerificationErrors.js')

const requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error("No existe el token");

        const { uid } = jwt.verify(refreshTokenCookie, process.env.TOKEN_SECRET_REFRESH);
        req.uid = uid
        next()
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ error: tokenVerificationErrors[error.message] })
    }
}

module.exports = requireRefreshToken
const jwt = require("jsonwebtoken")
const { tokenVerificationErrors } = require('../utils/tokenVerificationErrors.js')

const restorePasswordToken = (req, res, next) => {
    const token = req.header('forgot-password-token')
    if (!token) return res.status(401).json({ error: 'Token not valid' })
    try {
        const { uid} = jwt.verify(token, process.env.TOKEN_RECOVER_PASSWORD)
        req.uid = uid
        next()
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .send({ error: tokenVerificationErrors[error.message] })
    }
}

module.exports = restorePasswordToken
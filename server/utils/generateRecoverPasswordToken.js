const jwt = require("jsonwebtoken")

const generateRecoverPasswordToken = (uid, nickName) => {
    const expiresIn = '10m'
    try {
        const token = jwt.sign(
            { uid, nickName },
            process.env.TOKEN_RECOVER_PASSWORD, 
            { expiresIn }
        )
        return { token, expiresIn };
    } catch (err) {
        console.log(err)
    }
}

module.exports = generateRecoverPasswordToken;
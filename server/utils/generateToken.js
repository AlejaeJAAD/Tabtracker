const jwt = require("jsonwebtoken")

const generateToken = (uid) => {
    const expiresIn = 60 * 15
    try {
        const token = jwt.sign(
            { uid }, 
            process.env.TOKEN_SECRET, 
            { expiresIn }
        )
        return { token, expiresIn };
    } catch (err) {
        console.log(err)
    }
}

module.exports = generateToken;
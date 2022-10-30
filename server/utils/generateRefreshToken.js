const jwt = require("jsonwebtoken")

const generateRefreshToken = (uid, res) => {
    try {
        const expiresIn = 60 * 60
        const refreshToken = jwt.sign(
            { uid },
            process.env.TOKEN_SECRET_REFRESH, 
            {expiresIn}
        )

        res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        res.cookie("refreshToken", refreshToken,
        {
            httpOnly: true,
            secure: !(process.env.MODO === "developer"),
            expire: new Date(Date.now() + expiresIn),
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = generateRefreshToken
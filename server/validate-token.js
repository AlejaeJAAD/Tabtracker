const jwt = require('jsonwebtoken')
const errorTokens = require("./utils/errorsToken.js")

// middleware to validate token (rutas protegidas)
const verifyToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        if (!token) throw new Error("No existe el token");

        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.TOKEN_SECRET);
        req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: errorTokens(error.message) });
    }
}

module.exports = verifyToken;
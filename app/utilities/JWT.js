const { sign, verify } = require('jsonwebtoken');

function createToken(user) {
    const accessToken = sign({ email: user.email }, process.env.JWT_PRIVATE_KEY);

    return accessToken
}

async function validateToken(req, res, next) {
    const token = await req.header("x-auth-token")
    if (token == "null") {
        res.status(401).send("Access denied, no token provided")
    }
    else {
        try {
            const decoded = verify(token, process.env.JWT_PRIVATE_KEY)
            req.user = decoded
            req.authenticated = true
            console.log(req.user, "user")
            return next()
        } catch (error) {
            res.status(400).send("Invalid token")
        }
    }

}

module.exports = { createToken, validateToken }


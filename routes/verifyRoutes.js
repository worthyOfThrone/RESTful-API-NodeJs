const jwt = require('jsonwebtoken');

// Middleware: Authenticate User
module.exports = function (req, res, next) {
    // get the token from header
    const token = req.header('jwt-token') && req.header('jwt-token').split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        // verify the jwt token with the help of token_secret
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified;

        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }

}
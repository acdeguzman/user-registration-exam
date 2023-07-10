const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = async (req, res, next) => {

    try {

        // parse authorization token from request headers with format 'Bearer <token>' and just get the token part
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                error: {
                    message: 'No token provided' 
                }
            });
        }
        
        // decode token to verify token validity
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        
        // check if decoded token has correct structure
        if(decodedToken.username === undefined || decodedToken.role === undefined) {
            return res.status(400).json({
                error: {
                    message: 'Invalid token data'
                }
            })
        }

        // attach token data to request object for further use
        req.decodedToken = decodedToken;
        next();
    }

    catch(err) {
        if(err.name === 'TokenExpiredError') {
            res.status(400).json({
                error: {
                    message: "Token already expired"
                }
            })
        }

        else if(err.name === 'JsonWebTokenError') {
            res.status(400).json({
                eror: {
                    message: "Invalid token"
                }
            })
        }

        else throw err;
    }
}

module.exports = verifyTokenMiddleware;
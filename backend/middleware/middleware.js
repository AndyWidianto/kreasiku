import jwt from "jsonwebtoken";

const secret = process.env.SECRET_JWT;

export const createAccessToken = (data) => {
    const payload = {
        user_id: data.user_id,
        username: data.username,
    }
    return jwt.sign(payload, secret, { expiresIn: "7h" }); 
}
export const createRefreshToken = (data) => {
    const payload = {
        user_id: data.user_id,
        username: data.username,
    }
    return jwt.sign(payload, secret, { expiresIn: 60 * 24 * 30 });
}

export const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).json({
            message: "Unauthorization"
        });
    }
    try {
        const parseAuth = authorization.split(" ")[1];
        const verifyToken = jwt.verify(parseAuth, secret);
        req.user = verifyToken;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            message: "Token Telah Expired"
        })
    }
}

export const verifyTokenIfAny = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next();
    }
    try {
        const parseAuth = authorization.split(" ")[1];
        const verifyToken = jwt.verify(parseAuth, secret);
        req.user = verifyToken;
    } catch (err) {
        console.error(err);
    } finally {
        next();
    }
}
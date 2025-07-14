import jwt from "jsonwebtoken";

const secret = process.env.SECRET_JWT;

export const createToken = (data) => {
    const payload = {
        user_id: data.user_id,
        username: data.username,
        email: data.email
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" });
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
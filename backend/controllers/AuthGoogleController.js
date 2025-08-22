import { createAccessToken, createRefreshToken } from "../middleware/middleware.js";
import { findUserForLogin, insertUser, updateRefreshToken } from "../services/UsersService.js";

export const AuthGoogle = async (req, res) => {
    const user = req.user;
    try {
        const payload = {
            username: user.displayName,
            email: user.emails[0].value
        }
        const findUser = await findUserForLogin(payload.email);
        if (!findUser) {
            const getUser = await insertUser(payload);
            payload.user_id = getUser.user_id;
        } else {
            payload.user_id = findUser.user_id;
        }
        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);
        await updateRefreshToken(payload.user_id, refreshToken);
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, simeSite: 'strict' });
        res.redirect(`${process.env.CLIENT_URL}?token=${accessToken}`)
    } catch (err) {
        console.log(err);
        res.status(500);
    }
}
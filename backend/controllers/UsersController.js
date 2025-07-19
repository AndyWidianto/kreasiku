import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUser, findUserForLogin, findUsersFromUsername, findUserPk, findUsers, insertUser, updateRefreshToken, findUserToToken } from "../services/UsersService.js";
import { createAccessToken, createRefreshToken } from "../middleware/middleware.js";
import { insertProfile } from "../services/ProfilesService.js";

const secret = process.env.SECRET_JWT;
const cache = new Map();

export const Login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findUserForLogin(username);
        if (!user) {
            return res.status(404).json({
                message: "Username salah!"
            })
        }
        const checkPassword = await bcrypt.compare(password, user.dataValues.password);
        if (!checkPassword) {
            return res.status(403).json({
                success: "fail",
                message: "Mohon masukan password dengan benar!"
            });
        }
        const token = createAccessToken(user);
        const refreshToken = createRefreshToken(user);
        await updateRefreshToken(user.user_id, refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            simeSite: 'strict'
        });
        res.status(200).json({
            message: "Login Berhasil",
            token: token
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const Register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username)) {
        return res.status(403).json({
            message: "username not found"
        });
    };

    try {
        if (await findUser(username)) {
            return res.status(403).json({
                message: "Username telah tersedia"
            })
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await insertUser(username, email, passwordHash);
        const token = createAccessToken(user);
        const refreshToken = createRefreshToken(user);
        await updateRefreshToken(user.user_id, refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            simeSite: 'strict'
        });
        res.status(201).json({
            message: "Berhasil menambahkan user",
            token: token
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const Logout = async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({
        message: "Berhasil Logout"
    });
}
export const getUsers = async (req, res) => {
    const { username } = req.query;
    try {
        if (username) {
            const user = await findUsersFromUsername(username);
            return res.status(200).json({
                data: user
            })
        }
        const users = await findUsers();
        const NewUsers = users.map(user => {
            delete user.dataValues.password;
            return {
                ...user.dataValues
            }
        });
        res.status(200).json({
            data: NewUsers
        })
    } catch (err) {
        console.error(err);
        req.status(500);
    }
}
export const getUser = async (req, res) => {
    const { user_id } = req.user;
    try {
        const user = await findUserPk(user_id);
        user.profile.profile_picture = user.profile.profile_picture ? `${req.protocol}://${req.get('host')}/${user.profile.profile_picture}` : null;
        res.status(200).json({
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const updateAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({
            message: "cookie not found"
        });
    }
    try {
        const parseToken = jwt.verify(refreshToken, secret);
        let user = cache.get(parseToken.user_id);
        if (!user) {
            user = await findUserToToken(parseToken.user_id);
            cache.set(parseToken.user_id, user);
        }
        if (user.refreshToken !== refreshToken) return res.status(403);
        const accessToken = createAccessToken(user);
        res.status(200).json({
            token: accessToken
        })
    } catch (err) {
        console.error(err);
        return res.status(401);
    }
}
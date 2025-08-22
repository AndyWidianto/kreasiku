import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUser, findUserForLogin, findUserPk, findUsers, insertUser, updateRefreshToken, findUserToToken, searchUsersFromUsername, findUserFromUsername } from "../services/UsersService.js";
import { createAccessToken, createRefreshToken } from "../middleware/middleware.js";

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
        const checkPassword = await bcrypt.compare(password, user.password);
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
            token: token,
            secret: process.env.CRYPTO_SECRET
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const Register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username)) {
        return res.status(404).json({
            message: "username not found"
        });
    };

    if (!(password)) {
        return res.status(404).json({
            message: "password not found"
        });
    };

    try {
        if (await findUser(username)) {
            return res.status(405).json({
                message: "Username telah tersedia"
            })
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await insertUser({ username, email, password: passwordHash });
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
    const { username, limit, offset } = req.query;
    const userData = req.user || null;
    try {
        if (username) {
            const user = await searchUsersFromUsername({ user_id: userData?.user_id, user: username, protocol: req.protocol, host: req.get('host'), limit: parseInt(limit), offset: parseInt(offset) });
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
        res.status(500);
    }
}
export const getUser = async (req, res) => {
    const { user_id } = req.user;
    try {
        const user = await findUserPk(user_id);
        const userData = user.toJSON();
        if (userData.profile) {
            userData.profile.cover_picture = userData.profile.cover_picture ? `${req.protocol}://${req.get('host')}/${userData.profile.cover_picture}` : null;
            userData.profile.profile_picture = user.profile.profile_picture ? `${req.protocol}://${req.get('host')}/${user.profile.profile_picture}` : null;
        }
        res.status(200).json({
            data: userData
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

export const getUserFromUsername = async (req, res) => {
    const { username } = req.params;
    const user = req.user || null;
    try {
        const findUser = await findUserFromUsername({ username, user_id: user?.user_id, protocol: req.protocol, host: req.get('host') });
        return res.json({
            data: findUser
        });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}
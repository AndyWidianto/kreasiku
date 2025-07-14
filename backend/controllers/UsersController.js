import { findUser, findUserForLogin, findUsersFromUsername, findUserPk, findUsers, insertUser } from "../services/UsersService.js";
import bcrypt from "bcryptjs";
import { createToken } from "../middleware/middleware.js";
import { insertProfile } from "../services/ProfilesService.js";

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
        delete user.password;
        const token = createToken(user);
        res.status(200).json({
            message: "Login Berhasil",
            token: token
        })
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
        const newUser = await insertUser(username, email, passwordHash);
        const newProfile = {
            user_id: newUser.user_id,
            name: newUser.username
        }
        await insertProfile(newProfile);
        res.status(201).json({
            message: "Berhasil menambahkan user"
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
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
        res.status(200).json({
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
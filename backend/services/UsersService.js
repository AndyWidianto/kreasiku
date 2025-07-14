import { Op } from "sequelize"
import users from "../models/users.js"
import profiles from "../models/profile.js";
import notifications from "../models/notification.js";

export const insertUser = async (username, email, password) => {
    return await users.create({
        username: username,
        email: email,
        password: password
    });
}
export const findUserForLogin = async (user) => {
    return await users.findOne({
        where: {
            [Op.or]: [
                {
                    username: user
                },
                {
                    email: user
                }
            ]
        },
        include: {
            model: profiles
        }
    })
}
export const findUser = async (user) => {
    return await users.findOne({
        attributes: ["user_id", "username"],
        where: {
            [Op.or]: [
                {
                    username: user
                },
                {
                    email: user
                }
            ]
        },
        include: {
            model: profiles
        }
    })
}
export const findUsersFromUsername = async (user) => {
    return await users.findAll({
        attributes: ["user_id", "username"],
        where: {
            username: {
                [Op.like]: `%${user}%`
            }
        },
        include: {
            model: profiles
        },
        limit: 10
    })
}
export const findUsers = async () => {
    return await users.findAll({
        include: {
            model: profiles
        }
    });
}
export const findUserPk = async (id) => {
    return await users.findByPk(id, {
        attributes: ["user_id", "username"],
        include: [
            {
                model: profiles
            }
        ]
    });
}
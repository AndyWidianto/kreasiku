import { Op, Sequelize } from "sequelize"
import users from "../models/users.js"
import profiles from "../models/profile.js";
import notifications from "../models/notification.js";
import follows from "../models/follows.js";
import postings from "../models/posting.js";

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
        }
    });
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
export const searchUsersFromUsername = async (user) => {
    return await users.findAll({
        attributes: ["user_id", "username"],
        where: {
            username: {
                [Op.like]: `%${user}%`
            }
        },
        include: {
            model: profiles,
            as: "profile"
        },
        limit: 10
    })
}
export const findUserFromUsername = async (username) => {
    const user = await users.findOne({
        where: { username },
        attributes: [
            "user_id",
            "username",
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("postings.posting_id"))), "total_posting"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("followers.id"))), "total_follower"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("followings.id"))), "total_following"],
        ],
        include: [
            {
                model: postings,
                as: "postings",
                attributes: [],
            },
            { 
                model: profiles,
                as: "profile"
            },
            {
                model: follows,
                as: "followers",
                attributes: []
            },
            {
                model: follows,
                as: "followings",
                attributes: []
            },
        ],
        group: ["users.user_id"]
    })
    return user;
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
                model: profiles,
                as: "profile"
            }
        ]
    });
}
export const findUserToToken = async (id) => {
    return await users.findByPk(id);
}
export const updateRefreshToken = async (user_id, refreshToken) => {
    return await users.update({
        refreshToken
    }, {
        where: {
            user_id
        }
    })
}
import { Op, Sequelize } from "sequelize"
import users from "../models/users.js"
import profiles from "../models/profile.js";
import notifications from "../models/notification.js";
import follows from "../models/follows.js";
import postings from "../models/posting.js";

export const insertUser = async ({ username, email, password, refreshToken }) => {
    const result = await users.create({
        username,
        email,
        password,
        refreshToken
    });
    return result.toJSON();
}
export const findUserForLogin = async (user) => {
    const result = await users.findOne({
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
    if (!result) return null;
    return result.toJSON();
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
export const searchUsersFromUsername = async ({ user_id, user, protocol, host, limit, offset }) => {
    const results = await users.findAll({
        attributes: ["user_id", "username"],
        where: {
            username: {
                [Op.like]: `%${user}%`
            }
        },
        include: [
            {
                model: profiles,
                as: "profile"
            },
            {
                model: follows,
                as: "follower",
                where: {
                    follower_id: user_id || null
                },
                required: false
            }
        ],
        limit,
        offset
    });
    if (results.length <= 0) {
        return results;
    }
    const newResults = results.map(result => {
        const resultJson = result.toJSON();
        const my_following = resultJson.follower ? true : false;
        const profile_picture = resultJson.profile.profile_picture;
        resultJson.profile.profile_picture = profile_picture ? `${protocol}://${host}/${profile_picture}` : null;
        return { 
            my_following,
            ...resultJson
         };
    });
    return newResults;
}
export const findUserFromUsername = async ({ username, user_id, protocol, host }) => {
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

    if (!user) {
        throw new Error("User tidak ada");
    }
    const userData = user.toJSON();
    userData.profile.profile_picture = userData.profile.profile_picture ? `${protocol}://${host}/${userData.profile.profile_picture}` : null;
    userData.profile.cover_picture = userData.profile.cover_picture ? `${protocol}://${host}/${userData.profile.cover_picture}` : null;
    const mine = user_id === userData.user_id;
    userData.mine = mine;
    const myFollow = await follows.findOne({ where: { follower_id: user_id, following_id: userData.user_id } });
    userData.my_following = myFollow ? true : false;
    return userData;
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
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
            model: profiles,
            as: "profile"
        }
    })
}
export const searchUsersFromUsername = async ({ user_id, user, protocol, host, limit, offset }) => {
    const results = await users.findAll({
        attributes: ["user_id", "username"],
        where: {
            username: {
                [Op.like]: `%${user}%`
            },
            user_id: {
                [Op.not]: user_id || null
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
    const countUsers = await users.count({
        where: {
            username: {
                [Op.like]: `%${user}%`
            }
        }
    });
    if (results.length <= 0) {
        return { results , count: countUsers };
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
    return { results: newResults, count: countUsers };
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
            {
                model: follows,
                as: "follower",
                required: false,
                where: {
                    follower_id: user_id || null
                }
            },
            {
                model: follows,
                as: "following",
                required: false,
                where: {
                    following_id: user_id || null
                }
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
    userData.my_following = userData.follower ? true : false;
    userData.user_follow_me = userData.following ? true : false;
    return userData;
}
export const findUsers = async (user_id) => {
    return await users.findAll({
        where: {
            user_id: {
                [Op.not]: user_id
            }
        },
        include: {
            model: profiles,
            as: "profile"
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
    const result = await users.findByPk(id);
    return result.toJSON();
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
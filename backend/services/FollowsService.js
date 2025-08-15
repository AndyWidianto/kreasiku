import { Op, Sequelize } from "sequelize";
import follows from "../models/follows.js";
import users from "../models/users.js";
import profiles from "../models/profile.js";

export const insertFollow = async (id, follower_id, following_id) => {
    const findUser = await users.findByPk(following_id);
    if (!findUser) {
        throw new Error("user_id tidak ada");
    }
    const already = await follows.findOne({
        where: {
            follower_id,
            following_id
        }
    });
    if (already) {
        return already;
    }
    const result = await follows.create({
        id,
        follower_id,
        following_id
    });
    return result;
}

export const NotFollowings = async (id) => {
    const results = await follows.findAll({
        where: {
            following_id: id,
            follower_id: {
                [Op.notIn]: Sequelize.literal(`(SELECT following_id FROM follows WHERE follower_id = ${id})`)
            }
        },
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                as: "follower",
                include: {
                    model: profiles,
                    as: "profile"
                }
            }
        ]
    });
    const newResults = results.map(result => {
        const resultJson = result.toJSON();
        const folback = false;
        const profile = resultJson.follower.profile.profile_picture;
        const cover = resultJson.follower.profile.cover_picture;
        resultJson.follower.profile.profile_picture = profile ? `${protocol}://${host}/${profile}` : null;
        resultJson.follower.profile.cover_picture = profile ? `${protocol}://${host}/${cover}` : null;
        return {
            folback,
            ...resultJson
        }
    })
    return newResults;
}

export const findFollowers = async ({ username, protocol, host, user_id, search, limit, offset }) => {
    const findUser = await users.findOne({
        where: {
            username
        }
    })
    const is_search = search ? {
        username: { [Op.like]: `%${search}%` }
    } : null;
    const user = findUser.toJSON();
    const results = await follows.findAll({
        where: {
            following_id: user.user_id,
        },
        include: [
            {
                model: users,
                as: "follower",
                attributes: ["user_id", "username"],
                where: is_search,
                include: {
                    model: profiles,
                    as: "profile"
                }
            }
        ],
        limit,
        offset
    });
    const newResults = results.map(result => {
        const resultJson = result.toJSON();
        const mine = resultJson.follower.follower_id === user_id;
        const profile = resultJson.follower.profile.profile_picture;
        const cover = resultJson.follower.profile.cover_picture;
        resultJson.follower.profile.profile_picture = profile ? `${protocol}://${host}/${profile}` : null;
        resultJson.follower.profile.cover_picture = cover ? `${protocol}://${host}/${cover}` : null;
        return {
            mine,
            ...resultJson
        }
    })
    return newResults;
}

export const findFollowings = async ({ username, protocol, host, user_id, search, limit, offset }) => {
    const findUser = await users.findOne({
        where: {
            username
        }
    })
    const is_search = search ? {
        username: { [Op.like]: `%${search}%` }
    } : null;
    const user = findUser.toJSON();
    const results = await follows.findAll({
        where: {
            follower_id: user.user_id
        },
        include: [
            {
                model: users,
                as: "following",
                attributes: ["user_id", "username"],
                where: is_search,
                include: {
                    model: profiles,
                    as: "profile"
                }
            }
        ],
        limit,
        offset
    });
    const newResults = results.map(result => {
        const resultJson = result.toJSON();
        const folback = true;
        const my_following = user.user_id === user_id;
        const profile = resultJson.following.profile.profile_picture;
        const cover = resultJson.following.profile.cover_picture;
        resultJson.following.profile.profile_picture = profile ? `${protocol}://${host}/${profile}` : null;
        resultJson.following.profile.cover_picture = cover ? `${protocol}://${host}/${cover}` : null;
        return {
            folback,
            my_following,
            ...resultJson
        }
    })
    return newResults;
}

export const deleteFollow = async (my_id, user_id) => {
    const result = await follows.destroy({
        where: {
            follower_id: my_id,
            following_id: user_id
        }
    });
    return result;
}

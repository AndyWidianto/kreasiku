import { Model } from "sequelize";
import mention from "../models/mentionsCommment.js"
import users from "../models/users.js";
import profiles from "../models/profile.js";

export const insertMention = async (id, comment_id, user_id, content) => {
    const result = await mention.create({
        id,
        comment_id,
        user_id,
        content
    });
    return result;
}
export const findMentions = async (id, limit, offset, protocol, host, not_id) => {
    const results = await mention.findAll({
        where: {
            comment_id: id
        },
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                as: "user",
                include: {
                    model: profiles,
                    as: "profile"
                }
            }
        ],
        order: [['createdAt', 'ASC']],
        limit: limit,
        offset: offset
    });
    const newResults = results.map(result => {
        const profile = result.user.profile.profile_picture;
        result.user.profile.profile_picture = profile ? `${protocol}://${host}/${profile}` : null;
        return {
            ...result.dataValues
        }
    })
    return newResults;
}

export const findMention = async (id, protocol, host) => {
    const result = await mention.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                as: "user",
                include: {
                    model: profiles,
                    as: "profile"
                }
            }
        ],
        order: [['createdAt', 'ASC']],
    });
    const resultJson = result.toJSON();
    const profile = resultJson.user.profile.profile_picture;
    resultJson.user.profile.profile_picture = profile ? `${protocol}://${host}/${profile}` : null;
    return resultJson;
}


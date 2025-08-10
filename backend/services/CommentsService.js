import { Sequelize } from "sequelize"
import comments from "../models/commentsPosting.js"
import likesComment from "../models/likesComment.js"
import mention from "../models/mentionsCommment.js"
import profiles from "../models/profile.js"
import users from "../models/users.js"

export const insertComment = async (comment_id, id, posting_id, content) => {
    return await comments.create({
        comment_id: comment_id,
        user_id: id,
        posting_id: posting_id,
        content: content,
    })
}
export const findComments = async (limit, offset, id, protocol, host) => {
    const results = await comments.findAll({
        subQuery: false,
        where: {
            posting_id: id
        },
        attributes: [
            "comment_id",
            "posting_id",
            "content",
            "createdAt",
            [Sequelize.fn("COUNT", Sequelize.col("mentions.id")), "total_mentions"]
        ],
        include: [
            {
                model: mention,
                as: "mentions",
                attributes: []
            },
            {
                model: likesComment
            },
            {
                model: users,
                attributes: ["user_id", "username"],
                include: { model: profiles }
            }
        ],
        group: ["comments.comment_id"],
        order: [['createdAt', 'ASC']],
        limit: limit,
        offset: offset,
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

export const findComment = async (id) => {
    const result = await comments.findAll({
        where: {
            posting_id: id
        },
        attributes: [
            "comment_id",
            "posting_id",
            "content",
            "createdAt",
            [Sequelize.fn("COUNT", Sequelize.col("mentions.id")), "total_mentions"]
        ],
        include: [{
            model: mention,
            attributes: []
        },
        {
            model: users,
            include: { model: profiles }
        }
        ],
        group: ["comments.comment_id"],
        order: [['createdAt', 'ASC']]
    });
    return result;
}
import images from "../models/imagesPosting.js";
import postings from "../models/posting.js";
import likesPosting from "../models/likesPosting.js";
import users from "../models/users.js";
import profiles from "../models/profile.js";
import comments from "../models/commentsPosting.js";
import { Op, Sequelize } from "sequelize";
import mention from "../models/mentionsCommment.js";


export const findPostings = async ({ protocol, host, limit, offset, user_id }) => {
    const results = await postings.findAll({
        subQuery: false,
        attributes: [
            "posting_id",
            "user_id",
            "content",
            "createdAt",
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("comments.comment_id"))), "total_comments"],
            [Sequelize.fn("COUNT", Sequelize.col("comments.mentions.id")), "total_mentions"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("all_likes.id"))), "total_likes"]
        ],
        order: [['posting_id', 'DESC']],
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                include: {
                    model: profiles,
                    as: "profile"
                }
            },
            {
                model: likesPosting,
                as: "all_likes",
                attributes: [],
            },
            {
                model: likesPosting,
                as: "like",
                required: false,
                where: { user_id: user_id || null }
            },
            {
                model: images,
                separate: true
            },
            {
                model: comments,
                attributes: [],
                as: "comments",
                include: {
                    model: mention,
                    attributes: []
                }
            }
        ],
        group: ["postings.posting_id"],
        limit: limit,
        offset: offset
    });
    const newData = results.map(posting => {
        const is_like = posting.like ? true : false;
        const profile_picture = posting.user.profile.profile_picture;
        const cover_picture = posting.user.profile.cover_picture;
        posting.user.profile.profile_picture = profile_picture ? `${protocol}://${host}/${profile_picture}` : null;
        posting.user.profile.cover_picture = cover_picture ? `${protocol}://${host}/${cover_picture}` : null;
        const mine = posting.user_id === user_id;
        posting.dataValues.images = posting.dataValues.images.map(image => {
            image.image = `${protocol}://${host}/${image.image}`;
            return {
                ...image.dataValues
            }
        });
        return {
            mine,
            is_like,
            ...posting.dataValues
        }
    });
    return newData;
}
export const searchPostings = async ({ protocol, host, limit, offset, search, user_id }) => {
    const results = await postings.findAll({
        where: {
            content: {
                [Op.like]: `%${search}%`
            }
        },
        subQuery: false,
        attributes: [
            "posting_id",
            "user_id",
            "content",
            "createdAt",
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("comments.comment_id"))), "total_comments"],
            [Sequelize.fn("COUNT", Sequelize.col("comments.mentions.id")), "total_mentions"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("all_likes.id"))), "total_likes"]
        ],
        order: [['posting_id', 'DESC']],
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                include: {
                    model: profiles,
                    as: "profile"
                }
            },
            {
                model: likesPosting,
                as: "all_likes",
                attributes: [],
            },
            {
                model: likesPosting,
                as: "like",
                required: false,
                where: { user_id: user_id || null }
            },
            {
                model: images,
                separate: true
            },
            {
                model: comments,
                attributes: [],
                as: "comments",
                include: {
                    model: mention,
                    attributes: []
                }
            }
        ],
        group: ["postings.posting_id"],
        limit: limit,
        offset: offset
    });
    if (results.length < 1) {
        return results;
    }
    const newResults =  results.map(posting => {
        const is_like = posting.like ? true : false;
        const profile_picture = posting.user.profile.profile_picture;
        posting.user.profile.profile_picture = profile_picture ? `${protocol}://${host}/${profile_picture}` : null;
        posting.dataValues.images = posting.dataValues.images.map(image => {
            image.image = `${protocol}://${host}/${image.image}`;
            return {
                ...image.dataValues
            }
        });
        return {
            is_like,
            ...posting.dataValues
        }
    });
    return newResults;
}
export const insertPosting = async (data) => {
    return await postings.create(data);
}
export const findPostingPrimary = async (protocol, host, id, user_id) => {
    const result = await postings.findByPk(id, {
        attributes: [
            "posting_id",
            "user_id",
            "content",
            "createdAt",
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col("all_likes.id"))), 'total_likes'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.comment_id'))), 'total_comments'],
            [Sequelize.fn('COUNT', Sequelize.col('comments.mentions.id')), 'total_mentions']
        ],
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                include: {
                    model: profiles,
                    as: "profile"
                }
            },
            {
                model: likesPosting,
                as: "all_likes",
                attributes: []
            },
            {
                model: likesPosting,
                as: "like",
                required: false,
                where: { user_id: user_id || null }
            },
            {
                model: images,
                separate: true
            },
            {
                model: comments,
                as: "comments",
                attributes: [],
                include: [
                    {
                        model: mention,
                        attributes: [],
                    }
                ],
            }
        ],
    });
    const resultJson = result.toJSON();
    resultJson.is_like = resultJson.like ? true : false;
    const profile_picture = resultJson.user.profile.profile_picture;
    resultJson.user.profile.profile_picture = profile_picture ? `${protocol}://${host}/${profile_picture}` : null;
    resultJson.images = resultJson.images.map(image => {
        image.image = `${protocol}://${host}/${image.image}`
        return {
            ...image
        }
    });
    return resultJson;
}
export const findPostingsUser = async ({ id, limit, offset, protocol, host, user_id }) => {
    const results = await postings.findAll({
        where: {
            user_id: id
        },
        attributes: [
            "posting_id",
            "user_id",
            "content",
            "createdAt",
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.comment_id'))), 'total_comments'],
            [Sequelize.fn('COUNT', Sequelize.col('comments.mentions.id')), 'total_mentions'],
            [Sequelize.fn('COUNT', Sequelize.fn("DISTINCT", Sequelize.col('all_likes.id'))), 'total_likes']
        ],
        include: [
            {
                model: likesPosting,
                as: "all_likes",
                attributes: [],
            },
            {
                model: likesPosting,
                as: "like",
                required: false,
                where: { user_id: user_id || null }
            },
            {
                model: images,
                separate: true
            },
            {
                model: comments,
                as: "comments",
                attributes: [],
                include: [
                    {
                        model: mention,
                        attributes: [],
                    }
                ],
            }
        ],
        order: [['createdAt', 'ASC']],
        group: ['postings.posting_id'],
        limit,
        offset
    });
    const newResults = results.map(posting => {
        const is_like = posting.like ? true : false;
        posting.images = posting.images.map(image => {
            image.image = image.image ? `${protocol}://${host}/${image.image}` : null;
            return {
                ...image.dataValues
            }
        });
        return {
            is_like,
            ...posting.dataValues
        }
    });
    return newResults;
}
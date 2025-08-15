import images from "../models/imagesPosting.js";
import postings from "../models/posting.js";
import likesPosting from "../models/likesPosting.js";
import users from "../models/users.js";
import profiles from "../models/profile.js";
import comments from "../models/commentsPosting.js";
import { Op, Sequelize } from "sequelize";
import mention from "../models/mentionsCommment.js";


export const findPostings = async (protocol, host, limit, offset, user_id) => {
    const results = await postings.findAll({
        subQuery: false,
        attributes: [
            "posting_id",
            "user_id",
            "content",
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("comments.comment_id"))), "total_comments"],
            [Sequelize.fn("COUNT", Sequelize.col("comments.mentions.id")), "total_mentions"],
            "createdAt"
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
            { model: likesPosting },
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
        const is_like = posting.likes.findIndex(like => like.user_id === user_id) > -1;
        const mine = posting.user_id === user_id ? true : false;
        posting.dataValues.images = posting.dataValues.images.map(image => {
            image.image = `${protocol}://${host}/${image.image}`;
            return {
                ...image.dataValues
            }
        });
        return {
            is_like,
            mine,
            ...posting.dataValues
        }
    });
    return newData;
}
export const searchPostings = async (protocol, host, search, user_id) => {
    const data = await postings.findAll({
        where: {
            content: {
                [Op.like]: `%${search}%`
            }
        },
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                include: {
                    model: profiles
                }
            },
            { model: likesPosting },
            { model: images },
            { model: comments }
        ]
    })
    if (!data) {
        throw new Error({ message: "Yah tidak ada nih" });
    }
    return data.map(posting => {
        const is_like = posting.likes.findIndex(like => like.user_id === user_id) > 0;
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
    })
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
                model: likesPosting
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
    const like = resultJson.likes.find(like => like.user_id === user_id);
    resultJson.is_like = like ? true : false;
    resultJson.images = resultJson.images.map(image => {
        image.image = `${protocol}://${host}/${image.image}`
        return {
            ...image
        }
    });
    return resultJson;
}
export const findPostingsUser = async (id) => {
    return await postings.findAll({
        where: {
            user_id: id
        },
        include: [
            {
                model: likesPosting
            },
            {
                model: images
            },
            {
                model: comments,
                order: [['createdAt', 'ASC']]
            }
        ]
    });
}
import images from "../models/imagesPosting.js";
import postings from "../models/posting.js";
import likesPosting from "../models/likesPosting.js";
import users from "../models/users.js";
import profiles from "../models/profile.js";
import comments from "../models/commentsPosting.js";
import { Op } from "sequelize";

export const findPostings = async (limit, offset, search) => {
    if (search) {
        return await postings.findAll({
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
                {
                    model: likesPosting
                },
                {
                    model: images
                },
                {
                    model: comments
                }
            ]
        })
    }
    return await postings.findAll({
        order: [['posting_id', 'DESC']],
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                include: {
                    model: profiles
                }
            },
            {
                model: likesPosting
            },
            {
                model: images
            },
            {
                model: comments
            }
        ],
        limit: limit,
        offset: offset
    });
}
export const insertPosting = async (data) => {
    return await postings.create(data);
}
export const findPostingPrimary = async (id) => {
    return await postings.findByPk(id, {
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                include: {
                    model: profiles
                }
            },
            {
                model: likesPosting
            },
            {
                model: images
            },
            {
                model: comments,
                include: {
                    model: users,
                    attributes: ["user_id", "username"],
                    include: {
                        model: profiles
                    }
                }
            }
        ]
    });
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
                model: comments
            }
        ]
    });
}
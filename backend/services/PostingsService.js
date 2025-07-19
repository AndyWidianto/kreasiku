import images from "../models/imagesPosting.js";
import postings from "../models/posting.js";
import likesPosting from "../models/likesPosting.js";
import users from "../models/users.js";
import profiles from "../models/profile.js";
import comments from "../models/commentsPosting.js";

export const findPostings = async () => {
    return await postings.findAll({
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
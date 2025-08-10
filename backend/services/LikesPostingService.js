import likesPosting from "../models/likesPosting.js"

export const insertLikePosting = async (data) => {
    return await likesPosting.create(data);
}
export const findLikesPosting = async (id) => {
    return await likesPosting.findAll({
        where: {
            posting_id: id
        }
    })
}
export const findLikePosting = async (posting_id, user_id) => {
    return await likesPosting.findOne({
        where: {
            posting_id,
            user_id
        }
    })
}
export const delLikePosting = async (id) => {
    return await likesPosting.destroy({
        where: {
            id
        }
    })
}
import likesComment from "../models/likesComment.js"

export const insertLikesComment = async (id, comment_id) => {
    return await likesComment.create({
        user_id: id,
        comment_id: comment_id
    })
}
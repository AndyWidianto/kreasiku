import comments from "../models/commentsPosting.js"
import likesComment from "../models/likesComment.js"

export const insertComment = async (id, posting_id, content) => {
    return await comments.create({
        user_id: id,
        posting_id: posting_id,
        content: content
    })
}
export const findComments = async (id) => {
    return await comments.findOne({
        where: {
            posting_id: id
        },
        include: {
            model: likesComment
        }
    })
}
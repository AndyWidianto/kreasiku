import { findComments, insertComment } from "../services/CommentsService.js";

export const createComment = async (req, res) => {
    const { posting_id, content } = req.body;
    const { user_id } = req.user;
    try {
        const comment = await insertComment(user_id, posting_id, content);
        res.status(201).json({
            message: "Berhasil",
            data: comment
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getCommentsFromId = async (req, res) => {
    // id dari postingan
    const { id } = req.params;
    try {
        const comments = await findComments(id);
        res.status(200).json({
            data: comments
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
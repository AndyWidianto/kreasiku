import { findComment, findComments, insertComment } from "../services/CommentsService.js";

export const createComment = async (req, res) => {
    const { posting_id, content, comment_id } = req.body;
    const { user_id } = req.user;
    try {
        const comment = await insertComment(comment_id, user_id, posting_id, content);
        res.status(201).json({
            message: "Berhasil",
            data: comment
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getComments = async (req, res) => {
    const { limit, offset } = req.query;
    const targetId = req.query.target || null;
    const { id } = req.params;
    try {
        const comments = await findComments(parseInt(limit), parseInt(offset), id, req.protocol, req.get('host'), targetId);
        res.status(200).json({
            data: comments
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getComment = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await findComment(id);
        res.json({
            data: result
        });
    } catch (err) {
        console.error(err);
    }
}
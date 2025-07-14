import { insertLikesComment } from "../services/LikesCommentService.js";

export const createLikesComment = async (req, res) => {
    const { comment_id, user_id } = req.body;
    try {
        await insertLikesComment(user_id, comment_id);
        res.status(200).json({
            message: "Berhasil like"
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
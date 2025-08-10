import { findMentions, insertMention } from "../services/mentionsService.js";

export const createMention = async (req, res) => {
    const { id, comment_id, content } = req.body;
    const { user_id } = req.user;
    if (!content) {
        return res.status(404).json({
            message: "content not found"
        });
    }
    try {
        await insertMention(id, comment_id, user_id, content);
        res.json({
            message: "Berhasil menambahkan mention"
        });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

export const getMentions = async (req, res) => {
    const { id } = req.params;
    const { limit, offset } = req.query;
    try {
        const mentions = await findMentions(id, parseInt(limit), parseInt(offset), req.protocol, req.get('host'));
        res.json({
            data: mentions
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
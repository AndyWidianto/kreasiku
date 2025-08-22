import { findPostingPrimary, findPostings, findPostingsUser, insertPosting, searchPostings } from "../services/PostingsService.js";

export const getPostings = async (req, res) => {
    const { search, offset, limit } = req.query;
    const user = req.user || null;
    try {
        if (search) {
            const postings = await searchPostings({ protocol: req.protocol, host: req.get('host'), search, user_id: user?.user_id, limit: parseInt(limit), offset: parseInt(offset) });
            return res.status(200).json({
                data: postings
            });
        }
        const postings = await findPostings({ protocol: req.protocol, host: req.get('host'), limit: parseInt(limit), offset: parseInt(offset), user_id: user?.user_id });
        res.status(200).json({
            data: postings
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const createPosting = async (req, res) => {
    const { content } = req.body;
    const { user_id } = req.user;
    try {
        const posting = await insertPosting({ content, user_id });
        res.status(201).json({
            message: "Posting Berhasil dibuat",
            data: posting
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getPosting = async (req, res) => {
    const { id } = req.params;
    const user = req.user ? req.user : null;
    try {
        const posting = await findPostingPrimary(req.protocol, req.get('host'), id, user?.user_id);
        res.status(200).json({
            data: posting
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getPostingsUser = async (req, res) => {
    const { id } = req.params;
    const { limit, offset } = req.query;
    const user = req.user || null;
    console.log(user);
    try {
        const postings = await findPostingsUser({ id, limit, offset, protocol: req.protocol, host: req.get('host'), user_id: user?.user_id });
        res.status(200).json({
            data: postings
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
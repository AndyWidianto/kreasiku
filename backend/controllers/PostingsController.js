import { findPostingPrimary, findPostings, findPostingsUser, insertPosting, searchPostings } from "../services/PostingsService.js";

export const getPostings = async (req, res) => {
    const { search, offset, limit } = req.query;
    const user = req.user || null;
    try {
        if (search) {
            const postings = await searchPostings(req.protocol, req.get('host'), search, user?.user_id);
            return res.status(200).json({
                data: postings
            })
        }
        const postings = await findPostings(req.protocol, req.get('host'), parseInt(limit), parseInt(offset), user?.user_id);
        res.status(200).json({
            data: postings
        })
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
    console.log(user);
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
    try {
        const postings = await findPostingsUser(id);
        const newPostings = postings.map(posting => {
            posting.images = posting.images.map(image => {
                image.image = image.image ? `${req.protocol}://${req.get('host')}/${image.image}` : null;
                return {
                    ...image.dataValues
                }
            });
            return {
                ...posting.dataValues
            }
        });
        res.status(200).json({
            data: postings
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
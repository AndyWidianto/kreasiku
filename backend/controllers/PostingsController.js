import { findPostingPrimary, findPostings, insertPosting } from "../services/PostingsService.js"

export const getPostings = async (req, res) => {
    try {
        const postings = await findPostings();
        const newPostings = postings.map(posting => {
            posting.dataValues.images = posting.dataValues.images.map(image => {
                image.image = `${req.protocol}://${req.get('host')}/${image.image}`;
                return {
                    ...image.dataValues
                }
            });
            return {
                ...posting.dataValues
            }
        })
        res.status(200).json({
            data: newPostings
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
    try {
        const posting = await findPostingPrimary(id);
        posting.images = posting.images.map(image => {
            image.image = `${req.protocol}://${req.get('host')}/${image.image}`
            return {
                ...image.dataValues
            }
        });
        res.status(200).json({
            data: posting
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
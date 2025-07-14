import { delLikePosting, findLikePosting, findLikesPosting, insertLikePosting } from "../services/LikesPostingService.js";

export const createLikesPosting = async (req, res) => {
    const { posting_id } = req.body;
    const { user_id } = req.user;
    try {
        const findLike = await findLikePosting(posting_id, user_id);
        console.log(findLike);
        if (!findLike) {
            await insertLikePosting({ posting_id, user_id });
        }
        res.status(201).json({
            message: "berhasil like"
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getLikesPosting = async (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    try {
        const likes = await findLikesPosting(id);
        const newLikes = likes.map(like => {
            const user_like = like.dataValues.user_id === user_id;
            return {
                ...like.dataValues,
                user_like
            }
        })
        res.status(200).json({
            data: newLikes
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const deleteLikePosting = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.user;
    try {
        await delLikePosting(id, user_id);
        res.status(201).json({
            message: "Berhasil menghapus like"
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
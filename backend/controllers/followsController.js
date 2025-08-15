import { NotFollowings, deleteFollow, findFollowers, findFollowings, insertFollow } from "../services/FollowsService.js";

export const createFollow = async (req, res) => {
    const { id, following_id } = req.body;
    const { user_id } = req.user;
    console.log(following_id);
    try {
        await insertFollow(id, user_id, following_id);
        res.json({
            message: "berhasil follow"
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const getNotFollowings = async (req, res) => {
    const { user_id } = req.user;
    try {
        const followers = await NotFollowings(user_id);
        res.json({
            data: followers
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const getFollowers = async (req, res) => {
    const { user_id } = req.user;
    const { username } = req.params;
    const { search, limit, offset } = req.query;
    try {
        const followers = await findFollowers({ username, protocol: req.protocol, host: req.get('host'), user_id, search, limit: parseInt(limit), offset: parseInt(offset) });
        res.json({
            data: followers
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const getFollowings = async (req, res) => {
    const { user_id } = req.user;
    const { username } = req.params;
    const { search, limit, offset } = req.query;
    try {
        const followers = await findFollowings({ username, protocol: req.protocol, host: req.get('host'), user_id, search, limit: parseInt(limit), offset: parseInt(offset) });
        res.json({
            data: followers
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const unFollow = async (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    try {
        const followers = await deleteFollow(user_id, id);
        res.json({
            message: "Berhasil unfollow"
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

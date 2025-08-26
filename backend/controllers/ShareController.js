import { destroyShare, insertShare } from "../services/SharesService.js";

export const createShare = async (req, res) => {
    const { user_id } = req.user;
    const { id, posting_id } = req.body;
    try {
        const result = await insertShare({ id, posting_id, user_id });
        res.json({
            data: result,
            message: "Berhasil share"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteShare = async (req, res) => {
    const { id } = req.params;
    try {
        await destroyShare({ id });
        res.json({
            message: "berhasil hapus shared"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
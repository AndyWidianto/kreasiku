import shares from "../models/shares.js"

export const insertShare = async ({ id, posting_id, user_id }) => {
    const findShared = await shares.findOne({
        where: {
            user_id,
            posting_id
        }
    });
    if (findShared) {
        return findShared;
    }
    const result = await shares.create({
        id,
        posting_id,
        user_id
    });
    return result;
}

export const destroyShare = async ({ id }) => {
    await shares.destroy({
        where: {
            id
        }
    });
}
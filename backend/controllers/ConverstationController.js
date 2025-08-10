import { findConverstations, insertConverstation } from "../services/converstationService.js";

export const createConverstation = async (req, res) => {
    const { user_id1, user_id2 } = req.body;

    try {
        const result = await insertConverstation(user_id1, user_id2);
        res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

export const getConverstations = async (req, res) => {
    const { user_id } = req.user;
    try {
        const results = await findConverstations(user_id);
        const newResults = results.map(value => {
            const my_id = value.user_id1 === user_id ? value.user_id1 : value.user_id2;
            const user = my_id !== value.user1.user_id ? value.user1 : value.user2;
            user.profile.profile_picture = req.protocol + '://' + req.get('host') + '/' + user.profile.profile_picture;
            value.messages = value.messages.map(message => {
                const sended = true;
                return {
                    sended,
                    ...message.dataValues
                }
            });
            return {
                id: value.id,
                user_id1: value.user_id1,
                user_id2: value.user_id2,
                messages: value.messages,
                my_id,
                user,
            }
        })
        return res.json({
            data: newResults
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
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
        const newResults = results.map(result => {
            const resultJson = result.toJSON();
            const my_id = resultJson.user_id1 === user_id ? resultJson.user_id1 : resultJson.user_id2;
            const user = my_id !== resultJson.user1.user_id ? resultJson.user1 : resultJson.user2;
            const me =  my_id === resultJson.user1.user_id ? resultJson.user1 : resultJson.user2;
            user.profile.profile_picture = req.protocol + '://' + req.get('host') + '/' + user.profile.profile_picture;
            return {
                id: resultJson.id,
                user_id1: resultJson.user_id1,
                user_id2: resultJson.user_id2,
                createdAt: resultJson.createdAt,
                unread_count: resultJson.unread_count,
                last_message: resultJson.last_message,
                my_id,
                user,
                me,
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
import { findConverstation, findConverstations, insertConverstation } from "../services/converstationService.js";

export const createConverstation = async (req, res) => {
    const { id, user_id2 } = req.body;
    const { user_id } = req.user;
    try {
        if (user_id === user_id2) { 
            return res.status(400).json({
                message: "anda tidak dikenakan untuk membuat percakapan dengan diri sendiri"
            })
        }
        const result = await insertConverstation({ id, user_id1: user_id, user_id2 });
        res.json({
            data: result
        });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

export const getConverstations = async (req, res) => {
    const user = req.user;
    try {
        const results = await findConverstations({ id: user.user_id, protocol: req.protocol, host: req.get('host') });
        return res.json({
            user: user,
            data: results
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const getConverstation = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.user;
    try {
        const result = await findConverstation({ id, user_id, protocol: req.protocol, host: req.get('host') });
        res.json({
            data: result
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
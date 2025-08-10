import { findNotifReadFalse, findNotifs, insertNotif, updateNotif } from "../services/NotificationsService.js";

export const createNotif = async (req, res) => {
    const { id, actor_id, verb, object_id, message, is_read } = req.body;
    const { user_id } = req.user;
    if (!actor_id || !verb) {
        return res.status(404).json({
            message: "verb not found"
        })
    }
    try {
        const notif = await insertNotif(id, user_id, actor_id, verb, object_id, message, is_read);
        res.status(201).json({
            message: "Berhasil menambahkan notification",
            data: notif
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getNotifs = async (req, res) => {
    const { user_id } = req.user;
    try {
        const notifs = await findNotifs(req.protocol, req.get('host'), user_id);
        res.status(200).json({
            data: notifs
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const updateNotifId = async (req, res) => {
    const { notif_id, is_read } = req.body;
    try {
        await updateNotif(is_read, notif_id);
        res.status(201).json({
            message: "Berhasil update notif"
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getNotifNotRead = async (req, res) => {
    const { user_id } = req.user;
    try {
        const notif = await findNotifReadFalse(user_id);
        res.status(200).json({
            data: notif
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
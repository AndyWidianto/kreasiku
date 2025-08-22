import { destroyMessage, findMessages, insertMessage, updateMessageUnreadService } from "../services/Messagesservice.js";


export const createMessage = async (req, res) => {
    const { coverstation_id, message_id, sender_id, receiver_id, content, is_read } = req.body;

    try {
        const messages = await insertMessage({ coverstation_id, message_id, sender_id, receiver_id, content, is_read });
        return res.json({
            data: messages
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const message = await destroyMessage(id);
        return res.json(message);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
export const getMessages = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.user;
    try {
        const message = await findMessages(id, user_id);
        return res.json({
            data: message
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const updateMessageUnread = async (req, res) => {
    const { sender_id } = req.body;
    const { user_id } = req.user;
    try {
        const messages = await updateMessageUnreadService(sender_id, user_id);
        res.json({
            message: "Berhasil update messages",
            data: messages
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const getSecret = (req, res) => {
    res.json({
        secret: process.env.CRYPTO_SECRET
    });
}
import { destroyMessage, findLastMessages, findMessages, insertMessage } from "../services/Messagesservice.js";

export const getMessages = async (req, res) => {
    const { id } = req.params;
    try {
        const messages = await findMessages(id);
        res.status(200).json({
            data: messages
        });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

export const getLastMessages = async (req, res) => {
    const { user_id } = req.user;
    try {
        const messages = await findLastMessages(user_id);
        return res.json({
            data: messages
        })
    } catch (err) {
        console.error(err);
        res.status(404).json({
            Error: err
        });
    }
}

export const createMessage = async (req, res) => {
    const { coverstation_id, message_id, sender_id, receiver_id, content } = req.body;

    try {
        const messages = await insertMessage(coverstation_id, message_id, sender_id, receiver_id, content);
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
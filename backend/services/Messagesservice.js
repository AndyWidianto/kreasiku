import messages from "../models/Messages.js";

export const insertMessage = async ({ converstation_id, message_id, sender_id, receiver_id, content, is_read }) => {
    await messages.create({
        converstation_id,
        message_id,
        sender_id,
        receiver_id,
        content,
        is_read
    });
    return { message: "berhasil membuat message" };
}

export const destroyMessage = async (id) => {
    await messages.destroy({
        where: {
            message_id: id
        }
    })
    return {
        message: "message berhasil di hapus"
    }
}

export const findMessages = async (id, user_id) => {
    const results = await messages.findAll({
        where: { converstation_id: id },
        order: [["createdAt", "ASC"]]
    });
    const newResults = results.map(result => {
        const resultJson = result.toJSON();
        if (resultJson.sender_id === user_id) {
            resultJson.sended = "sended";
        }
        return {
            ...resultJson
        }
    })
    return newResults;
}

export const updateMessageUnreadService = async (sender_id, user_id) => {
    const results = await messages.update({ is_read: "true" }, {
        where: { 
            sender_id,
            receiver_id: user_id
        }
    });
    return results;
}



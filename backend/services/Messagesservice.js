import { Op } from "sequelize"
import users from "../models/users.js";
import converstation from "../models/converstations.js";
import messages from "../models/Messages.js";
import profiles from "../models/profile.js";

export const findMessages = async (id) => {
    return await messages.findAll({
        where: {
            [Op.or]: [
                { receiver_id: id },
                { sender_id: id }
            ]
        }
    });
}

export const findLastMessages = async (user_id) => {
    const last_messages = await converstation.findAll({
        where: {
            [Op.or]: [ { user_id1: user_id }, { user_id2: user_id } ]
        },
        include: [
            {
                model: messages
            },{
                model: users,
                as: "user1",
                attributes: ["user_id", "username"],
                include: { 
                    model: profiles,
                    as: "profile"
                }
            },{
                model: users,
                as: "user2",
                attributes: ["user_id", "username"],
                include: { 
                    model: profiles,
                    as: "profile"
                }
            }
        ],
        order: [["createdAt","ASC"]]
    });
    const newLastMessage = last_messages.map(value => {
        const my_id = value.user_id1 === user_id ? value.user_id1 : value.user_id2;
        return {
            my_id,
            ...value.dataValues
        }
    });
    return newLastMessage;
}

export const insertMessage = async (data) => {
    const { converstation_id, message_id, sender_id, receiver_id, content } = data;
    await messages.create({
        converstation_id,
        message_id,
        sender_id,
        receiver_id,
        content
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



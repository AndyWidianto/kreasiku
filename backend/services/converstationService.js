import { Op, Sequelize } from "sequelize";
import converstation from "../models/converstations.js"
import users from "../models/users.js";
import profiles from "../models/profile.js";
import messages from "../models/Messages.js";

export const insertConverstation = async (user_id1, user_id2) => {
    await converstation.create({
        user_id1,
        user_id2
    });
    return { message: "user berhasil di buat"};
}

export const findConverstations = async (id) => {
    const results = await converstation.findAll({
        where: {
            [Op.or]: [{ user_id1: id }, { user_id2: id } ]
        },
        attributes: [
            "id",
            "user_id1",
            "user_id2",
            "createdAt",
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("all_messages.message_id"))), "unread_count"],
        ],
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                as: "user1",
                include: { 
                    model: profiles,
                    as: "profile"
                 }
            },{
                model: users,
                attributes: ["user_id", "username"],
                as: "user2",
                include: { 
                    model: profiles,
                    as: "profile"
                 }
            },
            {
                model: messages,
                as: "all_messages",
                attributes: [],
                where: {
                    is_read: "false",
                    [Op.not]: { sender_id: id }
                },
                required: false
            },
            {
                model: messages,
                as: "last_message"
            }
        ],
        group: ["converstation.id"],
        order: [['createdAt', 'ASC']]
    });
    return results;
}


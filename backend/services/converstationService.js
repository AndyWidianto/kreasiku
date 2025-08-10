import { Op } from "sequelize";
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
        include: [
            {
                model: users,
                attributes: ["user_id", "username"],
                as: "user1",
                include: { model: profiles }
            },{
                model: users,
                attributes: ["user_id", "username"],
                as: "user2",
                include: { model: profiles }
            },
            {
                model: messages,
                order: [['createdAt', 'ASC']]
            }
        ]
    });
    return results;
}


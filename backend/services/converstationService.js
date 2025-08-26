import { Op, Sequelize } from "sequelize";
import converstation from "../models/converstations.js"
import users from "../models/users.js";
import profiles from "../models/profile.js";
import messages from "../models/Messages.js";

export const insertConverstation = async ({ id, user_id1, user_id2 }) => {
    const findConverstation = await converstation.findOne({
        where: {
            [Op.or]: [
                { user_id1: user_id1, user_id2: user_id2 },
                { user_id2: user_id1, user_id1: user_id2 }
            ]
        }
    });
    if (findConverstation) {
        return findConverstation;
    }
    const result = await converstation.create({
        id,
        user_id1,
        user_id2
    });
    return result;
}

export const findConverstations = async ({ id, protocol, host }) => {
    const results = await converstation.findAll({
        where: {
            [Op.or]: [{ user_id1: id }, { user_id2: id }]
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
            }, {
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

    if (results.length < 1) {
        return results;
    }
    const newResults = results.map(result => {
        const resultJson = result.toJSON();
        const my_id = resultJson.user_id1 === id ? resultJson.user_id1 : resultJson.user_id2;
        const user = my_id !== resultJson.user1.user_id ? resultJson.user1 : resultJson.user2;
        const me = my_id === resultJson.user1.user_id ? resultJson.user1 : resultJson.user2;
        user.profile.profile_picture = `${protocol}://${host}/${user.profile.profile_picture}`;
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
    return results;
}

export const findConverstation = async ({ id, user_id, protocol, host }) => {
    const result = await converstation.findOne({
        where: {
            id
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
            }, {
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
    });
    if (!result) {
        return result;
    }
    const resultJson = result.toJSON();
    const my_id = resultJson.user_id1 === user_id ? resultJson.user_id1 : resultJson.user_id2;
    const user = my_id !== resultJson.user1.user_id ? resultJson.user1 : resultJson.user2;
    const me = my_id === resultJson.user1.user_id ? resultJson.user1 : resultJson.user2;
    user.profile.profile_picture = `${protocol}://${host}/${user.profile.profile_picture}`;
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
}


import notifications from "../models/notification.js"
import profiles from "../models/profile.js";
import users from "../models/users.js";

export const insertNotif = async (id, receiver_id, actor_id, verb, object_id, message, is_read, data) => {
    return await notifications.create({
        id,
        receiver_id,
        actor_id,
        verb,
        object_id,
        message,
        is_read,
        data
    });
};
export const updateNotif = async (is_read, id) => {
    return await notifications.update({
        is_read
    }, {
        where: {
            id
        }
    })
}
export const findNotifs = async (protocol, host, id) => {
    const results =  await notifications.findAll({
        where: {
            actor_id: id
        },
        include: {
            model: users,
            as: "receiver",
            attributes: ["user_id", "username"],
            include: {
                model: profiles,
                as: "profile"
            }
        },
        order: [['is_read', 'DESC']]
    });
    const notifs = results.map(result => {
        result.receiver.profile.dataValues.profile_url = `${protocol}://${host}/${result.receiver.profile.profile_picture}`;
        return result;
    })
    return notifs;
}
export const findNotifReadFalse = async (id) => {
    return await notifications.findAll({
        where: {
            actor_id: id,
            is_read: "false"
        }
    })
}
export const findNotif = async (id, id2, verb) => {
    const notif = await notifications.findOne({
        where: {
            receiver_id: id,
            object_id: id2
        }
    });
    return notif;
}
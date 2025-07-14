import notifications from "../models/notification.js"
import profiles from "../models/profile.js";
import users from "../models/users.js";

export const insertNotif = async (receiver_id, actor_id, verb, object_id, message, is_read) => {
    return await notifications.create({
        receiver_id,
        actor_id,
        verb,
        object_id,
        message,
        is_read
    });
};
export const updateNotif = async (is_read, id) => {
    return await notifications.update({
        is_read
    }, {
        where: {
            notif_id: id
        }
    })
}
export const findNotifs = async (id) => {
    return await notifications.findAll({
        where: {
            actor_id: id
        },
        include: {
            model: users,
            as: "receiver",
            attributes: ["user_id", "username"],
            include: {
                model: profiles
            }
        }
    });
}
export const findNotifReadFalse = async (id) => {
    return await notifications.findAll({
        where: {
            actor_id: id,
            is_read: "false"
        }
    })
}
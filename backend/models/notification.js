import { DataTypes } from "sequelize";
import db from "../config/db.js";
import users from "./users.js";

const notifications = db.define("notifications", {
    notif_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    actor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    verb: {
        type: DataTypes.ENUM("like", "comment", "follow", "mention", "tag"),
        allowNull: false,
    },
    object_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.ENUM('true', 'false')
    }
},  {
    tableName: "notifications",
    timestamps: true
});

users.hasMany(notifications, { foreignKey: "receiver_id" });
users.hasMany(notifications, { foreignKey: "actor_id" });

notifications.belongsTo(users, { as: "receiver", foreignKey: "receiver_id" });
notifications.belongsTo(users, { as: "actor", foreignKey: "actor_id" });
export default notifications;
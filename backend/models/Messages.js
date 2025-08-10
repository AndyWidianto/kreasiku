import { DataTypes } from "sequelize";
import db from "../config/db.js";
import users from "./users.js";
import converstation from "./converstations.js";

const messages = db.define('messages', {
    message_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    converstation_id: {
        type: DataTypes.INTEGER,
        references: {
            model: converstation,
            key: "id"
        }
    },
    sender_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "messages",
    timestamps: true
});

converstation.hasMany(messages, { foreignKey: "converstation_id" });

users.hasMany(messages, { foreignKey: "receiver_id", as: "receiver" });
users.hasMany(messages, { foreignKey: "sender_id", as: "sender" });

messages.belongsTo(users, { foreignKey: "receiver_id", as: "receiver" });
messages.belongsTo(users, { foreignKey: "sender_id", as: "sender" });

export default messages;
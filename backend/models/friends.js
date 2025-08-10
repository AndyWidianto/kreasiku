import { DataTypes } from "sequelize";
import db from "../config/db.js";
import users from "./users.js";

export const friends = db.define("friends", {
    friend_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id1: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    user_id2: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    status: {
        type: DataTypes.ENUM("menunggu", "ditolak", "berteman"),
        allowNull: false
    }
}, {
    tableName: "friends",
    timestamps: true
});


users.hasMany(friends, { foreignKey: "user_id1", as: "user_id1" });
users.hasMany(friends, { foreignKey: "user_id2", as: "user_id2" });

friends.belongsTo(users, { foreignKey: "user_id", as: "user_id1" });
friends.belongsTo(users, { foreignKey: "user_id", as: "user_id2" });
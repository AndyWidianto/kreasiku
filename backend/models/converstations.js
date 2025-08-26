import { DataTypes } from "sequelize";
import db from "../config/db.js";
import users from "./users.js";

const converstation = db.define("converstation", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
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
}, {
    tableName: "converstations",
    timestamps: true
});


users.hasMany(converstation, { foreignKey: "user_id1", onDelete: "CASCADE", as: "user1" });
users.hasMany(converstation, { foreignKey: "user_id2", onDelete: "CASCADE", as: "user2" });
converstation.belongsTo(users, { foreignKey: "user_id1", onDelete: "CASCADE", as: "user1" });
converstation.belongsTo(users, { foreignKey: "user_id2", onDelete: "CASCADE", as: "user2" });

export default converstation;
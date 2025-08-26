import db from "../config/db.js";
import { DataTypes } from "sequelize";
import users from "./users.js";
import profiles from "./profile.js";

const postings = db.define("postings", {
    posting_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    content: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "postings",
    timestamps: true
});

users.hasMany(postings, { foreignKey: "user_id", onDelete: "CASCADE" });
postings.belongsTo(users, { foreignKey: "user_id", onDelete: "CASCADE" });

export default postings;
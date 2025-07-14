import { DataTypes } from "sequelize";
import db from "../config/db.js";
import postings from "./posting.js";
import users from "./users.js";

const comments = db.define("comments", {
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    posting_id: {
        type: DataTypes.INTEGER,
        references: {
            model: postings,
            key: "posting_id"
        }
    },
    user_id: {
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
    tableName: "comments",
    timestamps: true
});

users.hasMany(comments, { foreignKey: "user_id" });
postings.hasMany(comments, { foreignKey: "posting_id" });

comments.belongsTo(users, { foreignKey: "user_id" });

export default comments;
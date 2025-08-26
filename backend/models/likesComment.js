import { DataTypes } from "sequelize";
import db from "../config/db.js";
import users from "./users.js";
import comments from "./commentsPosting.js";

const likesComment = db.define("likes", {
    like_id: {
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
    comment_id: {
        type: DataTypes.STRING,
        references: {
            model: comments,
            key: "comment_id"
        }
    }
}, {
    tableName: "likes_comment",
    timestamps: true
});

users.hasMany(likesComment, { foreignKey: "user_id", onDelete: "CASCADE" });
comments.hasMany(likesComment, { foreignKey: "posting_id", onDelete: "CASCADE" });

export default likesComment;
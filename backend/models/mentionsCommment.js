import { DataTypes } from "sequelize";
import db from "../config/db.js";
import comments from "./commentsPosting.js";
import users from "./users.js";

const mention = db.define('mentions', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    comment_id: {
        type: DataTypes.STRING,
        references: {
            model: comments,
            key: "comment_id"
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
    tableName: "mentions_comment",
    timestamps: true
});

comments.hasMany(mention, { foreignKey: "comment_id", onDelete: "CASCADE" });
mention.belongsTo(comments, { foreignKey: "comment_id", onDelete: "CASCADE" });

users.hasMany(mention, { foreignKey: "user_id", onDelete: "CASCADE", as: "users" });
mention.belongsTo(users, { foreignKey: "user_id", onDelete: "CASCADE", as: "user"});

export default mention;
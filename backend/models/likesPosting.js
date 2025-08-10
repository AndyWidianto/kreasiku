import { DataTypes } from "sequelize";
import db from "../config/db.js";
import postings from "./posting.js";
import users from "./users.js";

const likesPosting = db.define("likes", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users
        }
    },
    posting_id: {
        type: DataTypes.INTEGER,
        references: {
            model: postings,
            key: "posting_id"
        }
    }
}, {
    tableName: "likes_posting",
    timestamps: true
});

likesPosting.belongsTo(users, { foreignKey: "user_id" });
likesPosting.belongsTo(postings, { foreignKey: "posting_id" });
users.hasMany(likesPosting, { foreignKey: "user_id" });
postings.hasMany(likesPosting, { foreignKey: "posting_id" });

export default likesPosting;

import { DataTypes } from "sequelize";
import db from "../config/db.js";
import users from "./users.js";

const follows = db.define("follows", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    follower_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    },
    following_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id"
        }
    }
}, {
    modelName: "follows",
    timestamps: true
});

users.hasMany(follows, { foreignKey: "follower_id", onDelete: "CASCADE", as: "followings" });
users.hasMany(follows, { foreignKey: "following_id", onDelete: "CASCADE", as: "followers" });
users.hasOne(follows, { foreignKey: "following_id", onDelete: "CASCADE", as: "follower" });
users.hasOne(follows, { foreignKey: "follower_id", onDelete: "CASCADE", as: "following" });

follows.belongsTo(users, { foreignKey: "follower_id", onDelete: "CASCADE", as: "follower" });
follows.belongsTo(users, { foreignKey: "following_id", onDelete: "CASCADE", as: "following" });

export default follows;
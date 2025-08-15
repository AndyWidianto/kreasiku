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

users.hasMany(follows, { foreignKey: "follower_id", as: "followings" });
users.hasMany(follows, { foreignKey: "following_id", as: "followers" });

follows.belongsTo(users, { foreignKey: "follower_id", as: "follower" });
follows.belongsTo(users, { foreignKey: "following_id", as: "following" });

export default follows;
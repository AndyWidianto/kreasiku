import { DataTypes } from "sequelize";
import db from "../config/db.js";
import users from "./users.js";

const profiles = db.define('profiles', {
    profile_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: 'user_id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM("man", "women", "private")
    },
    date_of_birth: {
        type: DataTypes.DATE
    },
    profile_picture: {
        type: DataTypes.STRING
    },
    cover_picture: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'profiles',
    timestamps: true
});

users.hasOne(profiles, { foreignKey: "user_id", as: "profile" });
profiles.belongsTo(users, { foreignKey: "user_id", as: "user" });

export default profiles;
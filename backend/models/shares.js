import db from "../config/db.js";
import { DataTypes } from "sequelize";
import users from "./users.js";
import postings from "./posting.js";

const shares = db.define('shares', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "user_id" 
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
    tableName: "shares",
    timestamps: true
});


postings.hasMany(shares, { foreignKey: 'posting_id', as: 'shares' });
users.hasMany(shares, { foreignKey: 'user_id', as: 'shares' });

shares.belongsTo(postings, { foreignKey: 'posting_id', as: 'posting' });
shares.belongsTo(users, { foreignKey: 'user_id', as: 'user' });


export default shares;
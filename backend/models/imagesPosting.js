import { DataTypes } from "sequelize";
import db from "../config/db.js";
import postings from "./posting.js";

const images = db.define("images", {
    image_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true    
    },
    posting_id: {
        type: DataTypes.INTEGER,
        references: {
            model: postings
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "images_posting",
    timestamps: true
});

postings.hasMany(images, { foreignKey: "posting_id" });

export default images;
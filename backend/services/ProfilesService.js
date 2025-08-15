import profiles from "../models/profile.js"
import users from "../models/users.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);


export const insertProfile = async (data) => {
    return await profiles.create(data);
}

export const updateCover = async (id, image) => {
    const findProfile = await profiles.findByPk(id);
    const filePath = path.join(__dirname, '../public/images', findProfile.cover_picture);
    if (findProfile) {
        throw new Error("Profile tidak tersedia");
    }
    if (findProfile.cover_picture) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("Terjadi kesalahan", err);
                return;
            }
            console.log("Berhasil menghapus cover picture");
        });
    }
    await findProfile.update({
        cover_picture: image
    });
}
export const findProfile = async (id) => {
    const profile = await profiles.findByPk(id);
    return profile;
}
export const updateProfileService = async ({ user_id, username, name, description, address, gender, date_of_birth, profile_picture }) => {
    const user = await users.update({
        username
    }, {
        where: {
            user_id
        }
    });
    //1755274560877-2148304842.jpg
    const findProfile = await profiles.findOne({ where: { user_id } });
    if (!findProfile) {
        throw new Error("profile tidak ditemukan");
    }
    const filePath = path.join(__dirname, '../public/images', findProfile.profile_picture);
    if (findProfile.cover_picture) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("Terjadi kesalahan", err);
                return;
            }
            console.log("Berhasil menghapus cover picture");
        });
    }
    await findProfile.update({
        name,
        description,
        address,
        gender,
        date_of_birth,
        profile_picture
    });
    return findProfile;
}
import profiles from "../models/profile.js"
import users from "../models/users.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);


export const insertProfile = async ({ user_id, name, description, gender, date_of_birth, address }) => {
    const user = await users.findByPk(user_id, { include: { model: profiles, as: "profile" }});
    const userJson = user.toJSON();
    if (userJson.profile) {
        return userJson;
    }
    const result = await profiles.create({ user_id, name, description, gender, date_of_birth, address });
    return result;
}

export const updateCover = async (id, image) => {
    const findProfile = await profiles.findByPk(id);
    if (!findProfile) {
        const filePath = path.join(__dirname, '../public/images', image);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("Terjadi kesalahan", err);
                return;
            }
            console.log("Berhasil menghapus cover picture");
        });
        throw new Error("Profile tidak tersedia");
    }
    if (findProfile.cover_picture) {
        const filePath = path.join(__dirname, '../public/images', findProfile.cover_picture);
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
export const updateProfileService = async ({ user_id, username, name, description, address, gender, date_of_birth }) => {
    const findUser = await users.findByPk(user_id);
    if (!findUser) {
        throw new Error("User tidak tersedia");
    }
    const findProfile = await profiles.findOne({ where: { user_id } });
    if (!findProfile) {
        throw new Error("profile tidak ditemukan");
    }
    await findUser.update({ username });
    await findProfile.update({
        name,
        description,
        address,
        gender,
        date_of_birth,
    });
    return findProfile;
}

export const updateProfilePictureService = async (user_id, profile_picture) => {
    const findProfile = await profiles.findOne({ where: { user_id } });
    if (!findProfile) {
        throw new Error("profile tidak ditemukan");
    }
    if (findProfile.profile_picture) {
        const filePath = path.join(__dirname, '../public/images', findProfile.profile_picture);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("Terjadi kesalahan", err);
                return;
            }
            console.log("Berhasil menghapus cover picture");
        });
    };
    await findProfile.update({ profile_picture });
}
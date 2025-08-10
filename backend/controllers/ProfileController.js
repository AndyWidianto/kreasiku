import fs from "fs";
import path from "path";
import { findProfile, insertProfile, updateCover } from "../services/ProfilesService.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export const CreateProfile = async (req, res) => {
    const { name, description, address, gender, date_of_birth } = req.body;
    const { user_id } = req.user;
    const profile = req.file;
    try {
        await insertProfile({ user_id, name, profile_picture : profile.filename, description, gender, date_of_birth, address });
        res.status(200).json({
            message: "Berhasil menambahkan profile",
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const updateImageCover = async (req, res) => {
    const cover = req.file;
    const { id } = req.params;
    console.log(cover);
    try {
        const profile = await findProfile(id);
        await updateCover(id, cover.filename);
        const filePath = path.join(__dirname, '../public/images', profile.cover_picture);
        if (profile.cover_picture) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Terjadi kesalahan", err);
                    return;
                }
                console.log("Berhasil menghapus cover picture");
            });
            res.json({
                message: "berhasil update cover"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}
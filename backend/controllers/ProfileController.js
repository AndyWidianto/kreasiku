import { findProfile, insertProfile, updateCover, updateProfilePictureService, updateProfileService } from "../services/ProfilesService.js";

export const CreateProfile = async (req, res) => {
    const { name, description, address, gender, date_of_birth } = req.body;
    const { user_id } = req.user;
    try {
        const result = await insertProfile({ user_id, name, description, gender, date_of_birth, address });
        res.status(200).json({
            message: "Berhasil menambahkan profile",
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const updateImageCover = async (req, res) => {
    const cover = req.file;
    const { id } = req.params;
    try {
        await updateCover(id, cover.filename);
        res.json({
            message: "berhasil update cover"
        });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

export const updateProfile = async (req, res) => {
    const { username, name, description, address, gender, date_of_birth } = req.body;
    const { user_id } = req.user;
    try {
        const update = await updateProfileService({ user_id, username, name, description, address, gender, date_of_birth });
        res.json({
            data: update
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

export const updateProfilePicture = async (req, res) => {
    const { user_id } = req.user;
    const profile = req.file;
    try {
        const update = await updateProfilePictureService(user_id, profile.filename);
        res.json({
            data: update
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
import { insertProfile } from "../services/ProfilesService.js"

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
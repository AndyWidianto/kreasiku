import profiles from "../models/profile.js"

export const insertProfile = async (data) => {
    return await profiles.create(data);
}

export const updateCover = async (id, image) => {
    const profile = await profiles.update({ cover_picture: image }, {
        where: { profile_id: id }
    });
    return profile;
}
export const findProfile = async (id) => {
    const profile = await profiles.findByPk(id);
    return profile;
}
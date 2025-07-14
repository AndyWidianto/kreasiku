import profiles from "../models/profile.js"

export const insertProfile = async (data) => {
    return await profiles.create(data);
}
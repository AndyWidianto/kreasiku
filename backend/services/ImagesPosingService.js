import images from "../models/imagesPosting.js"

export const insertImagePosting = async (data) => {
    return await images.create(data);
}
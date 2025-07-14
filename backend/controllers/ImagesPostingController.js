import { insertImagePosting } from "../services/ImagesPosingService.js";

export const createImagesPosting = async (req, res) => {
    const { posting_id } = req.body;
    const images = req.files;
    try {
        console.log(images);
        for (const image of images) {
            await insertImagePosting({ posting_id, image: image.filename })
        }
        res.status(200).json({
            message: "Berhasil menambahkan images"
        })
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
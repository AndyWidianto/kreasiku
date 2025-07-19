import Express from 'express';
import multer from 'multer';
import { getUser, getUsers, Login, Logout, Register, updateAccessToken } from '../controllers/UsersController.js';
import { createPosting, getPosting, getPostings } from '../controllers/PostingsController.js';
import { verifyToken } from '../middleware/middleware.js';
import { createLikesPosting, deleteLikePosting, getLikesPosting } from '../controllers/LikesPostingController.js';
import { createComment, getCommentsFromId } from '../controllers/commentsPostingController.js';
import { createLikesComment } from '../controllers/LikesCommentController.js';
import { createImagesPosting } from '../controllers/ImagesPostingController.js';
import { createNotif, getNotifNotRead, getNotifs, updateNotifId } from '../controllers/NotificationsController.js';
import { CreateProfile } from '../controllers/ProfileController.js';

const storage = multer.diskStorage({
    destination: "public/images/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.toLowerCase()}`)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Hanya gambar yang dizinkan"));
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})
const routes = Express.Router();
routes.use(Express.static("public/images/"));

routes.post('/login', Login);
routes.post('/register', Register);
routes.delete('/logout', Logout);
routes.get('/users', getUsers);
routes.get('/user', verifyToken, getUser);
routes.get('/refreshToken', updateAccessToken);

routes.post('/profile', verifyToken, upload.single("profile"), CreateProfile);

routes.get('/postings', getPostings);
routes.get('/posting/:id', getPosting);
routes.post('/posting', verifyToken, createPosting);
routes.post('/images/posting', upload.array('images'), createImagesPosting);

routes.post('/notification', verifyToken, createNotif);
routes.put('/notification', verifyToken, updateNotifId);
routes.get('/notifications', verifyToken, getNotifs);
routes.get('/notifications/read_false', verifyToken, getNotifNotRead);

routes.get('/likes/:id', verifyToken, getLikesPosting);
routes.post('/like', verifyToken, createLikesPosting);
routes.delete('/likes/:id', verifyToken, deleteLikePosting);

routes.get('/comments/:id', getCommentsFromId);
routes.post('/comment', verifyToken, createComment);

routes.post('/like/comment', createLikesComment);

routes.post('/percobaan', (req, res) => {
    res.clearCookie()
});

export default routes;
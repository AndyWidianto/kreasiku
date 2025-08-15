import Express from 'express';
import multer from 'multer';
import { getUser, getUserFromUsername, getUsers, Login, Logout, Register, updateAccessToken } from '../controllers/UsersController.js';
import { createPosting, getPosting, getPostings, getPostingsUser } from '../controllers/PostingsController.js';
import { verifyToken, verifyTokenIfAny } from '../middleware/middleware.js';
import { createLikesPosting, deleteLikePosting, getLikesPosting } from '../controllers/LikesPostingController.js';
import { createComment, getComment, getComments } from '../controllers/commentsPostingController.js';
import { createLikesComment } from '../controllers/LikesCommentController.js';
import { createImagesPosting } from '../controllers/ImagesPostingController.js';
import { createNotif, getNotifNotRead, getNotifs, updateNotifId } from '../controllers/NotificationsController.js';
import { CreateProfile, updateImageCover, updateProfile } from '../controllers/ProfileController.js';
import { createMessage, deleteMessage, getMessages } from '../controllers/MessagesController.js';
import { createConverstation, getConverstations } from '../controllers/ConverstationController.js';
import { createMention, getMention, getMentions } from '../controllers/mentionsController.js';
import { createFollow, getFollowers, getFollowings, getNotFollowings, unFollow } from '../controllers/followsController.js';

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
routes.get('/user/:username', getUserFromUsername);
routes.get('/refreshToken', updateAccessToken);

routes.post('/profile', verifyToken, upload.single("profile"), CreateProfile);
routes.post('/update/cover/:id', verifyToken, upload.single("cover"), updateImageCover);
routes.put('/profile', verifyToken, upload.single("profile_picture"), updateProfile);

routes.get('/postings', verifyTokenIfAny, getPostings);
routes.get('/posting/:id', verifyTokenIfAny, getPosting);
routes.get('/postings/user/:id', getPostingsUser);
routes.post('/posting', verifyToken, createPosting);
routes.post('/images/posting', upload.array('images'), createImagesPosting);

routes.post('/notification', verifyToken, createNotif);
routes.put('/notification', verifyToken, updateNotifId);
routes.get('/notifications', verifyToken, getNotifs);
routes.get('/notifications/read_false', verifyToken, getNotifNotRead);

routes.get('/likes/:id', verifyToken, getLikesPosting);
routes.post('/like', verifyToken, createLikesPosting);
routes.delete('/likes/:id', verifyToken, deleteLikePosting);

routes.get('/comments/:id', getComments);
routes.get('/comment', getComment);
routes.post('/comment', verifyToken, createComment);

routes.post('/like/comment', createLikesComment);

routes.get('/messages/:id', getMessages);
routes.delete('/messages/:id', deleteMessage);
routes.post('/message', verifyToken, createMessage);

routes.post('/converstation', verifyToken, createConverstation);
routes.get('/converstations', verifyToken, getConverstations);

routes.post('/mention', verifyToken, createMention);
routes.get('/mentions/:id', getMentions);
routes.get('/mention/:id', getMention);

routes.post('/follow', verifyToken, createFollow);
routes.get('/:username/followers', verifyToken, getFollowers);
routes.get('/:username/followings', verifyToken, getFollowings);
routes.get('/not/followings', verifyToken, getNotFollowings);
routes.delete('/follow/:id', verifyToken, unFollow);

export default routes;
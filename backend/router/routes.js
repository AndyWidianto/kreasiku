import Express from 'express';
import multer from 'multer';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { getUser, getUserFromUsername, getUsers, Login, Logout, Register, updateAccessToken } from '../controllers/UsersController.js';
import { createPosting, getPosting, getPostings, getPostingsUser } from '../controllers/PostingsController.js';
import { verifyToken, verifyTokenIfAny } from '../middleware/middleware.js';
import { createLikesPosting, deleteLikePosting, getLikesPosting } from '../controllers/LikesPostingController.js';
import { createComment, getComment, getComments } from '../controllers/commentsPostingController.js';
import { createLikesComment } from '../controllers/LikesCommentController.js';
import { createImagesPosting } from '../controllers/ImagesPostingController.js';
import { createNotif, getNotifNotRead, getNotifs, updateNotifId } from '../controllers/NotificationsController.js';
import { CreateProfile, updateImageCover, updateProfile, updateProfilePicture } from '../controllers/ProfileController.js';
import { createMessage, deleteMessage, getMessages, getSecret, updateMessageUnread } from '../controllers/MessagesController.js';
import { createConverstation, getConverstations } from '../controllers/ConverstationController.js';
import { createMention, getMention, getMentions } from '../controllers/mentionsController.js';
import { createFollow, getFollowers, getFollowings, getNotFollowings, unFollow } from '../controllers/followsController.js';
import { AuthGoogle } from '../controllers/AuthGoogleController.js';

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
routes.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
routes.use(passport.initialize());
routes.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

routes.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));
routes.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), AuthGoogle);

routes.post('/login', Login);
routes.post('/register', Register);
routes.delete('/logout', Logout);
routes.get('/users', verifyTokenIfAny, getUsers);
routes.get('/user', verifyToken, getUser);
routes.get('/user/:username', verifyTokenIfAny, getUserFromUsername);
routes.get('/refreshToken', updateAccessToken);

routes.post('/profile', verifyToken, CreateProfile);
routes.post('/update/cover/:id', verifyToken, upload.single("cover"), updateImageCover);
routes.put('/profile/picture', verifyToken, upload.single("profile_picture"), updateProfilePicture);
routes.put('/profile', verifyToken, updateProfile);

routes.get('/postings', verifyTokenIfAny, getPostings);
routes.get('/posting/:id', verifyTokenIfAny, getPosting);
routes.get('/postings/user/:id', verifyTokenIfAny, getPostingsUser);
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

routes.get('/secret/messages', verifyToken, getSecret);
routes.get('/messages/:id', verifyToken, getMessages);
routes.delete('/messages/:id', verifyToken, deleteMessage);
routes.post('/message', verifyToken, createMessage);
routes.post('/message/unread', verifyToken, updateMessageUnread);


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
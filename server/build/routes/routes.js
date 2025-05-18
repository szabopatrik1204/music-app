"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const main_class_1 = require("../main-class");
const User_1 = require("../model/User");
const Track_1 = __importDefault(require("../model/Track"));
const Album_1 = __importDefault(require("../model/Album"));
const Review_1 = __importDefault(require("../model/Review"));
const Profile_1 = __importDefault(require("../model/Profile"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const configureRoutes = (passport, router, upload) => {
    router.get('/', (req, res) => {
        let myClass = new main_class_1.MainClass();
        res.status(200).send('Hello, World!');
    });
    router.post('/upload-album', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const userId = req.user._id;
            const { name, description, releaseDate } = req.body;
            const album = new Album_1.default({
                name,
                description,
                releaseDate,
                owner: userId
            });
            yield album.save();
            yield User_1.User.findByIdAndUpdate(userId, { $push: { albumIds: album._id } });
            res.status(200).json(album);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.post('/approve-track', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const { trackId } = req.body;
            if (!trackId) {
                return res.status(400).json({ error: 'trackId is required' });
            }
            const track = yield Track_1.default.findByIdAndUpdate(trackId, { isApproved: true }, { new: true });
            if (!track) {
                return res.status(404).json({ error: 'Track not found' });
            }
            res.status(200).json(track);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.post('/delete-track', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const { trackId } = req.body;
            if (!trackId) {
                return res.status(400).json({ error: 'trackId is required' });
            }
            yield Track_1.default.findByIdAndDelete(trackId);
            yield Review_1.default.deleteMany({ owner: trackId });
            res.status(200).json({ message: 'Track deleted' });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.post('/add-review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const { trackId, commentText } = req.body;
            const nickname = req.user.nickname;
            if (!trackId || !commentText) {
                return res.status(400).json({ error: 'trackId and commentText are required' });
            }
            let review = yield Review_1.default.findOne({ owner: trackId });
            let isNewReview = false;
            if (!review) {
                review = new Review_1.default({ owner: trackId, like: [], comment: [], shared: [] });
                isNewReview = true;
            }
            review.comment.push({
                nickname,
                text: commentText,
                createdAt: new Date()
            });
            yield review.save();
            if (isNewReview) {
                yield Track_1.default.findByIdAndUpdate(trackId, { reviewId: review._id });
            }
            res.status(200).json(review);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.post('/add-like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const { trackId } = req.body;
            const nickname = req.user.nickname;
            if (!trackId) {
                return res.status(400).json({ error: 'trackId is required' });
            }
            let review = yield Review_1.default.findOne({ owner: trackId });
            if (!review) {
                review = new Review_1.default({ owner: trackId, like: [], comment: [], shared: [] });
            }
            if (!review.like.includes(nickname)) {
                review.like.push(nickname);
                yield review.save();
            }
            res.status(200).json(review);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.get('/me', (req, res) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { nickname, role } = req.user;
        res.status(200).json({ nickname, role });
    });
    router.get('/unapproved-tracks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tracks = yield Track_1.default.find({ isApproved: false }).populate('owner', 'name');
            res.status(200).json(tracks);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.get('/get-my-albums', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const userId = req.user._id;
            const albums = yield Album_1.default.find({ owner: userId });
            res.status(200).json(albums);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.get('/get-all-tracks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            // Csak azokat a trackeket kérjük le, amelyek jóvá vannak hagyva
            const tracks = yield Track_1.default.find({ isApproved: true }).populate('owner', 'name');
            const trackIds = tracks.map(track => track._id);
            const reviews = yield Review_1.default.find({ owner: { $in: trackIds } });
            const tracksWithReviews = tracks.map(track => {
                const review = reviews.find(r => r.owner.toString() === track._id.toString());
                return Object.assign(Object.assign({}, track.toObject()), { review: review ? review.toObject() : { like: [], shared: [], comment: [] } });
            });
            res.status(200).json(tracksWithReviews);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const userId = req.user._id;
            const user = yield User_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!user.profileId) {
                res.status(200).json({});
            }
            else {
                const profile = yield Profile_1.default.findById(user.profileId);
                res.status(200).json(profile || {});
            }
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.get('/statistics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const userId = req.user._id;
            const albums = yield Album_1.default.find();
            const result = [];
            for (const album of albums) {
                const tracks = yield Track_1.default.find({ _id: { $in: album.trackIds } });
                const trackReviews = [];
                for (const track of tracks) {
                    const review = yield Review_1.default.findOne({ owner: track._id });
                    if (review) {
                        trackReviews.push({
                            track,
                            review
                        });
                    }
                }
                if (trackReviews.length > 0) {
                    result.push({
                        album,
                        trackReviews
                    });
                }
            }
            res.status(200).json(result);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.post('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const userId = req.user._id;
            const user = yield User_1.User.findById(userId);
            let profile;
            if (user.profileId) {
                profile = yield Profile_1.default.findByIdAndUpdate(user.profileId, req.body, { new: true, runValidators: true });
            }
            else {
                profile = new Profile_1.default(req.body);
                yield profile.save();
                yield User_1.User.findByIdAndUpdate(userId, { profileId: profile._id });
            }
            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }
            res.status(200).json(profile);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.get('/track-file/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fileId = new mongoose_1.default.Types.ObjectId(req.params.id);
            const db = mongoose_1.default.connection.db;
            const bucket = new mongodb_1.GridFSBucket(db, { bucketName: 'music' });
            const downloadStream = bucket.openDownloadStream(fileId);
            res.set('Content-Type', 'audio/mpeg');
            downloadStream.pipe(res);
            downloadStream.on('error', () => {
                res.status(404).json({ error: 'File not found' });
            });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.post('/upload-music', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, albumId, releaseDate } = req.body;
            const artistNickname = req.user && req.user.nickname;
            if (!artistNickname) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const fileId = req.file && req.file.id;
            if (!fileId) {
                return res.status(400).json({ error: 'File upload failed' });
            }
            const track = new Track_1.default({
                title,
                artistNickname,
                owner: albumId,
                fileId,
                releaseDate,
                isApproved: false
            });
            yield track.save();
            if (albumId) {
                yield Album_1.default.findByIdAndUpdate(albumId, { $push: { trackIds: track._id } });
            }
            res.status(200).json({ file: req.file, track });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('User not found.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    router.post('/register', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User_1.User({ email: email, password: password, name: name, address: address, nickname: nickname, role: req.body.role });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    router.delete('/deleteUser', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User_1.User.deleteOne({ _id: id });
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    return router;
};
exports.configureRoutes = configureRoutes;

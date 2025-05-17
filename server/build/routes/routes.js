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
            // Hozzáadás a user albums tömbjéhez
            yield User_1.User.findByIdAndUpdate(userId, { $push: { albumIds: album._id } });
            res.status(200).json(album);
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }));
    router.get('/get-all-tracks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tracks = yield Track_1.default.find();
            res.status(200).json(tracks);
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
            const { title, albumName, releaseDate } = req.body;
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
                albumName,
                fileId,
                releaseDate,
                isApproved: false
            });
            yield track.save();
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

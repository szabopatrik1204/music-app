import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import Track from '../model/Track';
import Album from '../model/Album';
import Review from '../model/Review';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

export const configureRoutes = (passport: PassportStatic, router: Router, upload: multer.Multer): Router => {

    router.get('/', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send('Hello, World!');
    });

    router.post('/upload-album', async (req: Request, res: Response) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const userId = (req.user as any)._id;
            const { name, description, releaseDate } = req.body;
            const album = new Album({
                name,
                description,
                releaseDate,
                owner: userId
            });
            await album.save();

            // Hozzáadás a user albums tömbjéhez
            await User.findByIdAndUpdate(
                userId,
                { $push: { albumIds: album._id } }
            );

            res.status(200).json(album);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });

    router.post('/add-review', async (req: Request, res: Response) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const { trackId, commentText } = req.body;
            const nickname = (req.user as any).nickname;

            if (!trackId || !commentText) {
                return res.status(400).json({ error: 'trackId and commentText are required' });
            }

            let review = await Review.findOne({ owner: trackId });
            if (!review) {
                review = new Review({ owner: trackId, like: [], comment: [], shared: [] });
            }

            review.comment.push({
                nickname,
                text: commentText,
                createdAt: new Date()
            });

            await review.save();

            res.status(200).json(review);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });

    router.post('/add-like', async (req: Request, res: Response) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const { trackId } = req.body;
            const nickname = (req.user as any).nickname;
            if (!trackId) {
                return res.status(400).json({ error: 'trackId is required' });
            }
            let review = await Review.findOne({ owner: trackId });
            if (!review) {
                review = new Review({ owner: trackId, like: [], comment: [], shared: [] });
            }
            if (!review.like.includes(nickname)) {
                review.like.push(nickname);
                await review.save();
            }
            res.status(200).json(review);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });
    
    router.get('/me', (req: Request, res: Response) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const nickname = (req.user as any).nickname;
        res.status(200).json({ nickname });
    });

    router.get('/get-my-albums', async (req: Request, res: Response) => {
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const userId = (req.user as any)._id;
            const albums = await Album.find({ owner: userId });
            res.status(200).json(albums);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });

    router.get('/get-all-tracks', async (req: Request, res: Response) => {
        try {
        const tracks = await Track.find().populate('owner', 'name');

        const trackIds = tracks.map(track => track._id);
        const reviews = await Review.find({ owner: { $in: trackIds } });

        const tracksWithReviews = tracks.map(track => {
            const review = reviews.find(r => r.owner.toString() === track._id.toString());
            return {
                ...track.toObject(),
                review: review ? review.toObject() : { like: [], shared: [], comment: [] }
            };
        });
            res.status(200).json(tracksWithReviews);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });

    router.get('/track-file/:id', async (req: Request, res: Response) => {
        try {
            const fileId = new mongoose.Types.ObjectId(req.params.id);
            const db = mongoose.connection.db;
            const bucket = new GridFSBucket(db, { bucketName: 'music' });

            const downloadStream = bucket.openDownloadStream(fileId);

            res.set('Content-Type', 'audio/mpeg');
            downloadStream.pipe(res);

            downloadStream.on('error', () => {
                res.status(404).json({ error: 'File not found' });
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });

    router.post('/upload-music', upload.single('file'), async (req, res) => {
        try {
            const { title, albumId, releaseDate } = req.body;

            const artistNickname = req.user && (req.user as any).nickname;

            if (!artistNickname) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const fileId = req.file && (req.file as any).id;

            if (!fileId) {
                return res.status(400).json({ error: 'File upload failed' });
            }

            const track = new Track({
                title,
                artistNickname,
                owner: albumId,
                fileId,
                releaseDate,
                isApproved: false
            });

            await track.save();

            if (albumId) {
                await Album.findByIdAndUpdate(
                    albumId,
                    { $push: { trackIds: track._id } }
                );
            }

            res.status(200).json({ file: req.file, track });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User({email: email, password: password, name: name, address: address, nickname: nickname, role: req.body.role});
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);            
        } else {
            res.status(500).send(false);
        }
    });

    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    return router;
}
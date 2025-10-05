import { MainClass } from './main-class';
import express from 'express';
import { Request, Response } from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession  from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const app = express();
const port = 5000;
const dbUrl = 'mongodb://localhost:6000/my_db';

const whitelist = ['*', 'http://localhost:4200']
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// cookieParser
app.use(cookieParser());

// session
const sessionOptions: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configurePassport(passport);

// TODO if environment variable is set
mongoose.connect(process.env.MONGO_URL || "")
  .then(() => {
    const storage = new GridFsStorage({
        url: process.env.MONGO_URL || "",
        file: (req, file) => ({
            filename: file.originalname,
            bucketName: 'music'
        })
    });
    const upload = multer({ storage });

    app.use('/app', configureRoutes(passport, express.Router(), upload));
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

console.log('After server is ready.');


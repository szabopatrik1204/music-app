import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import cors from 'cors';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { configureRoutes } from './routes/routes';
import { configurePassport } from './passport/passport';

const app = express();

const whitelist = ['*', 'http://localhost:4200'];
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
    if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS.'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions: expressSession.SessionOptions = {
  secret: 'testsecret',
  resave: false,
  saveUninitialized: false,
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

export default app;
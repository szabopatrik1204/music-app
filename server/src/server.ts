import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import app from './app';
import passport from 'passport';
import { configureRoutes } from './routes/routes';
import express from 'express';
const port = 5000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:6000/my_db';

mongoose.connect(mongoUrl)
  .then(() => {
    const storage = new GridFsStorage({
      url: mongoUrl,
      file: (req, file) => ({
        filename: file.originalname,
        bucketName: 'music',
      }),
    });
    const upload = multer({ storage });

    const router = express.Router();
    app.use('/app', configureRoutes(passport, router, upload));
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
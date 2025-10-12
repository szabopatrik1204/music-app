import request from 'supertest';
import express from 'express';
import app from '../../src/app';

import Album from '../../src/model/Album';
import { User } from '../../src/model/User';
import { configureRoutes } from '../../src/routes/routes';
import passport from 'passport';
import multer from 'multer';

app.listen = jest.fn();

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(() => Promise.resolve({
      then: jest.fn().mockResolvedValue(true)
    })),
    model: jest.fn(() => ({})),
    Types: { ObjectId: jest.fn() },
    connection: { on: jest.fn(), once: jest.fn() },
    Schema: Object.assign(
      jest.fn().mockImplementation(() => ({
        methods: {},
        statics: {},
        pre: jest.fn(),
        post: jest.fn(),
        add: jest.fn(),
        path: jest.fn(),
        virtual: jest.fn(),
        index: jest.fn(),
        set: jest.fn(),
        get: jest.fn(),
        plugin: jest.fn(),
      })),
      {
        Types: {
          ObjectId: jest.fn()
        }
      }
    ),
    SchemaTypes: {
      ObjectId: jest.fn()
    }
  };
});

const upload = multer();
app.use('/app', configureRoutes(passport, express.Router(), upload));

describe("GET /app/", () => {
    it("should return hello world", async () => {
        const res = await request(app).get('/app/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Hello, World!');
    });
});

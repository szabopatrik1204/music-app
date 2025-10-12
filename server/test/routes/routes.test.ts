import request from 'supertest';
import express from 'express';
import app from '../../src/app';
import Track from '../../src/model/Track';
import Review from '../../src/model/Review';
import { User } from '../../src/model/User';
import { configureRoutes } from '../../src/routes/routes';
import passport from 'passport';
import multer from 'multer';

app.listen = jest.fn();

const upload = multer();

app.use((req: any, _res: any, next: any) => {
  req.isAuthenticated = () => true;
  req.user = { _id: 'userId', nickname: 'TestNick' };
  next();
});

// Basic testing
app.use('/app', configureRoutes(passport, express.Router(), upload));

describe("GET /app/", () => {
  it("should return hello world", async () => {
    const res = await request(app).get('/app/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello, World!');
  });
});

// Track tests
describe("POST /app/approve-track", () => {
  beforeEach(() => {
    (Track as any).findByIdAndUpdate = jest.fn();
  });

  it("should approve a track and return the updated track", async () => {
    const trackId = '64a7f0b2c2a1f2e3d4b5c6a7';

    (Track as any).findByIdAndUpdate.mockResolvedValue({
      _id: trackId,
      title: 'Test Track',
      isApproved: true,
      owner: 'someAlbumId'
    });

    const res = await request(app)
      .post('/app/approve-track')
      .send({ trackId })
      .set('Accept', 'application/json');

    expect((Track as any).findByIdAndUpdate).toHaveBeenCalledWith(
      trackId,
      { isApproved: true },
      { new: true }
    );

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body._id).toBe(trackId);
    expect(res.body.isApproved).toBe(true);
  });

  it("should return 400 when trackId is missing", async () => {
    const res = await request(app)
      .post('/app/approve-track')
      .send({})
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('trackId is required');
  });

  it("should return 404 when track not found", async () => {
    const missingId = '000000000000000000000000';

    (Track as any).findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .post('/app/approve-track')
      .send({ trackId: missingId })
      .set('Accept', 'application/json');

    expect((Track as any).findByIdAndUpdate).toHaveBeenCalledWith(
      missingId,
      { isApproved: true },
      { new: true }
    );

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Track not found');
  });
});

// Register tests
describe("POST /app/register", () => {
  beforeEach(() => {
    (User as any).prototype.save = jest.fn().mockResolvedValue({
      _id: 'u1',
      email: 'test@user.test',
      nickname: 'TestNick',
      name: 'Test User',
      address: 'Test Address',
      role: 'artist'
    });
  });

  afterEach(() => {
    if ((User as any).prototype.save && (User as any).prototype.save.mockRestore) {
      (User as any).prototype.save.mockRestore();
    } else {
      (User as any).prototype.save = undefined;
    }
  });

  it("should register a new user and return the created user", async () => {
    const payload = {
      email: 'test@user.test',
      password: 'testpw',
      name: 'Test User',
      address: 'Test Address',
      nickname: 'TestNick',
      role: 'artist'
    };

    const res = await request(app)
      .post('/app/register')
      .send(payload)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.email).toBe(payload.email);
    expect(res.body.nickname).toBe(payload.nickname);
  });

  it("should return 500 when save fails", async () => {
    // make save reject for this case
    (User as any).prototype.save.mockRejectedValueOnce(new Error('save error'));

    const res = await request(app)
      .post('/app/register')
      .send({
        email: 'fail@user.test',
        password: 'pw',
        name: 'Fail',
        address: 'Nowhere',
        nickname: 'FailNick',
        role: 'user'
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(500);
  });
});

describe("POST /app/add-review", () => {
  const trackId = '64a7f0b2c2a1f2e3d4b5c6a7';
  const commentText = 'Great track!';

  beforeEach(() => {
    // reset/override mocks
    (Review as any).findOne = jest.fn();
    (Review as any).prototype.save = jest.fn();
    (Track as any).findByIdAndUpdate = jest.fn();
  });

  it("should add comment to existing review and return the review", async () => {
    const existingReview: any = {
      _id: 'r1',
      owner: trackId,
      comment: [],
      like: [],
      shared: [],
      save: jest.fn().mockResolvedValue(undefined)
    };
    (Review as any).findOne.mockResolvedValue(existingReview);
    // prototype.save already mocked but existingReview has its own save

    const res = await request(app)
      .post('/app/add-review')
      .send({ trackId, commentText })
      .set('Accept', 'application/json');

    expect((Review as any).findOne).toHaveBeenCalledWith({ owner: trackId });
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    // review.comment should have one new comment
    expect(res.body.comment).toBeDefined();
    const last = res.body.comment[res.body.comment.length - 1];
    expect(last.text).toBe(commentText);
    expect(last.nickname).toBe('TestNick');
    // Track.findByIdAndUpdate should NOT be called for existing review
    expect((Track as any).findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return 400 when missing trackId or commentText", async () => {
    const res1 = await request(app)
      .post('/app/add-review')
      .send({ commentText })
      .set('Accept', 'application/json');
    expect(res1.status).toBe(400);
    expect(res1.body.error).toBe('trackId and commentText are required');

    const res2 = await request(app)
      .post('/app/add-review')
      .send({ trackId })
      .set('Accept', 'application/json');
    expect(res2.status).toBe(400);
    expect(res2.body.error).toBe('trackId and commentText are required');
  });

  it("should return 500 when save fails", async () => {
    (Review as any).findOne.mockResolvedValue(null);
    (Review as any).prototype.save.mockRejectedValueOnce(new Error('save failed'));

    const res = await request(app)
      .post('/app/add-review')
      .send({ trackId, commentText })
      .set('Accept', 'application/json');

    expect(res.status).toBe(500);
  });
});
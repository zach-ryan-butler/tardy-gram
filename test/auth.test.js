require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a new user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'lalall',
        password: 'wkejrnwkejrn',
        profilePhotoUrl: 'hebrjwhebwjebr'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'lalall',
          passwordHash: expect.any(String),
          profilePhotoUrl: 'hebrjwhebwjebr',
          __v: 0
        })
      })
  });

  it('can sign in an existing user and provide token', async() => {
    const user = await User.create({
      username: 'lalall',
        password: 'wkejrnwkejrn',
        profilePhotoUrl: 'hebrjwhebwjebr'
    });

    return request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: 'lalall',
        password: 'wkejrnwkejrn',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'lalall',
          passwordHash: expect.any(String),
          profilePhotoUrl: 'hebrjwhebwjebr',
          __v: 0
        })
      })
  });
});
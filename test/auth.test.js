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
          profilePhotoUrl: 'hebrjwhebwjebr'
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
          profilePhotoUrl: 'hebrjwhebwjebr'
        })
      })
  });
  
  it('can verify a user with a token', async() => {
    const user = await User.create({
      username: 'lalall',
        password: 'wkejrnwkejrn',
        profilePhotoUrl: 'hebrjwhebwjebr'
    });
    const agent = request.agent(app);
    return agent 
      .post('/api/v1/auth/signin')
      .send({
        username: 'lalall',
        password: 'wkejrnwkejrn',
      })
      .then(res => {
        return agent
          .get('/api/v1/auth/verify')
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'lalall',
          profilePhotoUrl: 'hebrjwhebwjebr'
        })
      })
  })
});
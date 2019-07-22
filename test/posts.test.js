require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');


describe('post routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  const agent = request.agent(app);
  beforeEach(async() => {
    const user = await User.create({
      username: 'lalall',
      password: 'wkejrnwkejrn',
      profilePhotoUrl: 'hebrjwhebwjebr'
    });
    return agent 
      .post('/api/v1/auth/signin')
      .send({
        username: 'lalall',
        password: 'wkejrnwkejrn',
      })
  })

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a post', () => {
    return agent
      .post('/api/v1/posts/')
      .send({ photoUrl: 'somePhoto', caption: 'someCaption', tags: ['cool', 'dog', 'blessed'] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: expect.any(String),
          photoUrl: 'somePhoto',
          caption: 'someCaption',
          tags: ['cool', 'dog', 'blessed'],
          __v: 0
        });
      });
    });
    
  it('can get all posts', () => {
    return agent
    .post('/api/v1/posts')
    .send({ photoUrl: 'somePhoto', caption: 'someCaption', tags: ['cool', 'dog', 'blessed' ]})
    .then(res => {
      return agent
        .get('/api/v1/posts')
    })
      .then(res => {
        expect(res.body).toEqual([{
          user: expect.any(String),
          photoUrl: 'somePhoto',
          caption: 'someCaption',
          tags: ['cool', 'dog', 'blessed'],
        }])
      })
  });
});
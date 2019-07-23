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
 let user = null;
  const agent = request.agent(app);
  beforeEach(async() => {
      user = await User.create({
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
        }]);
      });
  });

  it('can get posts by id', async() => {
    const posts = await Post.create({
      user: user._id,
      photoUrl: 'Some Photo',
      caption: 'Some Caption',
      tags: ['color', 'dog', 'blessed']
    });

    return agent
      .get(`/api/v1/posts/${posts._id}`)
      .then(res => {
        expect(res.body).toEqual({
          user: {
            username: user.username,
            profilePhotoUrl: user.profilePhotoUrl,
            _id: expect.any(String)
          },
          photoUrl: posts.photoUrl,
          caption: posts.caption,
          tags: [...posts.tags],
          _id: expect.any(String)
        });
      });
  });

  it('patches a post by id', async() => {
    const posts = await Post.create({
      user: user._id,
      photoUrl: 'Some Photo',
      caption: 'Some Caption',
      tags: ['color', 'dog', 'blessed']
    });
    return agent
      .patch(`/api/v1/posts/${posts._id}`)
      .send({ caption: 'New Caption' })
      .then(res => {
        expect(res.body).toEqual({
          user: user._id.toString(),
          photoUrl: posts.photoUrl,
          caption: 'New Caption',
          tags: [...posts.tags], 
          _id: expect.any(String)
        })
      })
  })
});
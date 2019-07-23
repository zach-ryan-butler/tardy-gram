const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      caption,
      photoUrl,
      tags
    } = req.body;

    Post
      .create({ user: req.user._id, caption, photoUrl, tags })
      .then(post => res.send(post))
      .catch(next)
  })

  .get('/', (req, res, next) => {
    Post  
      .find()
      .select({ __v: false, _id: false })
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Post
      .findById(req.params.id)
      .populate('user', { username: true, profilePhotoUrl: true })
      .select({ __v: false })
      .then(post => res.send(post))
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    const {
      caption
    } = req.body;

    Post
      .findByIdAndUpdate(req.params.id, { caption }, { new: true })
      .select({ __v: false })
      .then(post => {
        if(req.user) {
          res.send(post)
        } else {
          const err = new Error('invalid user');
          err.status = 401;
          next(err);
        }
      });
  });
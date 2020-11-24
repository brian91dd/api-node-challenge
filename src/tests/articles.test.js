/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const UserModel = require('../models/user.model');

const article1 = {
  userId: '5fbcf537573c87455a55abe6',
  title: 'Article test title',
  text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit suspendisse.',
  tags: ['lorem', 'dolor', 'adipiscing'],
};

const article1Edit = {
  userId: '5fbcf537573c87455a55abe6',
  title: 'This is the article modified',
  text: 'This is the text modified',
  tags: ['lorem', 'dolor', 'adipiscing'],
};

const article1EditDifferentUser = {
  userId: '5fbd10e9ae72de60320df3a1',
  title: 'Article edit with different user',
  text: 'This should throw an error',
  tags: ['should', 'throw', 'error'],
};

const article2 = {
  title: 'Article 2 test title',
  text: 'Velit imperdiet ultrices tempor montes rhoncus bibendum.',
  tags: ['ultrices', 'rhoncus'],
};

beforeAll(async () => {
  await UserModel.insertMany([{
    _id: new mongoose.Types.ObjectId('5fbcf537573c87455a55abe6'),
    name: 'test user',
  }, {
    _id: new mongoose.Types.ObjectId('5fbd10e9ae72de60320df3a1'),
    name: 'test user 2',
  }]);
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();

  collections.forEach(async (collection) => {
    await collection.deleteMany();
  });

  await mongoose.connection.close();
});

test('Should create a new article', (done) => {
  request(app)
    .post('/v1/articles')
    .send(article1)
    .then((res) => {
      expect(res.body).toMatchObject(article1);

      article1._id = res.body._id;
      done();
    });
});

test('Should throw error when not sending userId', (done) => {
  request(app)
    .post('/v1/articles')
    .send(article2)
    .then((res) => {
      expect(res.body.message).toEqual('userId is required');
      done();
    });
});

test('Should edit an article', (done) => {
  request(app)
    .put(`/v1/articles/${article1._id}`)
    .send(article1Edit)
    .then((res) => {
      expect(res.body).toMatchObject(article1Edit);
      expect(res.body._id).toEqual(article1._id);

      done();
    });
});

test('Should return error when updating article from different user', (done) => {
  request(app)
    .put(`/v1/articles/${article1._id}`)
    .send(article1EditDifferentUser)
    .then((res) => {
      expect(res.body.message).toEqual('Can\'t edit article from different user');

      done();
    });
});

test('Should delete an article', (done) => {
  request(app)
    .delete(`/v1/articles/${article1._id}`)
    .then((res) => {
      expect(res.body._id).toEqual(article1._id);

      done();
    });
});

test('Should throw an error when article doesn\'t exist', (done) => {
  request(app)
    .delete('/v1/articles/5fbd15d5c0b0566d7ab69ee9')
    .then((res) => {
      expect(res.body.message).toEqual('Article doesn\'t exist');

      done();
    });
});

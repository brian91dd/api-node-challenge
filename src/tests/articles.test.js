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

const article2 = {
  userId: '5fbcf537573c87455a55abe6',
  title: 'Article 2 test title',
  text: 'Velit imperdiet ultrices tempor montes rhoncus bibendum.',
  tags: ['ultrices', 'rhoncus'],
};

const article3 = {
  userId: '5fbd10e9ae72de60320df3a1',
  title: 'Article 3 test title',
  text: 'Sed ornare sociosqu sociis vel eu venenatis.',
  tags: ['ornare', 'lorem'],
};

beforeAll(async () => {
  const newUser = await UserModel.insertMany([{
    _id: new mongoose.Types.ObjectId('5fbcf537573c87455a55abe6'),
    name: 'test user',
  }, {
    _id: new mongoose.Types.ObjectId('5fbd10e9ae72de60320df3a1'),
    name: 'test user 2',
  }]);

  article1.userId = newUser[0]._id.toString();
  article2.userId = newUser[0]._id.toString();
  article3.userId = newUser[1]._id.toString();
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

      done();
    });
});

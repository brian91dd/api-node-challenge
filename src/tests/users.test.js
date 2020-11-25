const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');

const app = require('../app');
const UserModel = require('../models/user.model');

const authToken = `Bearer ${process.env.ACCESS_TOKEN}`;

const user1 = {
  name: 'test user',
};

const user2 = {
  name: 'test user 2',
};

const user3 = {
  name: 'test user 3',
};

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(async (collection) => {
      await collection.deleteMany({});
    });
  }

  await UserModel.insertMany([user3]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('Should create a new user', (done) => {
  request(app)
    .post('/v1/users')
    .set('Authorization', authToken)
    .attach('avatar', path.join(__dirname, 'assets/test.png'))
    .field('name', user1.name)
    .then((res) => {
      expect(res.body).toHaveProperty('name', user1.name);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('avatar');

      done();
    });
});

test('Should create a new user without avatar', (done) => {
  request(app)
    .post('/v1/users')
    .set('Authorization', authToken)
    .field('name', user2.name)
    .then((res) => {
      expect(res.body).toHaveProperty('name', user2.name);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).not.toHaveProperty('avatar');

      done();
    });
});

test('Should alert duplicated user', (done) => request(app)
  .post('/v1/users')
  .set('Authorization', authToken)
  .attach('avatar', path.join(__dirname, 'assets/test.png'))
  .field('name', user3.name)
  .then((res) => {
    expect(res.body).toEqual({
      message: 'Username already exists',
    });
    done();
  }));

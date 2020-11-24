const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');

const app = require('../app');

const user1 = {
  name: 'test user',
};

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();

  collections.forEach(async (collection) => {
    await collection.deleteMany();
  });

  await mongoose.connection.close();
});

test('Should create a new user', (done) => {
  request(app)
    .post('/v1/users')
    .attach('avatar', path.join(__dirname, 'assets/test.png'))
    .field('name', user1.name)
    .then((res) => {
      expect(res.body).toEqual(user1);

      done();
    });
});

test('Should alert duplicated user', async (done) => request(app)
  .post('/v1/users')
  .attach('avatar', path.join(__dirname, 'assets/test.png'))
  .field('name', user1.name)
  .then((res) => {
    expect(res.body).toEqual({
      message: 'Username already exists',
    });
    done();
  }));

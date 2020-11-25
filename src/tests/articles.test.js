/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const UserModel = require('../models/user.model');
const ArticleModel = require('../models/article.model');

const authToken = `${process.env.ACCESS_TOKEN}`;

const article1 = {
  userId: '5fbcf537573c87455a55abe6',
  title: 'Article test title',
  text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit suspendisse.',
  tags: ['lorem', 'dolor', 'adipiscing'],
};

const article2 = {
  userId: '5fbd10e9ae72de60320df3a1',
  title: 'Article 2 test title',
  text: 'Velit imperdiet ultrices tempor montes rhoncus bibendum.',
  tags: ['lorem', 'rhoncus'],
};

const article3 = {
  userId: '5fbd10e9ae72de60320df3a1',
  title: 'Article 3 test title',
  text: 'Velit imperdiet ultrices tempor montes rhoncus bibendum.',
  tags: ['lorem', 'rhoncus'],
};

const user1 = {
  _id: '5fbcf537573c87455a55abe6',
  name: 'test user article',
};

const user2 = {
  _id: '5fbd10e9ae72de60320df3a1',
  name: 'test user article 2',
};

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(async (collection) => {
      await collection.deleteMany({});
    });
  }

  await UserModel.insertMany([user1, user2].map(
    (item) => ({ ...item, _id: new mongoose.Types.ObjectId(item._id) }),
  ));

  await ArticleModel.insertMany([article1, article2, article3].map(
    (item) => ({ ...item, userId: new mongoose.Types.ObjectId(item.userId) }),
  ));
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST articles', () => {
  test('Should create two new articles', async () => {
    await request(app)
      .post('/v1/articles')
      .set('Authorization', authToken)
      .send(article1)
      .then((res) => {
        expect(res.body).toMatchObject(article1);

        article1._id = res.body._id;
      });

    await request(app)
      .post('/v1/articles')
      .set('Authorization', authToken)
      .send(article2)
      .then((res) => {
        expect(res.body).toMatchObject(article2);

        article2._id = res.body._id;
      });
  });

  test('Should throw error when not sending userId', (done) => {
    const articleWithoutUserId = {
      title: 'This should throw error',
      text: 'Velit imperdiet ultrices tempor montes rhoncus bibendum.',
      tags: ['lorem', 'rhoncus'],
    };

    request(app)
      .post('/v1/articles')
      .set('Authorization', authToken)
      .send(articleWithoutUserId)
      .then((res) => {
        expect(res.body.message).toEqual('A valid userId is required');
        done();
      });
  });

  test('Should throw error if user doesn\'t exist', (done) => {
    const articleWithoutUserId = {
      userId: '5fbd10e9ae72de60320df3b5',
      title: 'This should throw error',
      text: 'Velit imperdiet ultrices tempor montes rhoncus bibendum.',
      tags: ['lorem', 'rhoncus'],
    };

    request(app)
      .post('/v1/articles')
      .set('Authorization', authToken)
      .send(articleWithoutUserId)
      .then((res) => {
        expect(res.body.message).toEqual('User doesn\'t exist');
        done();
      });
  });
});

describe('PUT articles', () => {
  test('Should edit an article', (done) => {
    const article1Edit = {
      ...article1,
      title: 'this is a new title',
    };

    request(app)
      .put(`/v1/articles/${article1._id}`)
      .set('Authorization', authToken)
      .send(article1Edit)
      .then((res) => {
        expect(res.body).toMatchObject(article1Edit);
        expect(res.body._id).toEqual(article1._id);

        done();
      });
  });

  test('Should return error when updating article from different user', (done) => {
    const article1EditDifferentUser = {
      ...article1,
      userId: '5fbd10e9ae72de60320df3a1',
    };

    request(app)
      .put(`/v1/articles/${article1._id}`)
      .set('Authorization', authToken)
      .send(article1EditDifferentUser)
      .then((res) => {
        expect(res.body.message).toEqual('Can\'t edit article from different user');

        done();
      });
  });
});

describe('GET articles', () => {
  test('Should return the articles with a specific tag', (done) => {
    request(app)
      .get('/v1/articles')
      .set('Authorization', authToken)
      .query({ tags: [article1.tags[1]] })
      .then((res) => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toEqual(article1.title);

        done();
      });
  });

  test('Should return the articles with multiple tags', (done) => {
    request(app)
      .get('/v1/articles')
      .set('Authorization', authToken)
      .query({ tags: article3.tags })
      .then((res) => {
        expect(res.body.length).toBe(3);

        done();
      });
  });

  test('Should not return any articles when tag doesn\'t match', (done) => {
    request(app)
      .get('/v1/articles')
      .set('Authorization', authToken)
      .query({ tags: ['noArticle'] })
      .then((res) => {
        expect(res.body.length).toEqual(0);

        done();
      });
  });

  test('Should return any articles with specific title and the user populated', (done) => {
    request(app)
      .get('/v1/articles')
      .set('Authorization', authToken)
      .query({ title: article1.title })
      .then((res) => {
        expect(res.body.length).toEqual(1);
        expect(res.body[0].userId.name).toBe(user1.name);
        done();
      });
  });
});

describe('GET articles', () => {
  test('Should delete an article', (done) => {
    request(app)
      .delete(`/v1/articles/${article1._id}`)
      .set('Authorization', authToken)
      .then((res) => {
        expect(res.body._id).toEqual(article1._id);

        done();
      });
  });

  test('Should throw an error when article doesn\'t exist', (done) => {
    request(app)
      .delete('/v1/articles/5fbd15d5c0b0566d7ab69ee9')
      .set('Authorization', authToken)
      .then((res) => {
        expect(res.body.message).toEqual('Article doesn\'t exist');

        done();
      });
  });
});

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

const userOne = {
  name: 'hoang',
  email: 'hoang@test.jest.com',
  password: '3894asljfgadlkf',
};

beforeEach(async () => {
  await User.deleteMany({});
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  await request(app)
    .post('/create-user')
    .send({
      name: 'hoangnx30',
      email: 'xuanhoang30071999@gmail.com',
      password: 'qweqweasdzxc',
    })
    .expect(201);
});

test('Should signup faild because invalid email', async () => {
  await request(app)
    .post('/create-user')
    .send({
      name: 'hoangnx30',
      email: 'xuanhoang30071999',
      password: 'qweqweasdzxc',
    })
    .expect(400, { error: 'Email is duplicate' });
});

test('Should sign up fail because password contain password', async () => {
  await request(app)
    .post('/create-user')
    .send({
      name: 'hoangnx30',
      email: 'xuanhoang30071999',
      password: 'password',
    })
    .expect(400);
});

test('Login user', async () => {
  await request(app)
    .post('/auth/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

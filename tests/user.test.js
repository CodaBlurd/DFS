const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/index');
const User = require('../src/models/user');

const userOneId = mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '78what??!',
    type: 'client',
    tokens: [{
        token: jwt.sign({ _id: userOneId.toString() }, process.env.JSON_WEB_TOKEN_KEY)
    }]
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should sign up a new user', async () => {
    await request(app).post('/users/signup').send({
        name: 'Coda',
        email: 'coda@tt.com',
        password: 'myPass7878!',
        type: 'client'
    }).expect(201);
    
});

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
    // Add additional assertions here if necessary
});

test('Should not login with incorrect password', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'incorrect pass'
    }).expect(401);
});

test('Should not delete account without authentication', async () => {
    await request(app).delete('/users/me').send().expect(401);
});

test('Should delete account for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(204);
    // Check if the user has been deleted from the database
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

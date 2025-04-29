const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Banning API Test', () => {
  let adminToken;
  let userId;
  let userToken;
  beforeAll(async () => {
    // connect to test database if needed
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // register and login as admin
    const resLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email:'admin@test.com', password:'adminadmin' });
    adminToken = resLogin.body.token;

    // register a normal user to ban
    const resUser = await request(app)
      .post('/api/v1/auth/login')
      .send({email:'user@test.com', password:'useruser'});
    userToken = resUser.body.token;
    const getUser = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);
    userId = getUser.body.data._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('Ban a user', async () => {
    const res = await request(app)
      .put(`/api/v1/banned/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason:'Violation', unbanDate:'2099-10-09T17:00:00.000Z' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBe(userId);
    expect(res.body.data.reason).toBe('Violation');
    expect(res.body.data.unbanDate).toBe('2099-10-09T17:00:00.000Z');
  });

  it('List All banned users', async () => {
    const res = await request(app)
      .get('/api/v1/banned')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    var count = res.body.count;
    expect(count).toBeGreaterThanOrEqual(1);
    expect(res.body.data[count-1].user._id).toBe(userId);
  });

  it('List all banned users : error',async () => {
        const res = await request(app)
        .get('/api/v1/banned/')
        .set('Authorization',`Bearer 123456789`);
        expect(res.status).toBe(500);
   });

  it('Unban user', async () => {
    const res = await request(app)
      .delete(`/api/v1/banned/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({});
  });
});
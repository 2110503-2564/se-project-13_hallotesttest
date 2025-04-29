const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Banning API Test', () => {
  let adminToken;
  let userId;
  let userToken;
  let banId;
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
    banId = res.body.data._id;
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBe(userId);
    expect(res.body.data.reason).toBe('Violation');
    expect(res.body.data.unbanDate).toBe('2099-10-09T17:00:00.000Z');
  });

  it('Update Banned user', async () => {
    const res = await request(app)
      .put(`/api/v1/banned/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason:'Violation 2', unbanDate:'2099-10-10T17:00:00.000Z' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBe(userId);
      expect(res.body.data.reason).toBe('Violation 2');
      expect(res.body.data.unbanDate).toBe('2099-10-10T17:00:00.000Z');
  });

  it('Banned User : Not found', async () => {
    const res = await request(app)
      .put(`/api/v1/banned/6806054bf9b0f8e89dc2c148`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason:'Violation 2', unbanDate:'2099-10-10T17:00:00.000Z' });
      expect(res.status).toBe(404);
  });

  it('Banned User : Error', async () => {
    const res = await request(app)
      .put(`/api/v1/banned/123345678910`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason:'Violation 2', unbanDate:'2099-10-10T17:00:00.000Z' });
      expect(res.status).toBe(500);
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
        .get('/api/v1/banned/...')
        .set('Authorization',`Bearer ${adminToken}`);
        expect(res.status).toBe(500);
   });

   it('List 1 banned user',async () => {
    const res = await request(app)
    .get(`/api/v1/banned/${banId}`)
    .set('Authorization',`Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(banId);
    expect(res.body.data.user._id).toBe(userId);
    });
    
    it('List 1 banned user : Not found',async () => {
    const res = await request(app)
    .get(`/api/v1/banned/${userId}`)
    .set('Authorization',`Bearer ${adminToken}`);
    expect(res.status).toBe(404);
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
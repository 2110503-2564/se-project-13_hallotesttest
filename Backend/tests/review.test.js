const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Review = require('../models/Review');
describe('Review System Tests', () => {
  let adminToken;
  let userToken;
  let userId;
  let CoWorkingId;
  let reviewId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    // login admin
    const resLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email:'admin@test.com', password:'adminadmin' });
    adminToken = resLogin.body.token;

    // create coworking
    const createCoWorking = await request(app)
      .post('/api/v1/coworkings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: "Test Co-Working",
        address: "test",
        district: "test",
        province: "test",
        postalcode: "10000",
        time: "9.00-18.00"
      });
    CoWorkingId = createCoWorking.body.data._id;

    // login normal user
    const resUser = await request(app)
      .post('/api/v1/auth/login')
      .send({ email:'user@test.com', password:'useruser' });
    userToken = resUser.body.token;

    const getUser = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    userId = getUser.body.data._id;
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/v1/coworkings/${CoWorkingId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    await mongoose.disconnect();
  });

  it('No reviews', async () => {
    const res = await request(app)
      .get(`/api/v1/coworkings/${CoWorkingId}/reviews`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toEqual([]);
  });

  it('Create without CoWorkingId', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment:'c', rating:5 });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Please provide the Co-Working Id');
  });

  it('Create Review', async () => {
    const res = await request(app)
      .post(`/api/v1/coworkings/${CoWorkingId}/reviews`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment:'test', rating:5 });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    reviewId = res.body.data._id;
  });

  it('Create Review : Error', async () => {
    const res = await request(app)
      .post(`/api/v1/coworkings/${CoWorkingId}/reviews`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment:'test', rating:'dsfad' });
    expect(res.status).toBe(400);
  });

  it('Create same Review', async () => {
    const res = await request(app)
      .post(`/api/v1/coworkings/${CoWorkingId}/reviews`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment:'test2', rating:4 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/only create 1 rating review/);
  });

  it('List all reviews in CoWorkings', async () => {
    const res = await request(app).get(`/api/v1/coworkings/${CoWorkingId}/reviews`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it('List all reviews', async () => {
    const res = await request(app).get(`/api/v1/reviews`);
    expect(res.status).toBe(200);
  });

  it('Error Update', async () => {
    const res = await request(app)
      .put('/api/v1/coworkings/invalid/reviews/123')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment:'x', rating:3 });
    expect(res.status).toBe(400);
  });

  
  it('Update by other user', async () => {
    // login as second user
    const alt = await request(app)
    .post('/api/v1/auth/register')
      .send({ name:'Alt',email:'alt@test.com',password:'altalt',role:'user' });
    const altLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email:'alt@test.com', password:'altalt' });
      const altToken = altLogin.body.token;
      const res = await request(app)
      .put(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${altToken}`)
      .send({ comment:'no', rating:2 });
    expect(res.status).toBe(401);
  });
  
  it('Update By Owner', async () => {
    const res = await request(app)
    .put(`/api/v1/reviews/${reviewId}`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({ comment:'updated', rating:4 });
    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(4);
  });
  
  it('Delete invalid', async () => {
    const res = await request(app)
    .delete('/api/v1/reviews/123')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(400);
  });
  
  it('Delete by other users', async () => {
    const altLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email:'alt@test.com', password:'altalt' });
    const altToken = altLogin.body.token;
    const res = await request(app)
    .delete(`/api/v1/reviews/${reviewId}`)
    .set('Authorization', `Bearer ${altToken}`);
    expect(res.status).toBe(401);
  });
  
  
  it('Delete by owner', async () => {
    const res = await request(app)
    .delete(`/api/v1/reviews/${reviewId}`)
    .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({});
  });

  it('Delete Not found', async () => {
    const res = await request(app)
    .delete(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
    });

  it('Update not Found', async () => {
    const res = await request(app)
      .put(`/api/v1/coworkings/${CoWorkingId}/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment:'x', rating:3 });
    expect(res.status).toBe(404);
  });
    
});
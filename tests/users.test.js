const request = require('supertest');
const app = require('../server'); // adjust if needed

describe('Users Routes', () => {

  test('GET /users should return 200 and an array', async () => {
    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /users/:id should return 200 or 404', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/users/${fakeId}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /users should return JSON content type', async () => {
    const res = await request(app).get('/users');

    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  test('GET /users/:id with invalid id format should return 500', async () => {
    const res = await request(app).get('/users/not-a-valid-id');

    expect(res.statusCode).toBe(500);
  });

});
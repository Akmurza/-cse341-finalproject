const request = require('supertest');
const app = require('../server'); // adjust if needed

describe('Reviews Routes', () => {

  test('GET /reviews should return 200 and an array', async () => {
    const res = await request(app).get('/reviews');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /reviews/:id should return 200 or 404', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/reviews/${fakeId}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /reviews should return JSON content type', async () => {
    const res = await request(app).get('/reviews');

    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  test('GET /reviews/:id with invalid id format should return 500', async () => {
    const res = await request(app).get('/reviews/not-a-valid-id');

    expect(res.statusCode).toBe(500);
  });

});
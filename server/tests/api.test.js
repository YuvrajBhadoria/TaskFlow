const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow_test';

let user1Token = null;
let user1 = null;
let user2Token = null;
let user2 = null;
let sampleTaskId = null;

before(async () => {
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI);
  }
  // Clear any existing test data
  await User.deleteMany({});
  await Task.deleteMany({});

  // Register User 1
  const res1 = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123'
    });
  assert.equal(res1.status, 201);
  user1Token = res1.body.token;
  user1 = res1.body.user;

  // Register User 2
  const res2 = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password123'
    });
  assert.equal(res2.status, 201);
  user2Token = res2.body.token;
  user2 = res2.body.user;
});

after(async () => {
  // Clean up database and close connection
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
  } catch (err) {
    // ignore
  }
});

test('GET /api/health returns 200 and status ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('Unauthenticated access to /api/tasks returns 401', async () => {
  const res = await request(app).get('/api/tasks');
  assert.equal(res.status, 401);
  assert.equal(res.body.error.code, 'UNAUTHORIZED');
});

test('POST /api/tasks without title returns 400 validation error', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${user1Token}`)
    .send({
      description: 'Missing title'
    });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');
});

test('POST /api/tasks creates a new task and returns 201', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${user1Token}`)
    .send({
      title: 'Finish TaskFlow Guide',
      description: 'Implement backend and frontend with modern standards',
      priority: 'high',
      dueDate: '2026-11-01'
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Finish TaskFlow Guide');
  assert.equal(res.body.status, 'pending');
  assert.equal(res.body.priority, 'high');
  sampleTaskId = res.body._id;
});

test('GET /api/tasks returns list for User 1', async () => {
  const res = await request(app)
    .get('/api/tasks')
    .set('Authorization', `Bearer ${user1Token}`);

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 1);
  assert.equal(res.body[0]._id, sampleTaskId);
});

test('User 2 cannot see User 1 tasks (ownership isolation)', async () => {
  const res = await request(app)
    .get('/api/tasks')
    .set('Authorization', `Bearer ${user2Token}`);

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 0);
});

test('GET /api/tasks/:id with nonexistent valid ID returns 404', async () => {
  const fakeId = new mongoose.Types.ObjectId().toString();
  const res = await request(app)
    .get(`/api/tasks/${fakeId}`)
    .set('Authorization', `Bearer ${user1Token}`);

  assert.equal(res.status, 404);
  assert.equal(res.body.error.code, 'NOT_FOUND');
});

test('GET /api/tasks/:id with invalid ID format returns 400', async () => {
  const res = await request(app)
    .get('/api/tasks/not-a-valid-id')
    .set('Authorization', `Bearer ${user1Token}`);

  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'INVALID_ID');
});

test('User 2 cannot read or update User 1 task (404 not found)', async () => {
  // User 2 tries to GET User 1's task
  const resGet = await request(app)
    .get(`/api/tasks/${sampleTaskId}`)
    .set('Authorization', `Bearer ${user2Token}`);
  assert.equal(resGet.status, 404);

  // User 2 tries to PATCH User 1's task
  const resPatch = await request(app)
    .patch(`/api/tasks/${sampleTaskId}`)
    .set('Authorization', `Bearer ${user2Token}`)
    .send({ status: 'completed' });
  assert.equal(resPatch.status, 404);
});

test('PATCH /api/tasks/:id updates allowed fields and returns 200', async () => {
  const res = await request(app)
    .patch(`/api/tasks/${sampleTaskId}`)
    .set('Authorization', `Bearer ${user1Token}`)
    .send({
      status: 'completed',
      priority: 'low'
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'completed');
  assert.equal(res.body.priority, 'low');
});

test('DELETE /api/tasks/:id deletes task and returns 204 No Content', async () => {
  const res = await request(app)
    .delete(`/api/tasks/${sampleTaskId}`)
    .set('Authorization', `Bearer ${user1Token}`);

  assert.equal(res.status, 204);
  assert.equal(res.text, '');
});

test('GET /api/tasks after delete returns empty array', async () => {
  const res = await request(app)
    .get('/api/tasks')
    .set('Authorization', `Bearer ${user1Token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.length, 0);
});

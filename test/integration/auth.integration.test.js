/* eslint-disable no-undef */
import httpStatus from 'http-status';
import request from 'supertest';
import chai from 'chai';
import app from '../../src/app.js';
import { cryptPassword } from '../../src/services/auth.service.js';
import Users from '../../src/models/users.model.js';

const { expect } = chai;

const agent = request(app);

let user = null;

describe('Authentication API Integration Tests', () => {
  before(async () => {
    user = await new Users({
      username: 'test_user',
      passwordHash: await cryptPassword('test_password'),
    }).save();
  });

  describe('POST login to get a token', () => {
    it('POST login  - Validation, test should fail because no body was set', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('POST login  - Validation, test should fail because password is too short', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'username',
          password: 'short',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors[0].param).to.equal('password');
          expect(res.body.errors[0].msg).to.equal('Invalid value');
          done();
        });
    });

    it('POST login  - Authentication has succeeded and return a token for a USER', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'test_user',
          password: 'test_password',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body).to.be.an('object');
          expect(res.body.tokens).to.be.an('object');
          expect(res.body.tokens.accessToken).to.be.a('object');
          expect(res.body.tokens.accessToken.token).to.be.a('string');
          expect(res.body.tokens.accessToken.expiresIn).to.be.a('string');
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('GET information about an authenticate user', () => {
    let token;

    before(async () => {
      const loginUser = await agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          username: 'test_user',
          password: 'test_password',
        });
      token = loginUser.body.tokens.accessToken.token;
    });

    it('GET status should be rejected (no token send)', (done) => {
      agent.get('/auth/status')
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
          expect(res.body.message).to.equal('Auth token is not supplied');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('GET status should be rejected (wrong token send)', (done) => {
      agent.get('/auth/status')
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
          expect(res.body.message).to.equal('Token is not valid');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('GET status should return user information', (done) => {
      agent.get('/auth/status')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body.auth).to.be.an('object');
          expect(res.body.status).to.equal('Authenticated');
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  after(async () => {
    await user.remove();
  });
});

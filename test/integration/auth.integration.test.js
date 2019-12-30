/* eslint-disable no-undef */
import httpStatus from 'http-status';
import request from 'supertest';
import chai from 'chai';
import app from '../../src/app';
import RefreshToken from '../../src/models/refreshToken.model';

const { expect } = chai;
const agent = request(app);

describe('Authentication API Integration Tests', () => {
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

    it('POST login  - Validation, test should fail because email isn\'t a email', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isNotAnEmail',
          password: 'good password',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0].param).to.equal('email');
          expect(res.body.success).to.equal(false);
          expect(res.body.errors[0].msg).to.equal('Invalid value');
          done();
        });
    });

    it('POST login  - Validation, test should fail because password is too short', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isAn@Email.yes',
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
          email: 'isAn@Email.yes',
          password: 'goodpassword',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body).to.be.an('object');
          expect(res.body.tokens).to.be.an('object');
          expect(res.body.tokens.accessToken).to.be.a('object');
          expect(res.body.tokens.accessToken.token).to.be.a('string');
          expect(res.body.tokens.accessToken.expiresIn).to.be.a('string');
          expect(res.body.tokens.refreshToken).to.be.a('object');
          expect(res.body.tokens.refreshToken.token).to.be.a('string');
          expect(res.body.tokens.refreshToken.expiresIn).to.be.a('string');
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('POST login  -  Validation, test should fail because apiName in not known in config file for an API', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          apiId: process.env.CLIENT_SECRET_ID,
          apiName: 'unknown_request',
          password: process.env.API_PASSWORD,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0].param).to.equal('apiName');
          expect(res.body.errors[0].msg).to.equal('Invalid value');
          expect(res.body.message).to.equal('Validation error');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('POST login  - should return UNAUTHORIZED because apiId is wrong', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          apiId: 'Unknown',
          apiName: 'other_api',
          password: process.env.API_PASSWORD,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
          expect(res.body.message).to.equal('Wrong apiId or password');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('POST login  - Authentication has succeeded and return a token for an API', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          apiId: process.env.CLIENT_SECRET_ID,
          apiName: 'other_api',
          password: process.env.API_PASSWORD,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body).to.be.an('object');
          expect(res.body.tokens).to.be.an('object');
          expect(res.body.tokens.accessToken).to.be.a('object');
          expect(res.body.tokens.accessToken.token).to.be.a('string');
          expect(res.body.tokens.accessToken.expiresIn).to.be.a('string');
          expect(res.body.tokens.refreshToken).to.be.a('object');
          expect(res.body.tokens.refreshToken.token).to.be.a('string');
          expect(res.body.tokens.refreshToken.expiresIn).to.be.a('string');
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('POST refresh to get an access token', () => {
    let refreshToken;
    let apiRefreshToken;

    before(async () => {
      const user = await agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isAn@Email.yes',
          password: 'goodpassword',
        });
      const api = await agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          apiId: process.env.CLIENT_SECRET_ID,
          apiName: 'other_api',
          password: process.env.API_PASSWORD,
        });
      refreshToken = user.body.tokens.refreshToken.token;
      apiRefreshToken = api.body.tokens.refreshToken.token;
    });


    it('POST request access token without put the refreshToken in the body,'
          + ' it should fail and return UNAUTHORIZED', (done) => {
      agent.post('/auth/refreshToken')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors[0].param).to.equal('refreshToken');
          done();
        });
    });

    it('POST request access token, but a wrong refreshToken is put in the body,'
          + ' it should fail and return UNAUTHORIZED', (done) => {
      agent.post('/auth/refreshToken')
        .set('Accept', 'application/json')
        .send({
          refreshToken: 'wrong_refreshToken',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('RefreshToken is not valid');
          done();
        });
    });

    it('POST request access token, the refreshToken put in the body is good,'
          + ' it should success and return an access token for user token', (done) => {
      agent.post('/auth/refreshToken')
        .set('Accept', 'application/json')
        .send({
          refreshToken,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body.success).to.equal(true);
          expect(res.body.tokens).to.be.an('object');
          expect(res.body.tokens.accessToken).to.be.a('object');
          expect(res.body.tokens.accessToken.token).to.be.a('string');
          expect(res.body.tokens.accessToken.expiresIn).to.be.a('string');
          done();
        });
    });

    it('POST request access token, the refreshToken put in the body is good,'
          + ' it should success and return an access token for api token', (done) => {
      agent.post('/auth/refreshToken')
        .set('Accept', 'application/json')
        .send({
          refreshToken: apiRefreshToken,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body.success).to.equal(true);
          expect(res.body.tokens).to.be.an('object');
          expect(res.body.tokens.accessToken).to.be.a('object');
          expect(res.body.tokens.accessToken.token).to.be.a('string');
          expect(res.body.tokens.accessToken.expiresIn).to.be.a('string');
          done();
        });
    });

    it('POST request access token, but the refreshToken put in the body has expired,'
          + ' it should fail and return UNAUTHORIZED', (done) => {
      RefreshToken.updateOne({ token: refreshToken }, {
        expiresIn: '2000-01-23 11:29:14.794Z',
      }, () => {
        describe('POST login to get a token for USER', () => {
          agent.post('/auth/refreshToken')
            .set('Accept', 'application/json')
            .send({
              refreshToken,
            })
            .end((err, res) => {
              expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
              expect(res.body.success).to.equal(false);
              expect(res.body.message).to.equal('refreshToken expired');
              done();
            });
        });
      });
    });
  });

  describe('GET information about an authenticate user', () => {
    let token;
    let apiToken;

    before(async () => {
      const user = await agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isAn@Email.yes',
          password: 'goodpassword',
        });
      const api = await agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          apiId: process.env.CLIENT_SECRET_ID,
          apiName: 'other_api',
          password: process.env.API_PASSWORD,
        });
      token = user.body.tokens.accessToken.token;
      apiToken = api.body.tokens.accessToken.token;
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
        .set('Authorization', `Bearer ${ token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body.auth).to.be.an('object');
          expect(res.body.status).to.equal('authenticated');
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('GET status should return api information', (done) => {
      agent.get('/auth/status')
        .set('Authorization', `Bearer ${ apiToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body.auth).to.be.an('object');
          expect(res.body.status).to.equal('authenticated');
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
});

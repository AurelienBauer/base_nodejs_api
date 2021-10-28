/* eslint-disable no-undef */
import httpStatus from 'http-status';
import request from 'supertest';
import chai from 'chai';
import app from '../../src/app.js';

const { expect } = chai;
const agent = request(app);

describe('Global API Integration Tests', () => {
  it('GET unexisting url, should return 404 in a JSON body', (done) => {
    agent.get('/unexisting_url')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        expect(res.body.success).to.equal(false);
        done();
      });
  });

  it('GET request api status', (done) => {
    agent.get('/status')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(httpStatus.OK);
        expect(res.body.api_name).to.equal(process.env.PROJECT_NAME);
        expect(res.body.api_status).to.equal('Ruing');
        expect(res.body.success).to.equal(true);
        done();
      });
  });
});

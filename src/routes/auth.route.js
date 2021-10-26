import { Router } from 'express';
import { login, refreshToken, status } from '../controllers/auth.controller.js';
import { checkToken, checkRefreshToken } from '../middlewares/auth.middleware.js';
import { loginUserValidator, refreshTokenValidator } from '../validator/auth.validator.js';

const router = Router();

/**
 * @api {post} /auth/login Login
 * @apiDescription Get an token
 * @apiVersion 1.0.0
 * @apiName Get an access token
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiHeader {String}        Content-Type   application/json
 *
 * @apiParam  {String}        email          User's email
 * @apiParam  {String {6..}}  password       User's password
 *
 * @apiSuccess  {Object}  tokens                        Token Object
 * @apiSuccess  {Object}  tokens.accessToken            Access Token Object
 * @apiSuccess  {String}  tokens.accessToken.token      Access Token
 * @apiSuccess  {String}  tokens.accessToken.expiresIn  Access Token's expiration date
 * @apiSuccess  {Object}  tokens.refreshToken           Refresh Token Object
 * @apiSuccess  {String}  tokens.refreshToken.token     Refresh Token
 * @apiSuccess  {String}  tokens.refreshToken.expiresIn Refresh Token's expiration date
 * @apiSuccess  {String}  message                       A message to  describe the request
 *                                                          response status
 * @apiSuccess  {Bool}    success                       True if the request succeed, otherwise false
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "tokens": {
 *      "accessToken": {
 *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJlbWFpbEBzaG91bF9
 *          iZV91bmlxdWUuY29tIiwiaWF0IjoxNTc3MTg2OTU5LCJleHAiOjMxNTQzNzM5MTh9.HBQIt65gNhJuek8V
 *          sVWrx2c5HHcqzcYevJSoTWF-Z1I",
 *          "expiresIn": "2019-12-24T11:29:19.497Z"
 *      },
 *      "refreshToken": {
 *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJlbWFpbEBzaG91bF9iZ
 *          V91bmlxdWUuY29tIiwiaWF0IjoxNTc3MTg2OTU0LCJleHAiOjE1NzcxODY5NTR9.PYKMWv1zzaSQy7yIRL6t
 *          TL8XblEZwbgLliRq7ujS96U",
 *          "expiresIn": "2020-01-23T11:29:14.794Z"
 *      }
 *  },
 *  "message": "Authentication successful!",
 *  "success": true
 *}
 *
 * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized      Incorrect refreshToken
 */
router
  .post(
    '/login',
    loginUserValidator,
    login,
  );

/**
 * @api {post} /auth/refreshToken RefreshToken
 * @apiDescription Generate a new access token if the refresh Token sent is still valid
 * @apiVersion 1.0.0
 * @apiName Re-generate AccessToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiHeader {String}        Content-Type   application/json
 *
 * @apiParam  {String}        refreshToken   User's refreshToken
 *
 * @apiSuccess  {Object}  tokens              Token Object
 * @apiSuccess  {String}  tokens.accessToken  Access Token
 * @apiSuccess  {String}  tokens.expiresIn    Access Token's expiration date
 * @apiSuccess  {String}  message             A message to  describe the request response status
 * @apiSuccess  {Bool}    success             True if the request succeed, otherwise false
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *{
 *  "tokens": {
 *      "accessToken": {
 *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJlbWFpbEBzaG91bF9
 *          iZV91bmlxdWUuY29tIiwiaWF0IjoxNTc3MTkyMDQ5LCJleHAiOjMxNTQzODQwOTh9.lKle9qnAZUo_pRH3
 *          WNHpgxnTK6nq-H8JrIQDgQsWF3c",
 *          "expiresIn": "2019-12-24T12:54:09.935Z"
 *      }
 *  },
 *  "message": "Regenerate accessToken successfully!",
 *  "success": true
 *}
 *
 * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized      Incorrect email or password
 *                                                (TO DO in file auth.controller)
 */
router
  .post(
    '/refreshToken',
    refreshTokenValidator,
    checkRefreshToken,
    refreshToken,
  );

/**
 * @api {get} /auth/status Get Information
 * @apiDescription Extract information about Authorization token sent
 * @apiVersion 1.0.0
 * @apiName User information
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiHeader {String}    Authorization       Bearer + User's access token
 *
 * @apiSuccess  {String}  authUser            Authenticate user Object
 * @apiSuccess  {String}  authUser.id         Authenticate user's id
 * @apiSuccess  {String}  authUser.email      Authenticate user's email
 * @apiSuccess  {String}  status              Authenticate user's status
 * @apiSuccess  {String}  success             True if the request succeed, otherwise false
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "authUser": {
 *      "id": "1868280677287",
 *      "email": "useremail@shoul_be_unique.com"
 *   },
 *  "status": "authenticated",
 *  "success": true
 * }
 *
 * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized      Incorrect email or password
 *                                                (TO DO in file auth.controller)
 */
router
  .get(
    '/status',
    checkToken,
    status,
  );

export default router;

import { sysStatus } from '../services/sysStatus.service.js';

// eslint-disable-next-line import/prefer-default-export
export const status = (req, res) => res.json({
  api_name: process.env.PROJECT_NAME,
  api_status: sysStatus.api_staus,
  mongodb: sysStatus.mongodb_status,
});

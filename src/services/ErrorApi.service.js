import httpStatus from 'http-status';

/**
 * Class representing an API error.
 */
export default class ErrorApi extends Error {
  constructor(
    {
      message,
      errors,
      stack,
      status = httpStatus.INTERNAL_SERVER_ERROR,
      isPublic = false,
    },
  ) {
    super(message);
    this.message = message || httpStatus[status];
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.stack = stack;
  }
}

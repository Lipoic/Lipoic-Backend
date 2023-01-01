import { Response } from 'express';

import { ResponseStatusCode, HttpStatusCode } from '#';

/**
 * The response body of the API response.
 */
export interface APIResponseBody<T> {
  code: ResponseStatusCode;
  data?: T;
}

/**
 * Send a api response body to the client.
 * @param res The response object from express.
 * @param body The response body.
 * @param httpStatusCode The HTTP status code.
 */
export function sendResponse<T>(
  res: Response,
  body: APIResponseBody<T>,
  httpStatusCode = HttpStatusCode.OK
): void {
  res.status(httpStatusCode).json(body);
}

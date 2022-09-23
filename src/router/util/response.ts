import { Response } from 'express';

import {
  getResponseStatusCodeData,
  ResponseStatusCode,
  HttpStatusCode,
} from '#';

export interface APIResponseData<T> {
  http_status_code: HttpStatusCode;
  response_status_code: ResponseStatusCode;
  message: string;
  data?: T;
}

export function createResponse<T>(
  http_status_code = HttpStatusCode.OK,
  response_status_code: ResponseStatusCode,
  data?: T
): APIResponseData<T> {
  return {
    message: getResponseStatusCodeData(response_status_code).message,
    http_status_code,
    response_status_code,
    data: data,
  };
}

export function sendResponse<T>(
  res: Response,
  responseData: APIResponseData<T>
): void {
  const { message, data, http_status_code, response_status_code } =
    responseData;
  res.status(http_status_code).json({ data, message, response_status_code });
}

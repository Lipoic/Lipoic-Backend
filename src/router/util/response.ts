import { Response } from 'express';

import { getCodeData, ResponseStatusCode, HttpStatusCode } from '#';

export interface APIResponseData<T> {
  http_status_code: HttpStatusCode;
  response_status_code: ResponseStatusCode;
  message: string;
  data: T;
}

export const createAPIResponse = (
  response_status_code: ResponseStatusCode,
  http_status_code: HttpStatusCode = 200,
  data?: any
): APIResponseData<typeof data> => {
  const responsePack: APIResponseData<typeof data> = {
    message: getCodeData(response_status_code).message,
    response_status_code,
    http_status_code,
    data: data,
  };
  return responsePack;
};

export const sendResponse = (
  responseRef: Response,
  responsePack: APIResponseData<any>
) => {
  responseRef.status(responsePack.http_status_code).json(responsePack);
};

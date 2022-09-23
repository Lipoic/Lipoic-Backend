import { Response } from 'express';

import { getCodeData, ResponseStatusCode, HttpStatusCode } from '#';

export interface APIResponseData<T> {
  http_status_code: HttpStatusCode;
  response_status_code: ResponseStatusCode;
  message: string;
  data?: T;
}

export function createAPIResponse<DataType>(
  response_status_code: ResponseStatusCode,
  http_status_code: HttpStatusCode = 200,
  data?: DataType
): APIResponseData<DataType> {
  return {
    message: getCodeData(response_status_code).message,
    response_status_code,
    http_status_code,
    data: data,
  };
}

export const sendResponse = (
  responseRef: Response,
  responsePack: APIResponseData<any>
) => {
  responseRef.status(responsePack.http_status_code).json(responsePack);
};

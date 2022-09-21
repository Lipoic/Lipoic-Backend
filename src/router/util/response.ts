import { Response } from 'express';

import { getCodeData, ResponseStatusCode, HttpStatusCode } from '#';

export interface APIResponseData {
  http_status_code: HttpStatusCode;
  response_status_code: ResponseStatusCode;
  message: string;
  data: any;
}

export const CreateAPIResponse = (
  response_status_code: ResponseStatusCode,
  http_status_code: HttpStatusCode = 200,
  data?: any
): APIResponseData => {
  const responsePack: APIResponseData = {
    message: getCodeData(response_status_code).message,
    response_status_code,
    http_status_code,
    data: data,
  };
  return responsePack;
};

export const SendResponse = (
  responseRef: Response,
  responsePack: APIResponseData
) => {
  responseRef.status(responsePack.http_status_code).json(responsePack);
};

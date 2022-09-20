export enum StatusCode {
  OK = 200,
  NOT_FOUND = 404,
}

enum StatusCodeMessage {
  OK = 'OK',
  NOT_FOUND = 'Resource not found.',
}

type StatusCodeKeys = keyof typeof StatusCode;

export const getStatusCodeData = (status: StatusCode) => {
  return {
    message: StatusCodeMessage[<StatusCodeKeys>StatusCode[status]],
    status,
  };
};

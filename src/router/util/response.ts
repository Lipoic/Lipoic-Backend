import { Response } from 'express';

import { getStatusCodeData, StatusCode } from '#';

interface IAPIResponse<D> {
  code: number;
  message: string;
  data?: D;
}

export class APIResponse<D = unknown> {
  constructor(public status_code: StatusCode, public data?: D) {}

  serialize(): IAPIResponse<D> {
    const { code, message } = getStatusCodeData(this.status_code);

    return {
      code,
      message,
      data: this.data,
    };
  }

  send(res: Response): void {
    const { code } = getStatusCodeData(this.status_code);

    // if the status code is a custom code, set it to 400 (Bad Request)
    const status = code >= 100 ? code : 400;

    res.status(status).json(this.serialize());
  }
}

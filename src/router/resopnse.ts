import { StatusCode } from '@/router/status_code';
import { Response } from 'express';

interface IAPIResponse<D> {
  code: number;
  message: string;
  data?: D;
}

export class APIResponse<D = unknown> {
  constructor(public status_code: StatusCode, public data?: D) {}

  serialize(): IAPIResponse<D> {
    return {
      code: this.status_code.code,
      message: this.status_code.message,
      data: this.data,
    };
  }

  send(res: Response): void {
    const code = this.status_code.code;
    // if the status code is a custom code, set it to 400 (Bad Request)
    const status = code >= 100 ? code : 400;

    res.status(status).json(this.serialize());
  }
}

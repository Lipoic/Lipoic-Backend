import { Code } from '@/router/code';
import { Response } from 'express';

interface IAPIResponse<D> {
  code: number;
  message: string;
  data?: D;
}

export class APIResponse<D = unknown> {
  constructor(public code: Code, public data?: D) {}

  serialize(): IAPIResponse<D> {
    return {
      code: this.code.code,
      message: this.code.message,
      data: this.data,
    };
  }

  send(res: Response): void {
    const code = this.code.code;
    // if the status code is a custom code, set it to 400 (Bad Request)
    const status = code >= 100 ? code : 400;

    res.status(status).json(this.serialize());
  }
}

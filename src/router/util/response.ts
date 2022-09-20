import { Response } from 'express';

import { getCodeData, Code, getStatusCodeData, StatusCode } from '#';

interface IAPIResponse<D> {
  code: number;
  message: string;
  data?: D;
}

export class APIResponse<D = unknown> {
  constructor(
    public readonly status_code: StatusCode,
    public readonly code: Code,
    public readonly data?: D
  ) {}

  serialize(): IAPIResponse<D> {
    const { code, message } = getCodeData(this.code);

    return {
      code,
      message,
      data: this.data,
    };
  }

  send(res: Response): void {
    const { status } = getStatusCodeData(this.status_code);

    res.status(status).json(this.serialize());
  }
}

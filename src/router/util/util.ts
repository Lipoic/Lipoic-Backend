import { Request } from 'express';

export function getIp(req: Request): string {
  const proxyByCloudflare = process.env.CLOUDFLARE === 'true';

  if (proxyByCloudflare) {
    // #swagger.auto = false
    return (req.headers['cf-connecting-ip'] || req.ip) as string;
  } else {
    return req.ip;
  }
}

import { Response } from "express";
export function errorResponse(res: Response, code = 401, err?: Error) {
  return res.json({code, message: err?.message || '异常错误'});
}
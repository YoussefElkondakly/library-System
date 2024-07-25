export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCod: number) {
    super(message);
    this.statusCode = statusCod;
    this.status = `${statusCod}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    //the next Line I do Not Know it
    Error.captureStackTrace(this, this.constructor);
  }
}

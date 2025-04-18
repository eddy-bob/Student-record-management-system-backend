// src/common/dto/success-response.dto.ts
export class SuccessResponse<T> {
  statusCode: number;
  message: string;
  data: T;

  constructor(
    data: T,
    message: string = 'Request successful',
    statusCode: number = 200,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

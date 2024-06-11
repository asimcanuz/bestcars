export interface Response<T> {
  status: boolean;
  statusCode: number;
  message: string;
  result: T;
}

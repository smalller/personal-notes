import * as axios from 'axios';

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosInstance): Promise<any>;
  }
  interface AxiosResponse {
    code: number;
    message?: string;
  }
}

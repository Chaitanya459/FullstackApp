import axios, { AxiosError } from 'axios';
import Cookies from 'universal-cookie';

const Axios = axios.create({
  adapter: `fetch`,
  baseURL: `/api`,
});

export interface APIResponse<T = Record<string, any>> {
  data: T;
  message: string;
  status: string;
}

Axios.interceptors.response.use((res) => res, (err: AxiosError) => {
  if (err?.response?.data === `Invalid or no session`) {
    const cookies = new Cookies();
    cookies.remove(`spa_token`);
    window.location.href = `/login`;
  }

  // eslint-disable-next-line no-console
  console.error(err, err?.response);

  return Promise.reject(err);
});

export default Axios;

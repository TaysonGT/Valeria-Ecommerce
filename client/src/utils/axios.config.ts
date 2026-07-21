import axios, {AxiosRequestHeaders} from 'axios'
import { httpErrorHandler } from './AxiosErrorHandler'
import Cookies from 'js-cookie'

interface Props extends AxiosRequestHeaders {
  Authorization: string;
  user_data: string;
}

export const wakeUpState = {
  listeners: new Set<(v: boolean) => void>(),
  hasWokenOnce: false, // add this
};

const notify = (v: boolean) => wakeUpState.listeners.forEach(fn => fn(v));

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
axios.interceptors.request.use((config) => {

  if (!wakeUpState.hasWokenOnce) {
    (config as any)._coldTimer = setTimeout(() => notify(true), 2500);
  }

   const current_user = Cookies.get('current_user');
   const authorization = Cookies.get('access_token');
   
   config.headers={
    Authorization: `Bearer ${authorization}`,
    user_data: `Bearer ${current_user}`
   } as Props

   return config
  },
  function (error) {
    return httpErrorHandler(error)
  }
);

axios.interceptors.response.use(
  (response) => {
    clearTimeout((response.config as any)._coldTimer);
    notify(false);
    wakeUpState.hasWokenOnce = true; // mark it done, permanently, for this session
    return response;
  },
  (error) => {
    if (error.config?._coldTimer) {
      clearTimeout(error.config._coldTimer);
      notify(false);
    }
    return Promise.reject(error);
  }
);
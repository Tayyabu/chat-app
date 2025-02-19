import useAuthStore from "../state/authStore.ts";

import { api } from "./api.ts";
import { refresh } from "../lib/utils.ts";

api.interceptors.request.use(
  async (req) => {
    if (!req.headers.Authorization) {
      req.headers.Authorization = `Bearer ${
        useAuthStore.getState().accessToken
      }`;
    }

    return req;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const prevReq = err?.config;

    if (err.status === 403 && prevReq.sent) {
      const newAccessToken = await refresh();
      prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
      err.config.sent = true;
      return api(prevReq);
    }

    return Promise.reject(err);
  }
);

export default api;

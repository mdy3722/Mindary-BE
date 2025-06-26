// src/api/api.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", 
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 에러 + retry 안 된 요청에 대해서만
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const res = await axios.post("http://localhost:8000/mindary/accounts/token/refresh/", {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        // 기존 요청에 access token 새로 넣고 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/mindary/login"; // 실패 시 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 요청 보낼 때 access_token 자동으로 헤더에 붙이기
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

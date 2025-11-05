import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/",
});

//Ensureing only one refresh call happens at a time.
let isRefreshing = false;
// Storeing requests that failed with 401 status of Unauthorized while a refresh request is in progress.
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); //If refresh failed -rejects them with the error.
    } else {
      prom.resolve(token); //If refresh succeeded- resumes requests with the new token.
    }
  });
  failedQueue = [];
};

// Attach access token before requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//If a request fails with 401 Unauthorized, it triggers the refresh token flow
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      //used _retry flag to avoid infinite loop
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const phoneNumber = localStorage.getItem("phoneNumber");

        const response = await axios.post(
          "http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/authentication/refreshToken",
          { phoneNumber, refreshToken }
        );

        const newToken = response.data.data.token;
        const newRefreshToken = response.data.data.refreshToken;

        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Process all queued requests
        processQueue(null, newToken);

        // Retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        console.error("Refresh token failed:", err);

        // Clear storage and redirect to login on refresh failure
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

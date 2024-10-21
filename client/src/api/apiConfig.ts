import axios from "axios";

// local
const BASE_URL = "http://localhost:8080";

// request headers
const headers = {
  "Content-Type": "application/json",
};

// only public routes
export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers,
});

// only private routes
export const privateRequest = axios.create({
  baseURL: BASE_URL,
  headers,
});

/**
 * configure privateRequest to include token in the header
 * if token is not present in the localStorage or token is expired
 * then logout the user and remove the token from the localStorage
 */
privateRequest.interceptors.request.use((config) => {
  // get token from localStorage
  const TOKEN = localStorage.getItem("pahonaToken");

  // if token is not present in the localStorage
  // then logout the user and remove the token from the localStorage
  if (!TOKEN) {
    logout();
    return config; // Exit the interceptor early
  }

  // get current date
  let currentDate = new Date();

  // decode the token
  const decodedToken = JSON.parse(atob(TOKEN.split(".")[1]));

  // if token is expired
  // then logout the user and remove the token from the localStorage
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    logout();
  } else {
    config.headers["Authorization"] = `Bearer ${TOKEN}`;
  }

  return config;
});

// logout method
export const logout = () => {
  // remove token from the localStorage
  localStorage.removeItem("pahonaToken");
  // Redirect to the login page using plain JavaScript
  window.location.href = "/";
};

export default privateRequest;

import axios from "axios";

const URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACK_DEV_URL
    : process.env.REACT_APP_BACK_URL;

export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});

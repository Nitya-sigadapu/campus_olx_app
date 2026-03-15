import axios from "axios";

const API = axios.create({
  baseURL: "http://campus-olx-application.onrender.com/api"
});

export default API;
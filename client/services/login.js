import axios from "axios";
import { baseUrl } from "./users";

const apiUrl = `${baseUrl}/api/login`

const login = (values) => {
  const request = axios.post(apiUrl, values)
  return request;
}

export default { login }
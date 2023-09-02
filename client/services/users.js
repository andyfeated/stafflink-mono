import axios from "axios";

export const baseUrl = process.env.NEXT_PUBLIC_LOCAL_SERVER_BASE_URL;

const apiUrl = `${baseUrl}/api/users`

const signUp = (values) => {
  const request = axios.post(apiUrl, values)
  return request;
}

export default { signUp }
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_LOCAL_SERVER_BASE_URL;

const apiUrl = `${baseUrl}/api/users`

const signUp = (values) => {
  console.log(baseUrl, values, apiUrl)
  const request = axios.post(apiUrl, values)
  return request;
}

export default { signUp }